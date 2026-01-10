"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { useApp } from "./AppContext";
import { api } from "@/trpc/react";
import { useSocket } from "@/hooks/useSocket";
import { useChatSocket } from "@/hooks/useChatSocket";
import type { SocketMessage, SocketError } from "@/lib/socket";
import type { SnackChatProps } from "@/app/_components/molecules/SnackChat";
import type { CardMessageProps } from "@/app/_components/molecules/CardMessage";
import type { AsideCharacterSummaryProps } from "@/app/_components/organisms/AsideCharacterSummary";
import type { CardPrivateContentProps } from "@/app/_components/molecules/CardPrivateContent";

// ============================================================================
// Types
// ============================================================================

type CallStatus = "ringing" | "connecting" | "connected" | "ended";

type ChatContextValue = {
  // Data
  chats: SnackChatProps[];
  messages: CardMessageProps[];
  selectedChat: SnackChatProps | null;
  character: Omit<AsideCharacterSummaryProps, "className"> | null;
  privateContent: CardPrivateContentProps[];

  // Loading states
  isChatsLoading: boolean;
  isMessagesLoading: boolean;
  isSendingMessage: boolean;

  // Socket state
  isSocketConnected: boolean;
  isSocketConnecting: boolean;
  isCharacterTyping: boolean;
  streamingMessage: string;
  socketError: SocketError | null;

  // Selection
  selectedChatId: string | null;
  selectChat: (chat: SnackChatProps) => void;
  clearSelection: () => void;

  // Actions
  sendMessage: (message: string) => void;
  deleteChat: () => void;
  resetChat: () => void;
  addToFavorites: () => void;
  startTyping: () => void;
  stopTyping: () => void;

  // Dialog controls
  dialogs: {
    privateContent: {
      open: boolean;
      setOpen: (v: boolean) => void;
      onUnlock: (item: CardPrivateContentProps, index: number) => void;
    };
    insufficientTokens: {
      open: boolean;
      setOpen: (v: boolean) => void;
    };
    confirmCall: {
      open: boolean;
      setOpen: (v: boolean) => void;
      isLoading: boolean;
      dontShowAgain: boolean;
      setDontShowAgain: (v: boolean) => void;
      confirm: () => void;
    };
    blockedMicrophone: {
      open: boolean;
      setOpen: (v: boolean) => void;
    };
    activeCall: {
      open: boolean;
      setOpen: (v: boolean) => void;
      status: CallStatus;
      duration: string;
      hangUp: () => void;
    };
  };

  // Aside controls (desktop)
  aside: {
    visible: boolean;
    toggle: () => void;
  };
};

// ============================================================================
// Mock Data Type
// ============================================================================

export type ChatContextMock = {
  chats: SnackChatProps[];
  messages: CardMessageProps[];
  character: Omit<AsideCharacterSummaryProps, "className">;
  privateContent?: CardPrivateContentProps[];
};

// ============================================================================
// Context
// ============================================================================

const ChatContext = createContext<ChatContextValue | null>(null);

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatContextProvider");
  }
  return context;
}

// ============================================================================
// Provider
// ============================================================================

