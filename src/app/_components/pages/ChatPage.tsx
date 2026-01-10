"use client";

import React from "react";
import clsx from "clsx";
import { useMediaQuery } from "react-responsive";
import ListSnackChat from "../organisms/ListSnackChat";
import ChatRoom from "../organisms/ChatRoom";
import AsideCharacterSummary from "../organisms/AsideCharacterSummary";
import DialogPrivateContent from "../organisms/DialogPrivateContent";
import DialogConfirmCall from "../organisms/DialogConfirmCall";
import DialogInsufficientTokens from "../organisms/DialogInsufficientTokens";
import DialogBlockedMicrophone from "../organisms/DialogBlockedMicrophone";
import DialogCall from "../organisms/DialogCall";
import {
  ChatContextProvider,
  useChat,
  type ChatContextMock,
} from "@/app/_contexts/ChatContext";

// ============================================================================
// Types
// ============================================================================

export type ChatPageProps = {
  className?: string;
  mock?: ChatContextMock;
  initialChatId?: string;
};

// ============================================================================
// ChatDialogs - Renders all dialogs once at root level
// ============================================================================

const ChatDialogs: React.FC = () => {
  const { dialogs, selectedChat, character, privateContent } = useChat();

  return (
    <>
      <DialogPrivateContent
        open={dialogs.privateContent.open}
        onClose={() => dialogs.privateContent.setOpen(false)}
        items={privateContent}
        onUnlock={dialogs.privateContent.onUnlock}
      />
      <DialogInsufficientTokens
        open={dialogs.insufficientTokens.open}
        close={() => dialogs.insufficientTokens.setOpen(false)}
      />
      <DialogConfirmCall
        open={dialogs.confirmCall.open}
        onClose={() => dialogs.confirmCall.setOpen(false)}
        onConfirm={dialogs.confirmCall.confirm}
        dontShowAgain={dialogs.confirmCall.dontShowAgain}
        onDontShowAgainChange={dialogs.confirmCall.setDontShowAgain}
        loading={dialogs.confirmCall.isLoading}
      />
      <DialogBlockedMicrophone
        open={dialogs.blockedMicrophone.open}
        onClose={() => dialogs.blockedMicrophone.setOpen(false)}
      />
      <DialogCall
        open={dialogs.activeCall.open}
        onClose={() => dialogs.activeCall.setOpen(false)}
        onHangUp={dialogs.activeCall.hangUp}
        characterName={selectedChat?.name ?? ""}
        characterImage={character?.media[0]?.src ?? ""}
        status={dialogs.activeCall.status}
        duration={dialogs.activeCall.duration}
      />
    </>
  );
};

// ============================================================================
// ChatPageContent - Main layout component
// ============================================================================

const ChatPageContent: React.FC<{ className?: string }> = ({ className }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });

  const {
    chats,
    messages,
    selectedChat,
    selectedChatId,
    character,
    isChatsLoading,
    selectChat,
    clearSelection,
    sendMessage,
    deleteChat,
    resetChat,
    addToFavorites,
    dialogs,
    aside,
  } = useChat();

  // Mobile view logic
  if (isMobile) {
    // Show chat list when no chat selected
    if (!selectedChatId) {
      return (
        <div className={clsx("flex h-full flex-col", className)}>
          <ListSnackChat
            className="flex-1 overflow-y-auto p-4"
            loading={isChatsLoading}
            chats={chats}
            title="Chat"
            showSearch
            onSelectChat={selectChat}
          />
        </div>
      );
    }

    // Show chat room when chat selected
    return (
      <div className={clsx("flex h-full flex-col", className)}>
        <ChatRoom
          className="flex-1"
          showBackButton
          onBack={clearSelection}
          characterName={selectedChat?.name ?? ""}
          characterAvatarSrc={selectedChat?.avatarSrc}
          messages={messages}
          onSendMessage={sendMessage}
          onClickPrivateContent={() => dialogs.privateContent.setOpen(true)}
          onCallClick={() => dialogs.confirmCall.setOpen(true)}
          onAddToFavorites={addToFavorites}
          onResetChat={resetChat}
          onDeleteChat={deleteChat}
        />
      </div>
    );
  }

  // Tablet view: 2 columns (no aside)
  if (isTablet) {
    return (
      <div className={clsx("flex h-full", className)}>
        {/* Left column: Chat list */}
        <div className="border-border flex w-72 shrink-0 flex-col border-r">
          <ListSnackChat
            className="flex-1 overflow-y-auto p-4"
            loading={isChatsLoading}
            chats={chats}
            title="Chat"
            showSearch
            onSelectChat={selectChat}
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
              onSendMessage={sendMessage}
              onClickPrivateContent={() => dialogs.privateContent.setOpen(true)}
              onCallClick={() => dialogs.confirmCall.setOpen(true)}
              onAddToFavorites={addToFavorites}
              onResetChat={resetChat}
              onDeleteChat={deleteChat}
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
    );
  }

  // Desktop view: 3 columns
  return (
    <div className={clsx("flex h-full", className)}>
      {/* Left column: Chat list */}
      <div className="border-border flex w-80 shrink-0 flex-col border-r">
        <ListSnackChat
          className="flex-1 overflow-y-auto p-4"
          loading={isChatsLoading}
          chats={chats}
          title="Chat"
          showSearch
          onSelectChat={selectChat}
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
            onSendMessage={sendMessage}
            onClickPrivateContent={() => dialogs.privateContent.setOpen(true)}
            onCallClick={() => dialogs.confirmCall.setOpen(true)}
            onAddToFavorites={addToFavorites}
            onResetChat={resetChat}
            onDeleteChat={deleteChat}
            onExpand={aside.toggle}
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
      {character && selectedChatId && aside.visible && (
        <div className="border-border w-80 shrink-0 border-l">
          <AsideCharacterSummary className="h-full" {...character} />
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

const ChatPage: React.FC<ChatPageProps> = ({
  className,
  mock,
  initialChatId,
}) => {
  return (
    <ChatContextProvider mock={mock} initialChatId={initialChatId}>
      <ChatPageContent className={className} />
      <ChatDialogs />
    </ChatContextProvider>
  );
};

export default ChatPage;
