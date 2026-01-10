"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  getSocket,
  isSocketConnected,
  type SocketMessage,
  type StreamChunk,
  type TypingUpdate,
  type TokensUpdate,
} from "@/lib/socket";

// ============================================================================
// Types
// ============================================================================

type UseChatSocketOptions = {
  chatId: string | null;
  onNewMessage?: (message: SocketMessage) => void;
  onTypingChange?: (isTyping: boolean) => void;
  onTokensUpdated?: (data: TokensUpdate) => void;
  onError?: (error: { code: string; message: string }) => void;
};

type UseChatSocketReturn = {
  // State
  isInRoom: boolean;
  isCharacterTyping: boolean;
  streamingMessage: string;
  isStreaming: boolean;

  // Actions
  sendMessage: (
    content: string,
    type?: "text" | "image" | "video" | "audio",
  ) => void;
  startTyping: () => void;
  stopTyping: () => void;
};

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook for chat-specific socket operations
 * Handles joining/leaving chat rooms, sending messages, and typing indicators
 */
export function useChatSocket({
  chatId,
  onNewMessage,
  onTypingChange,
  onTokensUpdated,
  onError,
}: UseChatSocketOptions): UseChatSocketReturn {
  const [isInRoom, setIsInRoom] = useState(false);
  const [isCharacterTyping, setIsCharacterTyping] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const currentChatIdRef = useRef<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Clear typing timeout helper
   */
  const clearTypingTimeout = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, []);

  /**
   * Stop typing indicator
   */
  const stopTyping = useCallback(() => {
    const socket = getSocket();
    if (!socket || !chatId) {
      return;
    }

    socket.emit("typing:stop", { chatId });
    clearTypingTimeout();
  }, [chatId, clearTypingTimeout]);

  /**
   * Join a chat room
   */
  const joinRoom = useCallback((roomChatId: string) => {
    const socket = getSocket();
    if (!socket || !isSocketConnected()) {
      return;
    }

    socket.emit("chat:join", { chatId: roomChatId });
    setIsInRoom(true);
    currentChatIdRef.current = roomChatId;
  }, []);

  /**
   * Leave a chat room
   */
  const leaveRoom = useCallback((roomChatId: string) => {
    const socket = getSocket();
    if (!socket) {
      return;
    }

    socket.emit("chat:leave", { chatId: roomChatId });
    setIsInRoom(false);
    setIsCharacterTyping(false);
    setStreamingMessage("");
    setIsStreaming(false);
    currentChatIdRef.current = null;
  }, []);

  /**
   * Send a message
   */
  const sendMessage = useCallback(
    (content: string, type: "text" | "image" | "video" | "audio" = "text") => {
      const socket = getSocket();
      if (!socket || !isSocketConnected() || !chatId) {
        return;
      }

      socket.emit("message:send", {
        chatId,
        content,
        type,
      });

      // Stop typing when sending a message
      stopTyping();
    },
    [chatId, stopTyping],
  );

  /**
   * Start typing indicator
   */
  const startTyping = useCallback(() => {
    const socket = getSocket();
    if (!socket || !isSocketConnected() || !chatId) {
      return;
    }

    socket.emit("typing:start", { chatId });

    // Clear existing timeout
    clearTypingTimeout();

    // Auto-stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  }, [chatId, clearTypingTimeout, stopTyping]);

  /**
   * Set up event listeners
   */
  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      return;
    }

    // Handle new messages
    const handleNewMessage = (message: SocketMessage) => {
      // Only process messages for the current chat
      if (message.chatId !== currentChatIdRef.current) {
        return;
      }

      // Reset streaming state when a complete message arrives
      if (!message.isFromUser) {
        setStreamingMessage("");
        setIsStreaming(false);
      }

      onNewMessage?.(message);
    };

    // Handle streaming chunks
    const handleStreamChunk = (data: StreamChunk) => {
      // Only process chunks for the current chat
      if (data.chatId !== currentChatIdRef.current) {
        return;
      }

      if (data.isComplete) {
        setIsStreaming(false);
      } else {
        setIsStreaming(true);
        setStreamingMessage((prev) => prev + data.chunk);
      }
    };

    // Handle typing updates
    const handleTypingUpdate = (data: TypingUpdate) => {
      // Only process typing for the current chat
      if (data.chatId !== currentChatIdRef.current) {
        return;
      }

      setIsCharacterTyping(data.isTyping);
      onTypingChange?.(data.isTyping);
    };

    // Handle token updates
    const handleTokensUpdated = (data: TokensUpdate) => {
      onTokensUpdated?.(data);
    };

    // Handle errors
    const handleError = (error: { code: string; message: string }) => {
      onError?.(error);
    };

    // Register event listeners
    socket.on("message:new", handleNewMessage);
    socket.on("message:stream", handleStreamChunk);
    socket.on("typing:update", handleTypingUpdate);
    socket.on("tokens:updated", handleTokensUpdated);
    socket.on("error", handleError);

    // Cleanup
    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("message:stream", handleStreamChunk);
      socket.off("typing:update", handleTypingUpdate);
      socket.off("tokens:updated", handleTokensUpdated);
      socket.off("error", handleError);
    };
  }, [onNewMessage, onTypingChange, onTokensUpdated, onError]);

  /**
   * Join/leave room when chatId changes
   */
  useEffect(() => {
    const previousChatId = currentChatIdRef.current;

    // Leave previous room if exists
    if (previousChatId && previousChatId !== chatId) {
      leaveRoom(previousChatId);
    }

    // Join new room if chatId is provided and socket is connected
    if (chatId && isSocketConnected()) {
      joinRoom(chatId);
    }

    // Cleanup: leave room on unmount
    return () => {
      if (currentChatIdRef.current) {
        leaveRoom(currentChatIdRef.current);
      }
    };
  }, [chatId, joinRoom, leaveRoom]);

  /**
   * Cleanup typing timeout on unmount
   */
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    isInRoom,
    isCharacterTyping,
    streamingMessage,
    isStreaming,
    sendMessage,
    startTyping,
    stopTyping,
  };
}
