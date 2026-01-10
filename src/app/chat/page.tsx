import { redirect } from "next/navigation";
import { api } from "@/trpc/server";

export const metadata = {
  title: "Chat",
  description: "Chat with your favorite characters",
};

export default async function ChatPage() {
  try {
    const result = await api.chat.getChats();
    const chats = result.data?.chats ?? [];

    if (chats.length > 0) {
      // Redirect to the first chat (most recent by lastMessageAt)
      redirect(`/chat/${chats[0]!.id}`);
    } else {
      // No chats - redirect to /chat/0
      redirect("/chat/0");
    }
  } catch {
    // Not authenticated or error - redirect to /chat/0
    redirect("/chat/0");
  }
}
