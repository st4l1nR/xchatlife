import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { env } from "@/env";
import jwt from "jsonwebtoken";

// ============================================================================
// Input Schemas
// ============================================================================

const getChatByIdSchema = z.object({
  chatId: z.string(),
});

const getMessagesSchema = z.object({
  chatId: z.string(),
  cursor: z.string().nullish(),
  limit: z.number().min(1).max(100).default(50),
});

const getOrCreateChatSchema = z.object({
  characterId: z.string(),
});

const deleteChatSchema = z.object({
  chatId: z.string(),
});

const resetChatSchema = z.object({
  chatId: z.string(),
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format relative time for chat timestamps
 */
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ============================================================================
// Router
// ============================================================================

export const chatRouter = createTRPCRouter({
  /**
   * Get all chats for current user with last message preview
   * Returns data formatted for SnackChatProps
   */
  getChats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const chats = await ctx.db.chat.findMany({
      where: {
        userId,
        isArchived: false,
      },
      include: {
        character: {
          include: {
            poster: true,
          },
        },
        message: {
          where: {
            isDeleted: false,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        lastMessageAt: { sort: "desc", nulls: "last" },
      },
    });

    // Format for SnackChatProps
    const formattedChats = chats.map((chat) => {
      const lastMessage = chat.message[0];
      return {
        id: chat.id,
        name: chat.character.name,
        message: lastMessage?.content ?? "No messages yet",
        timestamp: lastMessage
          ? formatRelativeTime(lastMessage.createdAt)
          : formatRelativeTime(chat.createdAt),
        avatarSrc: chat.character.poster?.url ?? "/images/girl-poster.webp",
        avatarAlt: chat.character.name,
        href: `/chat/${chat.characterId}`,
        isRead: false, // TODO: Implement read tracking
      };
    });

    return {
      success: true,
      data: {
        chats: formattedChats,
        totalCount: formattedChats.length,
      },
    };
  }),

  /**
   * Get single chat with full character details
   */
  getChatById: protectedProcedure
    .input(getChatByIdSchema)
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const chat = await ctx.db.chat.findUnique({
        where: {
          id: input.chatId,
        },
        include: {
          character: {
            include: {
              poster: true,
              video: true,
              bodyType: true,
              ethnicity: true,
              character_kink: {
                include: {
                  kink: true,
                },
              },
            },
          },
        },
      });

      if (!chat) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chat not found",
        });
      }

      // Verify ownership
      if (chat.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this chat",
        });
      }

      return {
        success: true,
        data: {
          ...chat,
          character: {
            ...chat.character,
            kinks: chat.character.character_kink.map((k) => k.kink),
          },
        },
      };
    }),

  /**
   * Get paginated messages for a chat
   * Uses cursor-based pagination for infinite scroll
   */
  getMessages: protectedProcedure
    .input(getMessagesSchema)
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { chatId, cursor, limit } = input;

      // Verify chat ownership
      const chat = await ctx.db.chat.findUnique({
        where: { id: chatId },
        select: { userId: true },
      });

      if (!chat) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chat not found",
        });
      }

      if (chat.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this chat",
        });
      }

      // Fetch messages with cursor-based pagination
      const messages = await ctx.db.message.findMany({
        where: {
          chatId,
          isDeleted: false,
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
      });

      // Determine next cursor
      let nextCursor: string | undefined = undefined;
      if (messages.length > limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem!.id;
      }

      // Format messages for CardMessageProps
      const formattedMessages = messages.map((msg) => ({
        id: msg.id,
        type: msg.type.toLowerCase() as "text" | "image" | "video" | "audio",
        content: msg.content,
        isFromUser: msg.isFromUser,
        timestamp: msg.createdAt.toISOString(),
      }));

      // Reverse to show oldest first in the UI
      formattedMessages.reverse();

      return {
        success: true,
        data: {
          messages: formattedMessages,
          nextCursor,
        },
      };
    }),

  /**
   * Get existing chat or create new one for a character
   */
  getOrCreateChat: protectedProcedure
    .input(getOrCreateChatSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { characterId } = input;

      // Verify character exists and is accessible
      const character = await ctx.db.character.findUnique({
        where: { id: characterId },
        select: { id: true, isActive: true, isPublic: true, createdById: true },
      });

      if (!character) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Character not found",
        });
      }

      // Check if character is accessible (public or created by user)
      if (!character.isPublic && character.createdById !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this character",
        });
      }

      if (!character.isActive) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This character is no longer available",
        });
      }

      // Try to find existing chat (including archived ones to un-archive)
      const existingChat = await ctx.db.chat.findUnique({
        where: {
          userId_characterId: {
            userId,
            characterId,
          },
        },
      });

      if (existingChat) {
        // Un-archive if it was archived
        if (existingChat.isArchived) {
          await ctx.db.chat.update({
            where: { id: existingChat.id },
            data: { isArchived: false },
          });
        }

        return {
          success: true,
          data: {
            chatId: existingChat.id,
            isNew: false,
          },
        };
      }

      // Create new chat
      const newChat = await ctx.db.chat.create({
        data: {
          userId,
          characterId,
        },
      });

      return {
        success: true,
        data: {
          chatId: newChat.id,
          isNew: true,
        },
      };
    }),

  /**
   * Archive a chat (soft delete)
   */
  deleteChat: protectedProcedure
    .input(deleteChatSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { chatId } = input;

      // Verify chat exists and belongs to user
      const chat = await ctx.db.chat.findUnique({
        where: { id: chatId },
        select: { userId: true },
      });

      if (!chat) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chat not found",
        });
      }

      if (chat.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this chat",
        });
      }

      // Soft delete by archiving
      await ctx.db.chat.update({
        where: { id: chatId },
        data: { isArchived: true },
      });

      return {
        success: true,
      };
    }),

  /**
   * Reset chat - delete all messages but keep the chat
   */
  resetChat: protectedProcedure
    .input(resetChatSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { chatId } = input;

      // Verify chat exists and belongs to user
      const chat = await ctx.db.chat.findUnique({
        where: { id: chatId },
        select: { userId: true },
      });

      if (!chat) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chat not found",
        });
      }

      if (chat.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this chat",
        });
      }

      // Delete all messages in this chat
      await ctx.db.message.deleteMany({
        where: { chatId },
      });

      // Reset lastMessageAt
      await ctx.db.chat.update({
        where: { id: chatId },
        data: { lastMessageAt: null },
      });

      return {
        success: true,
      };
    }),

  /**
   * Generate JWT token for socket authentication
   * Token expires in 5 minutes
   */
  generateSocketToken: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Get user's subscription and token balance for token payload
    const user = await ctx.db.user.findUnique({
      where: { id: userId },
      select: {
        tokenBalance: true,
        subscription: {
          select: {
            status: true,
            billingCycle: true,
          },
        },
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    // Create JWT payload
    const payload = {
      userId,
      subscription: user.subscription?.status ?? "none",
      tokenBalance: user.tokenBalance,
    };

    // Get JWT secret from environment
    const secret = env.SOCKET_JWT_SECRET;
    if (!secret) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Socket authentication is not configured",
      });
    }

    // Sign JWT with 5 minute expiry
    const token = jwt.sign(payload, secret, {
      expiresIn: "5m",
    });

    return {
      success: true,
      data: {
        token,
      },
    };
  }),
});
