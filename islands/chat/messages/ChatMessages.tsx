import { useEffect, useState } from "preact/hooks";
import { PageProps } from "$fresh/server.ts";
import ChatSection from "./ChatSection.tsx";
import { useUser } from "../../contexts/UserProvider.tsx";
import { Chat } from "../../../lib/types/index.ts";

export default function ChatMessages({ pageProps }: { pageProps: PageProps }) {
  const [chat, setChat] = useState<Chat | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const response = await fetch(`/api/chats/${pageProps.params.chatid}`);
        if (!response.ok) throw new Error("Failed to fetch chat data");
        const { json } = await response.json();
        setChat(json);
      } catch (error) {
        console.error("Error fetching chat:", error);
      }
    };

    fetchChat();
  }, [pageProps.params.chatid]);

  if (!user || !chat) return <div>Not loaded</div>;

  return (
    <div class="chat-messages-container">
      <ChatSection chat={chat} user={user} />
    </div>
  );
}
