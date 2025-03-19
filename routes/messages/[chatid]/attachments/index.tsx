//Conversations
import { PageProps } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import Attachments from "../../../../islands/chat/attachments/Attachments.tsx";
import ChatLayout from "../../../../islands/chat/ChatLayout.tsx";

export default function Conversations(pageProps: PageProps) {
    return (
        <Partial name="convo-messages">
            <link rel="stylesheet" href="/styles/pages/messages/attachments.css" />
            <ChatLayout pageProps={pageProps} type="messages" extras={[["chat", "Chat"], ["attachments", "Attachments"]]}/>
            <div class="chat-messages-container">
                <Attachments pageProps={pageProps}/>
            </div>
        </Partial>
    );
}
