//Conversations
import { PageProps } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import { useUser } from "../../../../islands/contexts/UserProvider.tsx";
import Attachments from "../../../../islands/chat/Attachments.tsx";
import ChatLayout from "../../../../islands/chat/ChatLayout.tsx";

export default function Conversations(pageProps: PageProps) {
    const user = useUser();

    return (
        <Partial name="convo-messages">
            <ChatLayout pageProps={pageProps} user={user} />
            <div class="chat-messages-container">
                <Attachments />
            </div>
        </Partial>
    );
}
