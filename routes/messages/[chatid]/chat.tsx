//Conversations
import { PageProps } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import ChatLayout from "../../../islands/chat/ChatLayout.tsx";
import ChatMessages from "../../../islands/chat/messages/ChatMessages.tsx";

export default function Conversations(pageProps: PageProps) {

  return (
    <Partial name="convo-messages">
      <link rel="stylesheet" href="/styles/pages/messages/chat.css" />
      <ChatLayout pageProps={pageProps} type="messages" extras={[["chat", "Chat"], ["attachments", "Attachments"]]}/>
      <ChatMessages pageProps={pageProps} />
    </Partial>
  );
}
