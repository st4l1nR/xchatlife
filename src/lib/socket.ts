import { io, type Socket } from "socket.io-client";
import { env } from "@/env";

// ============================================================================
// Types
// ============================================================================

export type SocketMessage = {
  id: string;
  chatId: string;
  content: string;
  type: "text" | "image" | "video" | "audio";
  isFromUser: boolean;
  createdAt: string;
};

export type StreamChunk = {
  chatId: string;
  chunk: string;
  isComplete: boolean;
};

export type TypingUpdate = {
  chatId: string;
  isTyping: boolean;
};

export type TokensUpdate = {
  tokenBalance: number;
};

export type SocketError = {
  code: string;
  message: string;
};

// Client -> Server events
export interface ClientToServerEvents {
  "chat:join": (data: { chatId: string }) => void;
  "chat:leave": (data: { chatId: string }) => void;
  "message:send": (data: {
    chatId: string;
    content: string;
    type: "text" | "image" | "video" | "audio";
  }) => void;
  "typing:start": (data: { chatId: string }) => void;
  "typing:stop": (data: { chatId: string }) => void;
}

// Server -> Client events
export interface ServerToClientEvents {
  "message:new": (message: SocketMessage) => void;
  "message:stream": (data: StreamChunk) => void;
  "typing:update": (data: TypingUpdate) => void;
  "tokens:updated": (data: TokensUpdate) => void;
  error: (error: SocketError) => void;
}

// ============================================================================
// Socket Singleton
// ============================================================================

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: TypedSocket | null = null;

/**
 * Get the socket URL from environment
 */
function getSocketUrl(): string {
  const url = env.NEXT_PUBLIC_SOCKET_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_SOCKET_URL is not configured");
  }
  return url;
}

/**
 * Connect to socket server with authentication token
 */
export function connectSocket(token: string): TypedSocket {
  if (socket?.connected) {
    return socket;
  }

  const socketUrl = getSocketUrl();

  socket = io(socketUrl, {
    auth: {
      token,
    },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
  }) as TypedSocket;

  return socket;
}

/**
 * Disconnect from socket server
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/**
 * Get the current socket instance
 */
export function getSocket(): TypedSocket | null {
  return socket;
}

/**
 * Check if socket is currently connected
 */
export function isSocketConnected(): boolean {
  return socket?.connected ?? false;
}
