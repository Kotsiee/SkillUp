import { useEffect, useState } from "preact/hooks";
import { PageProps } from "$fresh/server.ts";
import AIcon, { Icons } from "../../components/Icons.tsx";

export default function ProjectsChatLayout({pageProps, user}: { pageProps: PageProps; user: User | null;}) {
  const [chat, setChat] = useState<Chat>();

  useEffect(() => {
    async function fetchMessages() {
      const res = await fetch(`/api/chats/${pageProps.params.chatid}/chat`);
      const data = await res.json();
      const thisChat: Chat = data.json;
      setChat(thisChat);
    }

    fetchMessages();
  }, [pageProps.params.chatid]);

  if (chat)
    return (
      <div class="chat-header">
        <div class="chat-header-container">
          <div class="left">
            <h3>{chat.task?.meta?.icon}</h3>
            <div>
              <h6>{chat.task?.title}</h6>
              <p class="isTyping">is typing...</p>
            </div>
          </div>

          <div class="center">
            <SelectView pageProps={pageProps} />
          </div>

          <div class="right">
            <AIcon className="chatmenu" startPaths={Icons.DotMenu} size={20} />
          </div>
        </div>
      </div>
    );
    
  return <></>;
}

const SelectView = ({pageProps }: { pageProps: PageProps }) => {
  let title = 'Chat'
  switch (globalThis.location.href.split(`${pageProps.params.chatid}/`)[1]){
    case 'attachments': title = "Attachments"; break;
    case 'info': title = "Chat Info"; break;
  }

  return (
    <div class="select-view">
      <p>{title}</p>

      <div class="lines-container">
        <div class="lines">
          <a
            class="select-view-input"
            href={`/projects/${pageProps.params.project}/${pageProps.params.chatid}`}
            f-partial={`/partials/projects/${pageProps.params.project}/${pageProps.params.chatid}`}
          >
          </a>

          <a
            class="select-view-input"
            href={`/projects/${pageProps.params.project}/${pageProps.params.chatid}/attachments`}
            f-partial={`/partials/projects/${pageProps.params.project}/${pageProps.params.chatid}/attachments`}
          >
          </a>

          <a
            class="select-view-input"
            href={`/projects/${pageProps.params.project}/${pageProps.params.chatid}/info`}
            f-partial={`/partials/projects/${pageProps.params.project}/${pageProps.params.chatid}/info`}
          >
          </a>
        </div>
      </div>
    </div>
  );
};
