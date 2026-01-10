import React, { useState } from "react";
import clsx from "clsx";
import {
  Image as ImageIcon,
  Video,
  SlidersHorizontal,
  Send,
} from "lucide-react";

export type InputChatProps = {
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  onSendMessage: (message: string) => void;
};

const InputChat: React.FC<InputChatProps> = ({
  className,
  placeholder = "Write a message...",
  disabled = false,
  onSendMessage,
}) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={clsx(
        "border-border bg-muted flex flex-col gap-2 rounded-2xl border p-3",
        disabled && "opacity-50",
        className,
      )}
    >
      {/* Text Input */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="text-foreground placeholder:text-muted-foreground w-full bg-transparent focus:outline-none"
        aria-label="Chat message input"
      />

      {/* Bottom row: Icon buttons and Send button */}
      <div className="flex items-center justify-between">
        {/* Left side: Action icons */}
        <div className="flex items-center gap-1">
          {/* Image Icon */}
          <button
            type="button"
            disabled={disabled}
            className="text-muted-foreground hover:bg-background hover:text-foreground flex h-9 w-9 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Add image"
          >
            <ImageIcon className="h-5 w-5" />
          </button>

          {/* Video Icon */}
          <button
            type="button"
            disabled={disabled}
            className="text-muted-foreground hover:bg-background hover:text-foreground flex h-9 w-9 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Add video"
          >
            <Video className="h-5 w-5" />
          </button>

          {/* Adjust Icon */}
          <button
            type="button"
            disabled={disabled}
            className="text-muted-foreground hover:bg-background hover:text-foreground flex h-9 w-9 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Adjust settings"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>

        {/* Right side: Send button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-10 w-10 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default InputChat;
