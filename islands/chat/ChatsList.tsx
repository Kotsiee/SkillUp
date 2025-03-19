import { useEffect, useState } from "preact/hooks";
import { Skeleton } from "../../components/Skeletons.tsx";
import { Chat, User } from "../../lib/types/index.ts";
import ChatCard from "../../components/cards/ChatCard.tsx";
import type { PageProps } from "$fresh/server.ts";
import { useUser } from "../contexts/UserProvider.tsx";

export default function ChatList({pageProps} : {pageProps: PageProps}) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    fetch(`/api/chats`)
      .then((res) => res.json())
      .then((data) => {
        setChats(data.json);
        setLoading(false);
      });
  }, []);

  if (!user)
    return (<></>)

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
