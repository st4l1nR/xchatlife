import { redirect } from "next/navigation";
import { api } from "@/trpc/server";
import ChatPage from "@/app/_components/pages/ChatPage";

export const metadata = {
  title: "Chat",
  description: "Chat with your favorite characters",
};

export default async function ChatRoutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Special case: "0" means no chat selected (user has no chats yet)
  if (id === "0") {
    return <ChatPage />;
  }

  try {
    // getOrCreateChat uses protectedProcedure - throws UNAUTHORIZED if not logged in
    const result = await api.chat.getOrCreateChat({ characterId: id });
    return <ChatPage initialChatId={result.data.chatId} />;
  } catch {
    // Not authenticated, character not found, or not accessible → redirect home
    redirect("/");
  }
}
