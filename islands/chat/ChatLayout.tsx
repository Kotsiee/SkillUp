import { useEffect, useState } from "preact/hooks";
import { Chat } from "../../lib/types/index.ts";
import { PageProps } from "$fresh/server.ts";
import AIcon, { Icons } from "../../components/Icons.tsx";
import { useUser } from "../contexts/UserProvider.tsx";

interface IChatLayout {
  pageProps: PageProps;
  type: "messages" | "projects";
  extras?: [string, string][];
}

export default function ChatLayout(
  { pageProps, type }: IChatLayout,
) {
  const [chat, setChat] = useState<Chat>();
  const { user } = useUser();
  const extras: [string, string][] = [
    ["chat", "Chat"],
    ["submissions", "Submissions"],
    ["attachments", "Attachments"],
    ["description", "Description"],
  ];

  if (!user) {
    return <></>;
  }

  useEffect(() => {
    async function fetchMessages() {
      const res = await fetch(`/api/chats/${pageProps.params.chatid}/chat`);
      const data = await res.json();
      const thisChat: Chat = data.json;
      setChat(thisChat);
    }

    fetchMessages();
  }, [pageProps.params.chatid]);

  const getChatInfo = (type: "photo" | "name") => {
    if (!chat || !user) return "";

    const otherUser = chat.users!.find((u) => u.user?.id != user.id)?.user!;

    switch (type) {
      case "photo":
        return chat.photo != null
          ? chat.photo.url
          : otherUser?.profilePicture?.med?.publicURL;
      case "name":
        return chat.name ? chat.name : otherUser?.username;
    }
  };

  if (chat) {
    return (
      <div class="chat-header">
        <div class="chat-header-container">
          <div class="left">
            {type === "messages"
              ? (
                <div class="chat-title">
                  <img class="chat-photo" src={getChatInfo("photo")} />
                  <div>
                    <h5>{getChatInfo("name")}</h5>
                  </div>
                </div>
              )
              : (
                <div>
                  <h5>
                    <span>{chat.task?.meta?.icon}</span> {chat.name}
                  </h5>
                </div>
              )}
          </div>

          <div class="center">
            <SelectView pageProps={pageProps} type={type} extras={extras} />
          </div>

          <div class="right">
            <AIcon className="chatmenu" startPaths={Icons.DotMenu} size={20} />
          </div>
        </div>
      </div>
    );
  }

  return <></>;
}

const SelectView = (
  { pageProps, type, extras }: {
    pageProps: PageProps;
    type: string;
    extras: [string, string][];
  },
) => {
  const route = pageProps.route.split("/:chatid/")[0] + '/:chatid';
  const newRoute = route.replace(':project', pageProps.params.project).replace(':chatid', pageProps.params.chatid)
  console.log(newRoute)
  let title = "Chat";
  extras.some(([first, second]) => {
    if (pageProps.route.includes(first)) {
      title = second;
    }
  });

  return (
    <div class="select-view">
      <p>{title}</p>

      <div class="lines-container">
        <div class="lines">
          {extras.map((page) => {
            return (
              <a
                class="select-view-input"
                href={`${newRoute}/${page[0]}`}
                f-partial={`${newRoute}/partials/${page[0]}`}
              >
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};
