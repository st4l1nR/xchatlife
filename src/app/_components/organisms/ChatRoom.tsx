"use client";

import React, { useRef, useEffect } from "react";
import clsx from "clsx";
import { ArrowLeft } from "lucide-react";
import HeaderChat from "./HeaderChat";
import InputChat from "./InputChat";
import CardMessage from "../molecules/CardMessage";
import type { CardMessageProps } from "../molecules/CardMessage";

export type ChatRoomProps = {
  className?: string;
  // Mobile back navigation
  showBackButton?: boolean;
  onBack?: () => void;
  // Header props
  characterName: string;
  characterAvatarSrc?: string;
  onClickPrivateContent?: () => void;
  onCallClick?: () => void;
  onAddToFavorites?: () => void;
  onResetChat?: () => void;
  onDeleteChat?: () => void;
  onExpand?: () => void;
  // Messages
  messages: CardMessageProps[];
  loading?: boolean;
  // Input
  onSendMessage: (message: string) => void;
  inputDisabled?: boolean;
};

const ChatRoom: React.FC<ChatRoomProps> = ({
  className,
  // Mobile back navigation
  showBackButton = false,
  onBack,
  // Header props
  characterName,
  characterAvatarSrc,
  onClickPrivateContent,
  onCallClick,
  onAddToFavorites,
  onResetChat,
  onDeleteChat,
  onExpand,
  // Messages
  messages,
  loading = false,
  // Input
  onSendMessage,
  inputDisabled = false,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className={clsx("bg-background flex h-full flex-col", className)}>
      {/* Header row with optional back button */}
      <div className="border-border flex shrink-0 items-center border-b">
        {showBackButton && (
          <button
            type="button"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground flex h-full items-center justify-center px-3 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="size-5" />
          </button>
        )}
        <HeaderChat
          className="flex-1"
          name={characterName}
          avatarSrc={characterAvatarSrc}
          onClickPrivateContent={onClickPrivateContent}
          onCallClick={onCallClick}
          onAddToFavorites={onAddToFavorites}
          onResetChat={onResetChat}
          onDeleteChat={onDeleteChat}
          onExpand={onExpand}
        />
      </div>

      {/* Messages area - scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          // Loading skeleton
          <div className="flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className={clsx(
                  "flex",
                  index % 2 === 0 ? "justify-start" : "justify-end",
                )}
              >
                <div
                  className={clsx(
                    "animate-pulse rounded-2xl",
                    index % 2 === 0
                      ? "bg-muted rounded-bl-sm"
                      : "bg-primary/30 rounded-br-sm",
                  )}
                  style={{
                    width: `${Math.random() * 30 + 40}%`,
                    height: `${Math.random() * 40 + 60}px`,
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          // Messages list
          <div className="flex flex-col gap-4">
            {messages.map((message, index) => (
              <CardMessage key={message.id ?? index} {...message} />
            ))}
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area - fixed at bottom */}
      <div className="border-border shrink-0 border-t p-4">
        <InputChat onSendMessage={onSendMessage} disabled={inputDisabled} />
      </div>
    </div>
  );
};

export default ChatRoom;
