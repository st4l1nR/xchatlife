"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { useMediaQuery } from "react-responsive";
import ListSnackChat from "../organisms/ListSnackChat";
import ChatRoom from "../organisms/ChatRoom";
import AsideCharacterSummary from "../organisms/AsideCharacterSummary";
import DialogPrivateContent from "../organisms/DialogPrivateContent";
import DialogConfirmCall from "../organisms/DialogConfirmCall";
import type { SnackChatProps } from "../molecules/SnackChat";
import type { CardMessageProps } from "../molecules/CardMessage";
import type { AsideCharacterSummaryProps } from "../organisms/AsideCharacterSummary";
import type { CardPrivateContentProps } from "../molecules/CardPrivateContent";

export type ChatPageProps = {
  className?: string;
  // Mock data for Storybook
  mock?: {
    chats: SnackChatProps[];
    messages: CardMessageProps[];
    character: Omit<AsideCharacterSummaryProps, "className">;
    privateContent?: CardPrivateContentProps[];
  };
};

const ChatPage: React.FC<ChatPageProps> = ({ className, mock }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatsLoading] = useState(false);

  // Dialog states
  const [privateContentOpen, setPrivateContentOpen] = useState(false);
  const [confirmCallOpen, setConfirmCallOpen] = useState(false);
  const [dontShowCallAgain, setDontShowCallAgain] = useState(false);
  const [isCallLoading, setIsCallLoading] = useState(false);

  // Aside visibility state
  const [asideVisible, setAsideVisible] = useState(true);

  // Mock data for development/Storybook
  const chats = mock?.chats ?? [];
  const messages = mock?.messages ?? [];
  const character = mock?.character;
  const privateContent = mock?.privateContent ?? [];

  // Find selected chat data
  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  // Handlers
  const handleSelectChat = (chat: SnackChatProps) => {
    setSelectedChatId(chat.id ?? null);
  };

  const handleBack = () => {
    setSelectedChatId(null);
  };

  const handleSendMessage = (message: string) => {
    // TODO: Implement message sending
    console.log("Send message:", message);
  };

  const handleOpenPrivateContent = () => {
    setPrivateContentOpen(true);
  };

  const handleClosePrivateContent = () => {
    setPrivateContentOpen(false);
  };

  const handleOpenCall = () => {
    setConfirmCallOpen(true);
  };

  const handleCloseCall = () => {
    setConfirmCallOpen(false);
  };

  const handleConfirmCall = () => {
    setIsCallLoading(true);
    // TODO: Implement call logic
    setTimeout(() => {
      setIsCallLoading(false);
      setConfirmCallOpen(false);
      console.log("Call started");
    }, 1000);
  };

  const handleToggleAside = () => {
    setAsideVisible((prev) => !prev);
  };

  // Mobile view logic
  if (isMobile) {
    // Show chat list when no chat selected
    if (!selectedChatId) {
      return (
        <div className={clsx("flex h-full flex-col", className)}>
          <ListSnackChat
            className="flex-1 overflow-y-auto p-4"
            loading={chatsLoading}
            chats={chats}
            title="Chat"
            showSearch
            onSelectChat={handleSelectChat}
          />
        </div>
      );
    }

    // Show chat room when chat selected
    return (
      <>
        <div className={clsx("flex h-full flex-col", className)}>
          <ChatRoom
            className="flex-1"
            showBackButton
            onBack={handleBack}
            characterName={selectedChat?.name ?? ""}
            characterAvatarSrc={selectedChat?.avatarSrc}
            messages={messages}
            onSendMessage={handleSendMessage}
            onClickPrivateContent={handleOpenPrivateContent}
            onCallClick={handleOpenCall}
            onAddToFavorites={() => console.log("Add to favorites")}
            onResetChat={() => console.log("Reset chat")}
            onDeleteChat={() => console.log("Delete chat")}
          />
        </div>

        {/* Dialogs */}
        <DialogPrivateContent
          open={privateContentOpen}
          onClose={handleClosePrivateContent}
          items={privateContent}
        />
        <DialogConfirmCall
          open={confirmCallOpen}
          onClose={handleCloseCall}
          onConfirm={handleConfirmCall}
          dontShowAgain={dontShowCallAgain}
          onDontShowAgainChange={setDontShowCallAgain}
          loading={isCallLoading}
        />
      </>
    );
  }

  // Tablet view: 2 columns (no aside)
  if (isTablet) {
    return (
      <>
        <div className={clsx("flex h-full", className)}>
          {/* Left column: Chat list */}
          <div className="border-border flex w-72 shrink-0 flex-col border-r">
            <ListSnackChat
              className="flex-1 overflow-y-auto p-4"
              loading={chatsLoading}
              chats={chats}
              title="Chat"
              showSearch
              onSelectChat={handleSelectChat}
            />
          </div>

          {/* Center: Chat room */}
          <div className="flex flex-1 flex-col">
            {selectedChatId ? (
              <ChatRoom
                className="flex-1"
                characterName={selectedChat?.name ?? ""}
                characterAvatarSrc={selectedChat?.avatarSrc}
                messages={messages}
                onSendMessage={handleSendMessage}
                onClickPrivateContent={handleOpenPrivateContent}
                onCallClick={handleOpenCall}
                onAddToFavorites={() => console.log("Add to favorites")}
                onResetChat={() => console.log("Reset chat")}
                onDeleteChat={() => console.log("Delete chat")}
              />
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-muted-foreground">
                  Select a chat to start messaging
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Dialogs */}
        <DialogPrivateContent
          open={privateContentOpen}
          onClose={handleClosePrivateContent}
          items={privateContent}
        />
        <DialogConfirmCall
          open={confirmCallOpen}
          onClose={handleCloseCall}
          onConfirm={handleConfirmCall}
          dontShowAgain={dontShowCallAgain}
          onDontShowAgainChange={setDontShowCallAgain}
          loading={isCallLoading}
        />
      </>
    );
  }

  // Desktop view: 3 columns
  return (
    <>
      <div className={clsx("flex h-full", className)}>
        {/* Left column: Chat list */}
        <div className="border-border flex w-80 shrink-0 flex-col border-r">
          <ListSnackChat
            className="flex-1 overflow-y-auto p-4"
            loading={chatsLoading}
            chats={chats}
            title="Chat"
            showSearch
            onSelectChat={handleSelectChat}
          />
        </div>

        {/* Center: Chat room */}
        <div className="flex flex-1 flex-col">
          {selectedChatId ? (
            <ChatRoom
              className="flex-1"
              characterName={selectedChat?.name ?? ""}
              characterAvatarSrc={selectedChat?.avatarSrc}
              messages={messages}
              onSendMessage={handleSendMessage}
              onClickPrivateContent={handleOpenPrivateContent}
              onCallClick={handleOpenCall}
              onAddToFavorites={() => console.log("Add to favorites")}
              onResetChat={() => console.log("Reset chat")}
              onDeleteChat={() => console.log("Delete chat")}
              onExpand={handleToggleAside}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-muted-foreground">
                Select a chat to start messaging
              </p>
            </div>
          )}
        </div>

        {/* Right column: Character summary (only on desktop) */}
        {character && selectedChatId && asideVisible && (
          <div className="border-border w-80 shrink-0 border-l">
            <AsideCharacterSummary className="h-full" {...character} />
          </div>
        )}
      </div>

      {/* Dialogs */}
      <DialogPrivateContent
        open={privateContentOpen}
        onClose={handleClosePrivateContent}
        items={privateContent}
      />
      <DialogConfirmCall
        open={confirmCallOpen}
        onClose={handleCloseCall}
        onConfirm={handleConfirmCall}
        dontShowAgain={dontShowCallAgain}
        onDontShowAgainChange={setDontShowCallAgain}
        loading={isCallLoading}
      />
    </>
  );
};

export default ChatPage;
