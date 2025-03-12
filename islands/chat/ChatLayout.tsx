import { useEffect, useState } from "preact/hooks";
import { Chat, User } from "../../lib/types/index.ts";
import { PageProps } from "$fresh/server.ts";
import AIcon, { Icons } from "../../components/Icons.tsx";
import { useUser } from "../contexts/UserProvider.tsx";

interface IChatLayout {
  pageProps: PageProps;
  type: "messages" | "projects";
  extras: [string, string][];
}

export default function ChatLayout(
  { pageProps, type, extras }: IChatLayout,
) {
  const [chat, setChat] = useState<Chat>();

  const user = useUser();
  
    if (!user)
      return(<></>)

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
          : otherUser?.profilePicture?.url;
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
                <div>
                  <img class="chat-photo" src={getChatInfo("photo")} />
                  <div>
                    <h5>{getChatInfo("name")}</h5>
                  </div>
                </div>
              )
              : (
                <div>
                  <h5><span>{chat.task?.meta?.icon}</span> {chat.name}</h5>
                </div>
              ) }
          </div>

          <div class="center">
            <SelectView pageProps={pageProps} extras={extras} />
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

const SelectView = ({pageProps, extras} : {pageProps: PageProps, extras: [string, string][]}) => {
  const route = pageProps.route.split('/')
  let path = globalThis.location.pathname
  let title = 'Chat'
  extras.some(([first, second]) => {
    if (first === route[route.length - 1])
    {
      title = second
      path = path.replace(first, "")
      path = path.slice(0, path.length - 1)
      console.log(path)
    }
  })

  return (
    <div class="select-view">
      <p>{title}</p>

      <div class="lines-container">
        <div class="lines">
          {
            extras.map(page => {
              return (<a
                class="select-view-input"
                href={`${path}${page[0] ? '/' + page[0] : '' }`}
                f-partial={`${path}/partials/${page[0]}`}
              >
              </a>)
            })
          }
        </div>
      </div>
    </div>
  );
};
