"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  connectSocket,
  disconnectSocket,
  getSocket,
  isSocketConnected,
  type SocketError,
} from "@/lib/socket";
import { api } from "@/trpc/react";

// ============================================================================
// Types
// ============================================================================

type UseSocketReturn = {
  isConnected: boolean;
  isConnecting: boolean;
  error: SocketError | null;
  connect: () => Promise<void>;
  disconnect: () => void;
};

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook for managing socket connection
 * Handles token generation, connection, and disconnection
 */
export function useSocket(): UseSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<SocketError | null>(null);
  const connectionAttemptRef = useRef(false);

  const generateTokenMutation = api.chat.generateSocketToken.useMutation();

  /**
   * Connect to socket server
   */
  const connect = useCallback(async () => {
    // Prevent multiple simultaneous connection attempts
    if (connectionAttemptRef.current || isSocketConnected()) {
      return;
    }

    connectionAttemptRef.current = true;
    setIsConnecting(true);
    setError(null);

    try {
      // Generate authentication token
      const result = await generateTokenMutation.mutateAsync();

      if (!result.success || !result.data.token) {
        throw new Error("Failed to generate socket token");
      }

      // Connect to socket
      const socket = connectSocket(result.data.token);

      // Set up connection event handlers
      socket.on("connect", () => {
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
      });

      socket.on("disconnect", (reason) => {
        setIsConnected(false);
        if (reason === "io server disconnect") {
          // Server disconnected us, might need to reconnect with new token
          setError({
            code: "SERVER_DISCONNECT",
            message: "Disconnected by server",
          });
        }
      });

      socket.on("connect_error", (err) => {
        setIsConnecting(false);
        setError({
          code: "CONNECTION_ERROR",
          message: err.message,
        });
      });

      socket.on("error", (socketError) => {
        setError(socketError);
      });

      // Connect if not already connecting
      if (!socket.connected) {
        socket.connect();
      }
    } catch (err) {
      setIsConnecting(false);
      setError({
        code: "TOKEN_ERROR",
        message: err instanceof Error ? err.message : "Failed to connect",
      });
    } finally {
      connectionAttemptRef.current = false;
    }
  }, [generateTokenMutation]);

  /**
   * Disconnect from socket server
   */
  const disconnect = useCallback(() => {
    disconnectSocket();
    setIsConnected(false);
    setIsConnecting(false);
    setError(null);
  }, []);

  /**
   * Sync state with socket on mount
   */
  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      setIsConnected(socket.connected);
    }
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      // Don't disconnect on unmount - let the socket persist across components
      // Only disconnect when explicitly called or when logging out
    };
  }, []);

  return {
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
  };
}