export function ChatContextProvider({
  children,
  mock,
  initialChatId,
}: {
  children: React.ReactNode;
  mock?: ChatContextMock;
  initialChatId?: string;
}) {
  const { tokensAvailable } = useApp();
  const utils = api.useUtils();

  // -------------------------------------------------------------------------
  // Selection State
  // -------------------------------------------------------------------------
  const [selectedChatId, setSelectedChatId] = useState<string | null>(
    initialChatId ?? null,
  );

  // -------------------------------------------------------------------------
  // Socket Connection
  // -------------------------------------------------------------------------
  const {
    isConnected: isSocketConnected,
    isConnecting: isSocketConnecting,
    error: socketError,
    connect: connectSocket,
  } = useSocket();

  // Connect to socket on mount (only if not in mock mode)
  useEffect(() => {
    if (!mock) {
      void connectSocket();
    }
  }, [mock, connectSocket]);

  // -------------------------------------------------------------------------
  // Data (mock or tRPC) - Only fetch if no mock provided
  // -------------------------------------------------------------------------

  // Fetch chats list
  const { data: chatsData, isLoading: chatsLoading } =
    api.chat.getChats.useQuery(undefined, { enabled: !mock });
  const chats = useMemo(
    () => mock?.chats ?? chatsData?.data?.chats ?? [],
    [mock?.chats, chatsData],
  );
  const isChatsLoading = mock ? false : chatsLoading;

  // Fetch chat details (for character info)
  const { data: chatData } = api.chat.getChatById.useQuery(
    { chatId: selectedChatId! },
    { enabled: !mock && !!selectedChatId },
  );

  // Map character data from getChatById response
  const character = useMemo<Omit<
    AsideCharacterSummaryProps,
    "className"
  > | null>(() => {
    if (mock?.character) return mock.character;
    if (!chatData?.data?.character) return null;

    const char = chatData.data.character;
    const media: Array<{
      id: string;
      type: "image" | "video";
      src: string;
      posterSrc?: string;
    }> = [];

    if (char.poster) {
      media.push({ id: char.poster.id, type: "image", src: char.poster.url });
    }
    if (char.video) {
      media.push({
        id: char.video.id,
        type: "video",
        src: char.video.url,
        posterSrc: char.poster?.url,
      });
    }

    return {
      name: char.name,
      media,
      about: {
        age: char.age ?? undefined,
        bodyType: char.bodyType ?? undefined,
        ethnicity: char.ethnicity ?? undefined,
      },
    };
  }, [mock?.character, chatData]);

  // Fetch messages for selected chat
  const { data: messagesData, isLoading: messagesLoading } =
    api.chat.getMessages.useQuery(
      { chatId: selectedChatId! },
      { enabled: !mock && !!selectedChatId },
    );

  // Map API messages to CardMessageProps format
  const messages = useMemo<CardMessageProps[]>(() => {
    if (mock?.messages) return mock.messages;
    if (!messagesData?.data?.messages) return [];

    return messagesData.data.messages.map((msg) => ({
      id: msg.id,
      variant: msg.type as CardMessageProps["variant"],
      self: msg.isFromUser,
      timestamp: msg.timestamp,
      text: msg.type === "text" ? msg.content : undefined,
      imageSrc: msg.type === "image" ? msg.content : undefined,
      videoSrc: msg.type === "video" ? msg.content : undefined,
      audioSrc: msg.type === "audio" ? msg.content : undefined,
    }));
  }, [mock?.messages, messagesData]);

  const isMessagesLoading = mock ? false : messagesLoading;

  // Private content state
  const [privateContent, setPrivateContent] = useState<
    CardPrivateContentProps[]
  >(mock?.privateContent ?? []);

  // Update privateContent when mock changes
  useEffect(() => {
    if (mock?.privateContent) {
      setPrivateContent(mock.privateContent);
    }
  }, [mock?.privateContent]);

  // Auto-select chat when initialChatId is provided and chats are loaded
  useEffect(() => {
    if (initialChatId && chats.length > 0 && !selectedChatId) {
      const chat = chats.find((c) => c.id === initialChatId);
      if (chat) {
        setSelectedChatId(chat.id ?? null);
      }
    }
  }, [initialChatId, chats, selectedChatId]);

  // Sending message state
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // -------------------------------------------------------------------------
  // Socket Message Handlers
  // -------------------------------------------------------------------------
  const handleNewMessage = useCallback(
    (message: SocketMessage) => {
      // Invalidate messages query to refetch with new message
      void utils.chat.getMessages.invalidate({ chatId: message.chatId });

      // Also update chats list to reflect last message
      void utils.chat.getChats.invalidate();

      // Reset sending state when we receive a response
      if (!message.isFromUser) {
        setIsSendingMessage(false);
      }
    },
    [utils.chat.getMessages, utils.chat.getChats],
  );

  const handleTokensUpdated = useCallback(
    (_data: { tokensUsed: number; tokensAvailable: number }) => {
      // Invalidate usage query to refetch token data from server
      void utils.user.getUsageQuota.invalidate();
    },
    [utils.user.getUsageQuota],
  );

  const handleSocketError = useCallback(
    (error: { code: string; message: string }) => {
      console.error("Socket error:", error);
      setIsSendingMessage(false);
    },
    [],
  );

  // -------------------------------------------------------------------------
  // Chat Socket Operations
  // -------------------------------------------------------------------------
  const {
    isCharacterTyping,
    streamingMessage,
    sendMessage: socketSendMessage,
    startTyping,
    stopTyping,
  } = useChatSocket({
    chatId: selectedChatId,
    onNewMessage: handleNewMessage,
    onTokensUpdated: handleTokensUpdated,
    onError: handleSocketError,
  });

  // -------------------------------------------------------------------------
  // Aside State
  // -------------------------------------------------------------------------
  const [asideVisible, setAsideVisible] = useState(true);

  // -------------------------------------------------------------------------
  // Dialog States
  // -------------------------------------------------------------------------
  const [privateContentOpen, setPrivateContentOpen] = useState(false);
  const [insufficientTokensOpen, setInsufficientTokensOpen] = useState(false);
  const [confirmCallOpen, setConfirmCallOpen] = useState(false);
  const [blockedMicrophoneOpen, setBlockedMicrophoneOpen] = useState(false);
  const [activeCallOpen, setActiveCallOpen] = useState(false);

  // Confirm Call state
  const [dontShowCallAgain, setDontShowCallAgain] = useState(false);
  const [isCallLoading, setIsCallLoading] = useState(false);

  // Active Call state
  const [callStatus, setCallStatus] = useState<CallStatus>("ringing");
  const [callDuration, setCallDuration] = useState("00:00");
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const callStartTimeRef = useRef<number | null>(null);

  // -------------------------------------------------------------------------
  // Derived State
  // -------------------------------------------------------------------------
  const selectedChat = useMemo(
    () => chats.find((chat) => chat.id === selectedChatId) ?? null,
    [chats, selectedChatId],
  );

  // -------------------------------------------------------------------------
  // Selection Handlers
  // -------------------------------------------------------------------------
  const selectChat = useCallback((chat: SnackChatProps) => {
    setSelectedChatId(chat.id ?? null);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedChatId(null);
  }, []);

  // -------------------------------------------------------------------------
  // Chat Actions
  // -------------------------------------------------------------------------
  const sendMessage = useCallback(
    (message: string) => {
      if (!selectedChatId || !isSocketConnected) {
        console.warn(
          "Cannot send message: no chat selected or socket not connected",
        );
        return;
      }

      setIsSendingMessage(true);
      socketSendMessage(message, "text");
    },
    [selectedChatId, isSocketConnected, socketSendMessage],
  );

  const deleteChat = useCallback(() => {
    // TODO: Implement with tRPC mutation
    console.log("Delete chat:", selectedChatId);
  }, [selectedChatId]);

  const resetChat = useCallback(() => {
    // TODO: Implement with tRPC mutation
    console.log("Reset chat:", selectedChatId);
  }, [selectedChatId]);

  const addToFavorites = useCallback(() => {
    // TODO: Implement with tRPC mutation
    console.log("Add to favorites:", selectedChatId);
  }, [selectedChatId]);

  // -------------------------------------------------------------------------
  // Aside Handlers
  // -------------------------------------------------------------------------
  const toggleAside = useCallback(() => {
    setAsideVisible((prev) => !prev);
  }, []);

  // -------------------------------------------------------------------------
  // Private Content Handlers
  // -------------------------------------------------------------------------
  const handleUnlockPrivateContent = useCallback(
    (item: CardPrivateContentProps, index: number) => {
      const cost = item.tokenCost ?? 0;

      if (tokensAvailable < cost) {
        // Close private content dialog and open insufficient tokens dialog
        setPrivateContentOpen(false);
        setInsufficientTokensOpen(true);
        return;
      }

      // TODO: Implement unlock with tRPC mutation
      // For now, simulate unlock by updating local state
      console.log("Unlock item:", item, "at index:", index);
      setPrivateContent((prev) =>
        prev.map((p, i) => (i === index ? { ...p, locked: false } : p)),
      );
    },
    [tokensAvailable],
  );

  // -------------------------------------------------------------------------
  // Call Flow Handlers
  // -------------------------------------------------------------------------
  const formatDuration = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const startCallTimer = useCallback(() => {
    callStartTimeRef.current = Date.now();
    callTimerRef.current = setInterval(() => {
      if (callStartTimeRef.current) {
        const elapsed = Math.floor(
          (Date.now() - callStartTimeRef.current) / 1000,
        );
        setCallDuration(formatDuration(elapsed));
      }
    }, 1000);
  }, [formatDuration]);

  const stopCallTimer = useCallback(() => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    callStartTimeRef.current = null;
  }, []);

  const startCall = useCallback(() => {
    setActiveCallOpen(true);
    setCallStatus("ringing");
    setCallDuration("00:00");

    // Simulate call connection flow
    setTimeout(() => {
      setCallStatus("connecting");
      setTimeout(() => {
        setCallStatus("connected");
        startCallTimer();
      }, 1000);
    }, 2000);
  }, [startCallTimer]);

  const hangUpCall = useCallback(() => {
    stopCallTimer();
    setCallStatus("ended");

    // Close dialog after 1 second
    setTimeout(() => {
      setActiveCallOpen(false);
      setCallStatus("ringing");
      setCallDuration("00:00");
    }, 1000);
  }, [stopCallTimer]);

  const checkMicrophoneAndStartCall = useCallback(async () => {
    try {
      // Check if navigator.permissions is available
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({
          name: "microphone" as PermissionName,
        });

        if (permission.state === "granted") {
          setConfirmCallOpen(false);
          startCall();
          return;
        }

        if (permission.state === "denied") {
          setConfirmCallOpen(false);
          setBlockedMicrophoneOpen(true);
          return;
        }
      }

      // Permission is "prompt" or permissions API not available - try to get access
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setConfirmCallOpen(false);
      startCall();
    } catch {
      // Permission denied or error
      setConfirmCallOpen(false);
      setBlockedMicrophoneOpen(true);
    }
  }, [startCall]);

  const handleConfirmCall = useCallback(async () => {
    setIsCallLoading(true);

    try {
      await checkMicrophoneAndStartCall();
    } finally {
      setIsCallLoading(false);
    }
  }, [checkMicrophoneAndStartCall]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, []);

  // -------------------------------------------------------------------------
  // Context Value
  // -------------------------------------------------------------------------
  const value = useMemo<ChatContextValue>(
    () => ({
      // Data
      chats,
      messages,
      selectedChat,
      character,
      privateContent,

      // Loading states
      isChatsLoading,
      isMessagesLoading,
      isSendingMessage,

      // Socket state
      isSocketConnected,
      isSocketConnecting,
      isCharacterTyping,
      streamingMessage,
      socketError,

      // Selection
      selectedChatId,
      selectChat,
      clearSelection,

      // Actions
      sendMessage,
      deleteChat,
      resetChat,
      addToFavorites,
      startTyping,
      stopTyping,

      // Dialog controls
      dialogs: {
        privateContent: {
          open: privateContentOpen,
          setOpen: setPrivateContentOpen,
          onUnlock: handleUnlockPrivateContent,
        },
        insufficientTokens: {
          open: insufficientTokensOpen,
          setOpen: setInsufficientTokensOpen,
        },
        confirmCall: {
          open: confirmCallOpen,
          setOpen: setConfirmCallOpen,
          isLoading: isCallLoading,
          dontShowAgain: dontShowCallAgain,
          setDontShowAgain: setDontShowCallAgain,
          confirm: handleConfirmCall,
        },
        blockedMicrophone: {
          open: blockedMicrophoneOpen,
          setOpen: setBlockedMicrophoneOpen,
        },
        activeCall: {
          open: activeCallOpen,
          setOpen: setActiveCallOpen,
          status: callStatus,
          duration: callDuration,
          hangUp: hangUpCall,
        },
      },

      // Aside
      aside: {
        visible: asideVisible,
        toggle: toggleAside,
      },
    }),
    [
      chats,
      messages,
      selectedChat,
      character,
      privateContent,
      isChatsLoading,
      isMessagesLoading,
      isSendingMessage,
      isSocketConnected,
      isSocketConnecting,
      isCharacterTyping,
      streamingMessage,
      socketError,
      selectedChatId,
      selectChat,
      clearSelection,
      sendMessage,
      deleteChat,
      resetChat,
      addToFavorites,
      startTyping,
      stopTyping,
      privateContentOpen,
      handleUnlockPrivateContent,
      insufficientTokensOpen,
      confirmCallOpen,
      isCallLoading,
      dontShowCallAgain,
      handleConfirmCall,
      blockedMicrophoneOpen,
      activeCallOpen,
      callStatus,
      callDuration,
      hangUpCall,
      asideVisible,
      toggleAside,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
