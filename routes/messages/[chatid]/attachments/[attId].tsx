//Conversations
import { PageProps } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import Attachment from "../../../../islands/chat/attachments/Attachment.tsx";
import ChatLayout from "../../../../islands/chat/ChatLayout.tsx";

export default function Conversations(pageProps: PageProps) {
    return (
        <Partial name="convo-messages">
            <link rel="stylesheet" href="/styles/pages/messages/attachment.css" />
            <ChatLayout pageProps={pageProps} type="messages" extras={[["chat", "Chat"], ["attachments", "Attachments"]]}/>
            <div class="chat-messages-container">
                <Attachment pageProps={pageProps}/>
            </div>
        </Partial>
    );
}
