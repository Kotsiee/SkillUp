import { useEffect, useState } from "preact/hooks";
import { Skeleton } from "../../components/Skeletons.tsx";
import { Chat, User } from "../../lib/types/index.ts";
import ChatCard from "../../components/cards/ChatCard.tsx";
import type { PageProps } from "$fresh/server.ts";

export default function ChatList({user} : {pageProps: PageProps, user: User | null}) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/chats/${user?.id}`)
      .then((res) => res.json())
      .then((data) => {
        setChats(data.json);
        setLoading(false);
      });
  }, []);

  if (!user)
    return null

  return (
    <div class="chat-list-container">
      {loading
        ? (
          <Skeleton count={5}>
            <h1>hi</h1>
          </Skeleton>
        )
        : (
          <ul>
            {chats.map((chat, _index) => {
              return ( <ChatCard chat={chat} user={user} /> );
            })}
          </ul>
        )}
    </div>
  );
}