import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

// ==========================================
// INPUT SCHEMAS
// ==========================================

const nodeTypeSchema = z.enum([
  "scene",
  "choice",
  "jump",
  "condition",
  "start",
  "end",
]);
const endingTypeSchema = z.enum(["good", "neutral", "bad", "secret"]);

const createNodeSchema = z.object({
  visualNovelId: z.string(),
  type: nodeTypeSchema,
  label: z.string().default("New Node"),
  positionX: z.number(),
  positionY: z.number(),
  // Optional fields based on type
  characterId: z.string().optional(),
  speakerName: z.string().optional(),
  dialogue: z.string().optional(),
  dialogueRich: z.string().optional(),
  sceneryImageId: z.string().optional(),
  characterImageId: z.string().optional(),
  backgroundMusicId: z.string().optional(),
  promptText: z.string().optional(),
  targetNodeId: z.string().optional(),
  endingType: endingTypeSchema.optional(),
  finalMessage: z.string().optional(),
  finalMessageRich: z.string().optional(),
});

const updateNodeSchema = z.object({
  id: z.string(),
  label: z.string().optional(),
  positionX: z.number().optional(),
  positionY: z.number().optional(),
  characterId: z.string().nullable().optional(),
  speakerName: z.string().nullable().optional(),
  dialogue: z.string().nullable().optional(),
  dialogueRich: z.string().nullable().optional(),
  sceneryImageId: z.string().nullable().optional(),
  characterImageId: z.string().nullable().optional(),
  backgroundMusicId: z.string().nullable().optional(),
  promptText: z.string().nullable().optional(),
  targetNodeId: z.string().nullable().optional(),
  endingType: endingTypeSchema.nullable().optional(),
  finalMessage: z.string().nullable().optional(),
  finalMessageRich: z.string().nullable().optional(),
});

const createEdgeSchema = z.object({
  visualNovelId: z.string(),
  sourceNodeId: z.string(),
  targetNodeId: z.string(),
  choiceOptionId: z.string().optional(),
  label: z.string().optional(),
  animated: z.boolean().default(true),
});

const updateEdgeSchema = z.object({
  id: z.string(),
  label: z.string().nullable().optional(),
  animated: z.boolean().optional(),
});

const upsertLayoutSchema = z.object({
  visualNovelId: z.string(),
  nodes: z.array(
    z.object({
      id: z.string(),
      type: nodeTypeSchema,
      label: z.string(),
      positionX: z.number(),
      positionY: z.number(),
      data: z.record(z.any()).optional(),
    }),
  ),
  edges: z.array(
    z.object({
      id: z.string().optional(),
      sourceNodeId: z.string(),
      targetNodeId: z.string(),
      choiceOptionId: z.string().optional(),
      label: z.string().optional(),
    }),
  ),
  viewport: z
    .object({
      x: z.number(),
      y: z.number(),
      zoom: z.number(),
    })
    .optional(),
});

const createChoiceOptionSchema = z.object({
  nodeId: z.string(),
  text: z.string(),
  sortOrder: z.number().optional(),
});

const updateChoiceOptionSchema = z.object({
  id: z.string(),
  text: z.string().optional(),
  sortOrder: z.number().optional(),
});

const reorderChoiceOptionsSchema = z.object({
  nodeId: z.string(),
  optionIds: z.array(z.string()),
});

// ==========================================
// HELPER FUNCTIONS
// ==========================================

async function verifyOwnership(
  db: Parameters<
    Parameters<typeof protectedProcedure.mutation>[0]
  >[0]["ctx"]["db"],
  visualNovelId: string,
  userId: string,
) {
  const visualNovel = await db.visual_novel.findUnique({
    where: { id: visualNovelId },
    select: { createdById: true },
  });

  if (!visualNovel) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Visual novel not found",
    });
  }

  if (visualNovel.createdById !== userId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You don't have permission to modify this visual novel",
    });
  }
}

// ==========================================
// ROUTER
// ==========================================

