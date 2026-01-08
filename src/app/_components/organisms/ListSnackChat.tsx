import React, { useState, useMemo } from "react";
import clsx from "clsx";
import { Search } from "lucide-react";
import SnackChat from "../molecules/SnackChat";
import type { SnackChatProps } from "../molecules/SnackChat";
import WrapperLoader from "../molecules/WrapperLoader";
import CardEmptyState from "../molecules/CardEmptyState";

export type ListSnackChatProps = {
  className?: string;
  loading?: boolean;
  chats: SnackChatProps[];
  showActions?: boolean;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  // Optional header
  title?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  // Callbacks
  onSelectChat?: (chat: SnackChatProps, index: number) => void;
  onReplyChat?: (chat: SnackChatProps, index: number) => void;
  onDeleteChat?: (chat: SnackChatProps, index: number) => void;
};

const ListSnackChat: React.FC<ListSnackChatProps> = ({
  className,
  loading = false,
  chats,
  showActions = true,
  emptyStateTitle = "No conversations",
  emptyStateDescription = "Start chatting to see your conversations here.",
  title,
  showSearch = false,
  searchPlaceholder = "Search for a profile...",
  onSelectChat,
  onReplyChat,
  onDeleteChat,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter chats by name
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;
    const query = searchQuery.toLowerCase();
    return chats.filter((chat) => chat.name.toLowerCase().includes(query));
  }, [chats, searchQuery]);

  return (
    <div className={clsx("flex flex-col", className)}>
      {/* Header */}
      {(title || showSearch) && (
        <div className="mb-4 flex flex-col gap-3">
          {title && (
            <h2 className="text-foreground text-xl font-semibold">{title}</h2>
          )}
          {showSearch && (
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="bg-muted text-foreground placeholder:text-muted-foreground focus:ring-primary/50 w-full rounded-lg border-0 py-2.5 pr-4 pl-10 text-sm transition-colors outline-none focus:ring-2"
              />
            </div>
          )}
        </div>
      )}

      <WrapperLoader loading={loading} totalDocs={filteredChats.length}>
        {/* Content */}
        <div className="flex flex-col gap-2">
          {filteredChats.map((chat, index) => (
            <SnackChat
              key={chat.id ?? index}
              {...chat}
              showActions={showActions}
              onClick={
                onSelectChat ? () => onSelectChat(chat, index) : chat.onClick
              }
              onReply={
                onReplyChat ? () => onReplyChat(chat, index) : chat.onReply
              }
              onDelete={
                onDeleteChat ? () => onDeleteChat(chat, index) : chat.onDelete
              }
            />
          ))}
        </div>

        {/* Loading skeleton */}
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="bg-muted flex animate-pulse items-center gap-3 rounded-lg p-3"
            >
              {/* Avatar skeleton */}
              <div className="bg-muted-foreground/20 size-10 shrink-0 rounded-full" />

              {/* Content skeleton */}
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="bg-muted-foreground/20 h-4 w-24 rounded" />
                  <div className="bg-muted-foreground/20 h-3 w-12 rounded" />
                </div>
                <div className="bg-muted-foreground/20 h-3.5 w-48 rounded" />
              </div>

              {/* Actions skeleton */}
              {showActions && (
                <div className="flex shrink-0 items-center gap-1">
                  <div className="bg-muted-foreground/20 size-7 rounded" />
                  <div className="bg-muted-foreground/20 size-7 rounded" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty state */}
        <CardEmptyState
          title={emptyStateTitle}
          description={emptyStateDescription}
        />
      </WrapperLoader>
    </div>
  );
};

export default ListSnackChat;