export const visualNovelRouter = createTRPCRouter({
  // ==========================================
  // VISUAL NOVEL CRUD
  // ==========================================

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(100),
        description: z.string().optional(),
        thumbnailId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const visualNovel = await ctx.db.visual_novel.create({
        data: {
          title: input.title,
          description: input.description,
          thumbnailId: input.thumbnailId,
          createdById: ctx.session.user.id,
          // Create default start node
          nodes: {
            create: {
              type: "start",
              label: "Start",
              positionX: 250,
              positionY: 50,
            },
          },
        },
        include: {
          nodes: true,
        },
      });

      return visualNovel;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const visualNovel = await ctx.db.visual_novel.findUnique({
        where: { id: input.id },
        include: {
          thumbnail: { select: { id: true, url: true } },
          createdBy: { select: { id: true, name: true } },
          characters: {
            include: {
              character: {
                select: { id: true, name: true, avatar: true },
              },
            },
          },
          _count: { select: { nodes: true, edges: true } },
        },
      });

      if (!visualNovel) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Visual novel not found",
        });
      }

      // Only allow owner to view unpublished novels
      if (
        !visualNovel.isPublished &&
        visualNovel.createdById !== ctx.session.user.id
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to view this visual novel",
        });
      }

      return visualNovel;
    }),

  getByUser: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;

      const visualNovels = await ctx.db.visual_novel.findMany({
        take: limit + 1,
        where: { createdById: ctx.session.user.id },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { updatedAt: "desc" },
        include: {
          thumbnail: { select: { url: true } },
          _count: { select: { nodes: true, characters: true } },
        },
      });

      let nextCursor: string | undefined;
      if (visualNovels.length > limit) {
        const nextItem = visualNovels.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items: visualNovels.map((vn) => ({
          id: vn.id,
          title: vn.title,
          description: vn.description,
          thumbnailUrl: vn.thumbnail?.url,
          isPublished: vn.isPublished,
          nodeCount: vn._count.nodes,
          characterCount: vn._count.characters,
          updatedAt: vn.updatedAt,
          createdAt: vn.createdAt,
        })),
        nextCursor,
      };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).max(100).optional(),
        description: z.string().nullable().optional(),
        thumbnailId: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await verifyOwnership(ctx.db, input.id, ctx.session.user.id);

      const { id, ...data } = input;
      const visualNovel = await ctx.db.visual_novel.update({
        where: { id },
        data,
      });

      return visualNovel;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await verifyOwnership(ctx.db, input.id, ctx.session.user.id);

      await ctx.db.visual_novel.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  publish: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        isPublished: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await verifyOwnership(ctx.db, input.id, ctx.session.user.id);

      const visualNovel = await ctx.db.visual_novel.update({
        where: { id: input.id },
        data: { isPublished: input.isPublished },
      });

      return visualNovel;
    }),

  duplicate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Get the original visual novel with all its data
      const original = await ctx.db.visual_novel.findUnique({
        where: { id: input.id },
        include: {
          nodes: {
            include: {
              choiceOptions: true,
            },
          },
          edges: true,
          characters: true,
        },
      });

      if (!original) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Visual novel not found",
        });
      }

      // Verify ownership
      await verifyOwnership(ctx.db, input.id, ctx.session.user.id);

      // Create the duplicate with a new title
      const duplicate = await ctx.db.visual_novel.create({
        data: {
          title: `${original.title} (Copy)`,
          description: original.description,
          thumbnailId: original.thumbnailId,
          isPublished: false, // Always start as draft
          viewportX: original.viewportX,
          viewportY: original.viewportY,
          viewportZoom: original.viewportZoom,
          createdById: ctx.session.user.id,
        },
      });

      // Create a mapping of old node IDs to new node IDs
      const nodeIdMap = new Map<string, string>();

      // Duplicate nodes
      for (const node of original.nodes) {
        const newNode = await ctx.db.visual_novel_node.create({
          data: {
            visualNovelId: duplicate.id,
            type: node.type,
            label: node.label,
            positionX: node.positionX,
            positionY: node.positionY,
            characterId: node.characterId,
            speakerName: node.speakerName,
            dialogue: node.dialogue,
            dialogueRich: node.dialogueRich,
            sceneryImageId: node.sceneryImageId,
            characterImageId: node.characterImageId,
            backgroundMusicId: node.backgroundMusicId,
            promptText: node.promptText,
            endingType: node.endingType,
            finalMessage: node.finalMessage,
            finalMessageRich: node.finalMessageRich,
            // targetNodeId will be updated after all nodes are created
          },
        });
        nodeIdMap.set(node.id, newNode.id);

        // Duplicate choice options for this node
        for (const option of node.choiceOptions) {
          await ctx.db.visual_novel_choice_option.create({
            data: {
              nodeId: newNode.id,
              text: option.text,
              sortOrder: option.sortOrder,
            },
          });
        }
      }

      // Update targetNodeId for jump nodes
      for (const node of original.nodes) {
        if (node.targetNodeId && nodeIdMap.has(node.targetNodeId)) {
          const newNodeId = nodeIdMap.get(node.id);
          const newTargetNodeId = nodeIdMap.get(node.targetNodeId);
          if (newNodeId && newTargetNodeId) {
            await ctx.db.visual_novel_node.update({
              where: { id: newNodeId },
              data: { targetNodeId: newTargetNodeId },
            });
          }
        }
      }

      // Duplicate edges with updated node IDs
      for (const edge of original.edges) {
        const newSourceId = nodeIdMap.get(edge.sourceNodeId);
        const newTargetId = nodeIdMap.get(edge.targetNodeId);

        if (newSourceId && newTargetId) {
          await ctx.db.visual_novel_edge.create({
            data: {
              visualNovelId: duplicate.id,
              sourceNodeId: newSourceId,
              targetNodeId: newTargetId,
              label: edge.label,
              animated: edge.animated,
              // choiceOptionId needs to be mapped if present
            },
          });
        }
      }

      // Duplicate character associations
      for (const char of original.characters) {
        await ctx.db.visual_novel_character.create({
          data: {
            visualNovelId: duplicate.id,
            characterId: char.characterId,
          },
        });
      }

      return duplicate;
    }),

  // ==========================================
  // LAYOUT OPERATIONS (Main Editor Operations)
  // ==========================================

  getLayout: protectedProcedure
    .input(z.object({ visualNovelId: z.string() }))
    .query(async ({ ctx, input }) => {
      const visualNovel = await ctx.db.visual_novel.findUnique({
        where: { id: input.visualNovelId },
        include: {
          nodes: {
            include: {
              character: { select: { id: true, name: true } },
              sceneryImage: { select: { id: true, url: true } },
              characterImage: { select: { id: true, url: true } },
              backgroundMusic: { select: { id: true, url: true } },
              choiceOptions: { orderBy: { sortOrder: "asc" } },
              targetNode: { select: { id: true, label: true } },
            },
          },
          edges: {
            include: {
              choiceOption: true,
            },
          },
        },
      });

      if (!visualNovel) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Visual novel not found",
        });
      }

      // Only allow owner to access layout
      if (visualNovel.createdById !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to access this layout",
        });
      }

      // Transform to editor format
      return {
        id: visualNovel.id,
        title: visualNovel.title,
        viewport: {
          x: visualNovel.viewportX,
          y: visualNovel.viewportY,
          zoom: visualNovel.viewportZoom,
        },
        nodes: visualNovel.nodes.map((node) => ({
          id: node.id,
          type: node.type,
          label: node.label,
          position: { x: node.positionX, y: node.positionY },
          data: {
            // Scene data
            characterId: node.characterId,
            characterName: node.character?.name,
            speakerName: node.speakerName,
            dialogue: node.dialogue,
            dialogueRich: node.dialogueRich,
            sceneryImage: node.sceneryImage,
            characterImage: node.characterImage,
            backgroundMusic: node.backgroundMusic,
            // Choice data
            promptText: node.promptText,
            choiceOptions: node.choiceOptions,
            // Jump data
            targetNodeId: node.targetNodeId,
            targetNodeLabel: node.targetNode?.label,
            // End data
            endingType: node.endingType,
            finalMessage: node.finalMessage,
            finalMessageRich: node.finalMessageRich,
          },
        })),
        edges: visualNovel.edges.map((edge) => ({
          id: edge.id,
          source: edge.sourceNodeId,
          target: edge.targetNodeId,
          choiceOptionId: edge.choiceOptionId,
          label: edge.label ?? edge.choiceOption?.text,
          animated: edge.animated,
        })),
      };
    }),

  upsertLayout: protectedProcedure
    .input(upsertLayoutSchema)
    .mutation(async ({ ctx, input }) => {
      const { visualNovelId, nodes, edges, viewport } = input;

      await verifyOwnership(ctx.db, visualNovelId, ctx.session.user.id);

      // Transaction: update all nodes and edges
      await ctx.db.$transaction(async (tx) => {
        // Update viewport if provided
        if (viewport) {
          await tx.visual_novel.update({
            where: { id: visualNovelId },
            data: {
              viewportX: viewport.x,
              viewportY: viewport.y,
              viewportZoom: viewport.zoom,
            },
          });
        }

        // Get existing node IDs
        const existingNodes = await tx.visual_novel_node.findMany({
          where: { visualNovelId },
          select: { id: true },
        });
        const existingNodeIds = new Set(existingNodes.map((n) => n.id));

        // Upsert nodes
        for (const node of nodes) {
          const nodeData = {
            label: node.label,
            positionX: node.positionX,
            positionY: node.positionY,
            ...(node.data ?? {}),
          };

          if (existingNodeIds.has(node.id)) {
            await tx.visual_novel_node.update({
              where: { id: node.id },
              data: nodeData,
            });
          } else {
            await tx.visual_novel_node.create({
              data: {
                id: node.id,
                visualNovelId,
                type: node.type,
                ...nodeData,
              },
            });
          }
        }

        // Delete removed nodes
        const currentNodeIds = new Set(nodes.map((n) => n.id));
        const nodesToDelete = [...existingNodeIds].filter(
          (id) => !currentNodeIds.has(id),
        );
        if (nodesToDelete.length > 0) {
          await tx.visual_novel_node.deleteMany({
            where: { id: { in: nodesToDelete } },
          });
        }

        // Delete all edges and recreate
        await tx.visual_novel_edge.deleteMany({
          where: { visualNovelId },
        });

        // Create edges
        for (const edge of edges) {
          await tx.visual_novel_edge.create({
            data: {
              visualNovelId,
              sourceNodeId: edge.sourceNodeId,
              targetNodeId: edge.targetNodeId,
              choiceOptionId: edge.choiceOptionId,
              label: edge.label,
            },
          });
        }
      });

      return { success: true };
    }),

  updateViewport: protectedProcedure
    .input(
      z.object({
        visualNovelId: z.string(),
        x: z.number(),
        y: z.number(),
        zoom: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await verifyOwnership(ctx.db, input.visualNovelId, ctx.session.user.id);

      await ctx.db.visual_novel.update({
        where: { id: input.visualNovelId },
        data: {
          viewportX: input.x,
          viewportY: input.y,
          viewportZoom: input.zoom,
        },
      });

      return { success: true };
    }),

  // ==========================================
  // NODE OPERATIONS
  // ==========================================

  createNode: protectedProcedure
    .input(createNodeSchema)
    .mutation(async ({ ctx, input }) => {
      await verifyOwnership(ctx.db, input.visualNovelId, ctx.session.user.id);

      const node = await ctx.db.visual_novel_node.create({
        data: input,
        include: {
          character: { select: { id: true, name: true } },
          sceneryImage: { select: { id: true, url: true } },
          characterImage: { select: { id: true, url: true } },
          backgroundMusic: { select: { id: true, url: true } },
          choiceOptions: { orderBy: { sortOrder: "asc" } },
        },
      });

      return node;
    }),

  updateNode: protectedProcedure
    .input(updateNodeSchema)
    .mutation(async ({ ctx, input }) => {
      // Get the node to verify ownership
      const existingNode = await ctx.db.visual_novel_node.findUnique({
        where: { id: input.id },
        select: { visualNovelId: true },
      });

      if (!existingNode) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Node not found",
        });
      }

      await verifyOwnership(
        ctx.db,
        existingNode.visualNovelId,
        ctx.session.user.id,
      );

      const { id, ...data } = input;
      const node = await ctx.db.visual_novel_node.update({
        where: { id },
        data,
        include: {
          character: { select: { id: true, name: true } },
          sceneryImage: { select: { id: true, url: true } },
          characterImage: { select: { id: true, url: true } },
          backgroundMusic: { select: { id: true, url: true } },
          choiceOptions: { orderBy: { sortOrder: "asc" } },
        },
      });

      return node;
    }),

  deleteNode: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingNode = await ctx.db.visual_novel_node.findUnique({
        where: { id: input.id },
        select: { visualNovelId: true },
      });

      if (!existingNode) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Node not found",
        });
      }

      await verifyOwnership(
        ctx.db,
        existingNode.visualNovelId,
        ctx.session.user.id,
      );

      await ctx.db.visual_novel_node.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  duplicateNode: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        offsetX: z.number().default(50),
        offsetY: z.number().default(50),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingNode = await ctx.db.visual_novel_node.findUnique({
        where: { id: input.id },
        include: {
          choiceOptions: { orderBy: { sortOrder: "asc" } },
        },
      });

      if (!existingNode) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Node not found",
        });
      }

      await verifyOwnership(
        ctx.db,
        existingNode.visualNovelId,
        ctx.session.user.id,
      );

      // Create duplicate node with offset position
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, createdAt, updatedAt, choiceOptions, ...nodeData } =
        existingNode;

      const newNode = await ctx.db.visual_novel_node.create({
        data: {
          ...nodeData,
          label: `${nodeData.label} (copy)`,
          positionX: nodeData.positionX + input.offsetX,
          positionY: nodeData.positionY + input.offsetY,
          // Duplicate choice options if any
          choiceOptions: {
            create: choiceOptions.map((opt) => ({
              text: opt.text,
              sortOrder: opt.sortOrder,
            })),
          },
        },
        include: {
          character: { select: { id: true, name: true } },
          sceneryImage: { select: { id: true, url: true } },
          characterImage: { select: { id: true, url: true } },
          backgroundMusic: { select: { id: true, url: true } },
          choiceOptions: { orderBy: { sortOrder: "asc" } },
        },
      });

      return newNode;
    }),

  // ==========================================
  // EDGE OPERATIONS
  // ==========================================

  createEdge: protectedProcedure
    .input(createEdgeSchema)
    .mutation(async ({ ctx, input }) => {
      await verifyOwnership(ctx.db, input.visualNovelId, ctx.session.user.id);

      const edge = await ctx.db.visual_novel_edge.create({
        data: input,
        include: {
          choiceOption: true,
        },
      });

      return edge;
    }),

  deleteEdge: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingEdge = await ctx.db.visual_novel_edge.findUnique({
        where: { id: input.id },
        select: { visualNovelId: true },
      });

      if (!existingEdge) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Edge not found",
        });
      }

      await verifyOwnership(
        ctx.db,
        existingEdge.visualNovelId,
        ctx.session.user.id,
      );

      await ctx.db.visual_novel_edge.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  updateEdge: protectedProcedure
    .input(updateEdgeSchema)
    .mutation(async ({ ctx, input }) => {
      const existingEdge = await ctx.db.visual_novel_edge.findUnique({
        where: { id: input.id },
        select: { visualNovelId: true },
      });

      if (!existingEdge) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Edge not found",
        });
      }

      await verifyOwnership(
        ctx.db,
        existingEdge.visualNovelId,
        ctx.session.user.id,
      );

      const { id, ...data } = input;
      const edge = await ctx.db.visual_novel_edge.update({
        where: { id },
        data,
        include: {
          choiceOption: true,
        },
      });

      return edge;
    }),

  // ==========================================
  // CHOICE OPTIONS
  // ==========================================

  createChoiceOption: protectedProcedure
    .input(createChoiceOptionSchema)
    .mutation(async ({ ctx, input }) => {
      const node = await ctx.db.visual_novel_node.findUnique({
        where: { id: input.nodeId },
        select: { visualNovelId: true, type: true },
      });

      if (!node) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Node not found",
        });
      }

      if (node.type !== "choice") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Choice options can only be added to choice nodes",
        });
      }

      await verifyOwnership(ctx.db, node.visualNovelId, ctx.session.user.id);

      // Get max sortOrder if not provided
      let sortOrder = input.sortOrder;
      if (sortOrder === undefined) {
        const maxSortOrder = await ctx.db.visual_novel_choice_option.aggregate({
          where: { nodeId: input.nodeId },
          _max: { sortOrder: true },
        });
        sortOrder = (maxSortOrder._max.sortOrder ?? -1) + 1;
      }

      const option = await ctx.db.visual_novel_choice_option.create({
        data: {
          nodeId: input.nodeId,
          text: input.text,
          sortOrder,
        },
      });

      return option;
    }),

  updateChoiceOption: protectedProcedure
    .input(updateChoiceOptionSchema)
    .mutation(async ({ ctx, input }) => {
      const existingOption = await ctx.db.visual_novel_choice_option.findUnique(
        {
          where: { id: input.id },
          select: { node: { select: { visualNovelId: true } } },
        },
      );

      if (!existingOption) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Choice option not found",
        });
      }

      await verifyOwnership(
        ctx.db,
        existingOption.node.visualNovelId,
        ctx.session.user.id,
      );

      const { id, ...data } = input;
      const option = await ctx.db.visual_novel_choice_option.update({
        where: { id },
        data,
      });

      return option;
    }),

  deleteChoiceOption: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingOption = await ctx.db.visual_novel_choice_option.findUnique(
        {
          where: { id: input.id },
          select: { node: { select: { visualNovelId: true } } },
        },
      );

      if (!existingOption) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Choice option not found",
        });
      }

      await verifyOwnership(
        ctx.db,
        existingOption.node.visualNovelId,
        ctx.session.user.id,
      );

      await ctx.db.visual_novel_choice_option.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  reorderChoiceOptions: protectedProcedure
    .input(reorderChoiceOptionsSchema)
    .mutation(async ({ ctx, input }) => {
      const node = await ctx.db.visual_novel_node.findUnique({
        where: { id: input.nodeId },
        select: { visualNovelId: true },
      });

      if (!node) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Node not found",
        });
      }

      await verifyOwnership(ctx.db, node.visualNovelId, ctx.session.user.id);

      // Update sortOrder for each option
      await ctx.db.$transaction(
        input.optionIds.map((optionId, index) =>
          ctx.db.visual_novel_choice_option.update({
            where: { id: optionId },
            data: { sortOrder: index },
          }),
        ),
      );

      return { success: true };
    }),

  // ==========================================
  // MEDIA
  // ==========================================

  linkMedia: protectedProcedure
    .input(
      z.object({
        visualNovelId: z.string(),
        mediaId: z.string().optional(),
        folderId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await verifyOwnership(ctx.db, input.visualNovelId, ctx.session.user.id);

      if (!input.mediaId && !input.folderId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Either mediaId or folderId must be provided",
        });
      }

      const link = await ctx.db.visual_novel_media.create({
        data: {
          visualNovelId: input.visualNovelId,
          mediaId: input.mediaId,
          folderId: input.folderId,
        },
        include: {
          media: true,
          folder: true,
        },
      });

      return link;
    }),

  unlinkMedia: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingLink = await ctx.db.visual_novel_media.findUnique({
        where: { id: input.id },
        select: { visualNovelId: true },
      });

      if (!existingLink) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Media link not found",
        });
      }

      await verifyOwnership(
        ctx.db,
        existingLink.visualNovelId,
        ctx.session.user.id,
      );

      await ctx.db.visual_novel_media.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  getMediaLibrary: protectedProcedure
    .input(z.object({ visualNovelId: z.string() }))
    .query(async ({ ctx, input }) => {
      const visualNovel = await ctx.db.visual_novel.findUnique({
        where: { id: input.visualNovelId },
        select: { createdById: true },
      });

      if (!visualNovel) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Visual novel not found",
        });
      }

      if (visualNovel.createdById !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to access this media library",
        });
      }

      const mediaLinks = await ctx.db.visual_novel_media.findMany({
        where: { visualNovelId: input.visualNovelId },
        include: {
          media: true,
          folder: {
            include: {
              media: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return mediaLinks;
    }),

  // ==========================================
  // CHARACTER MANAGEMENT
  // ==========================================

  addCharacter: protectedProcedure
    .input(
      z.object({
        visualNovelId: z.string(),
        characterId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await verifyOwnership(ctx.db, input.visualNovelId, ctx.session.user.id);

      // Verify user owns the character
      const character = await ctx.db.character.findUnique({
        where: { id: input.characterId },
        select: { createdById: true },
      });

      if (!character || character.createdById !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only add your own characters",
        });
      }

      const link = await ctx.db.visual_novel_character.create({
        data: {
          visualNovelId: input.visualNovelId,
          characterId: input.characterId,
        },
        include: {
          character: {
            select: { id: true, name: true, avatar: true },
          },
        },
      });

      return link;
    }),

  removeCharacter: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingLink = await ctx.db.visual_novel_character.findUnique({
        where: { id: input.id },
        select: { visualNovelId: true },
      });

      if (!existingLink) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Character link not found",
        });
      }

      await verifyOwnership(
        ctx.db,
        existingLink.visualNovelId,
        ctx.session.user.id,
      );

      await ctx.db.visual_novel_character.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  getCharacters: protectedProcedure
    .input(z.object({ visualNovelId: z.string() }))
    .query(async ({ ctx, input }) => {
      const visualNovel = await ctx.db.visual_novel.findUnique({
        where: { id: input.visualNovelId },
        select: { createdById: true },
      });

      if (!visualNovel) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Visual novel not found",
        });
      }

      if (visualNovel.createdById !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to access this",
        });
      }

      const characters = await ctx.db.visual_novel_character.findMany({
        where: { visualNovelId: input.visualNovelId },
        include: {
          character: {
            include: {
              avatar: { select: { id: true, url: true } },
            },
          },
        },
        orderBy: { createdAt: "asc" },
      });

      return characters;
    }),

  // ==========================================
  // PUBLIC ENDPOINTS
  // ==========================================

  getPublished: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;

      const visualNovels = await ctx.db.visual_novel.findMany({
        take: limit + 1,
        where: { isPublished: true },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { updatedAt: "desc" },
        include: {
          thumbnail: { select: { url: true } },
          createdBy: { select: { id: true, name: true, image: true } },
          _count: { select: { nodes: true, characters: true } },
        },
      });

      let nextCursor: string | undefined;
      if (visualNovels.length > limit) {
        const nextItem = visualNovels.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items: visualNovels.map((vn) => ({
          id: vn.id,
          title: vn.title,
          description: vn.description,
          thumbnailUrl: vn.thumbnail?.url,
          author: vn.createdBy,
          nodeCount: vn._count.nodes,
          characterCount: vn._count.characters,
          updatedAt: vn.updatedAt,
          createdAt: vn.createdAt,
        })),
        nextCursor,
      };
    }),

  // ==========================================
  // DASHBOARD
  // ==========================================

  getForDashboard: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        search: z.string().optional(),
        status: z.enum(["published", "draft"]).optional(),
        sortBy: z
          .enum(["createdAt", "title", "nodesCount", "charactersCount"])
          .default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, search, status, sortBy, sortOrder } = input;
      const skip = (page - 1) * limit;

      // Build where clause
      const where = {
        createdById: ctx.session.user.id,
        ...(status && {
          isPublished: status === "published",
        }),
        ...(search && {
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }),
      };

      // Build orderBy - handle special cases for count fields
      let orderBy: Record<string, unknown>;
      if (sortBy === "nodesCount") {
        orderBy = { nodes: { _count: sortOrder } };
      } else if (sortBy === "charactersCount") {
        orderBy = { characters: { _count: sortOrder } };
      } else {
        orderBy = { [sortBy]: sortOrder };
      }

      // Get total count and visual novels in parallel
      const [total, visualNovels] = await Promise.all([
        ctx.db.visual_novel.count({ where }),
        ctx.db.visual_novel.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          include: {
            thumbnail: { select: { id: true, url: true } },
            _count: {
              select: {
                nodes: true,
                edges: true,
                characters: true,
              },
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: {
          visualNovels: visualNovels.map((vn) => ({
            id: vn.id,
            title: vn.title,
            description: vn.description,
            thumbnailSrc: vn.thumbnail?.url,
            status: vn.isPublished ? "published" : "draft",
            nodesCount: vn._count.nodes,
            edgesCount: vn._count.edges,
            charactersCount: vn._count.characters,
            createdAt: vn.createdAt.toISOString(),
          })),
          pagination: {
            page,
            limit,
            total,
            totalPages,
          },
        },
      };
    }),
});
