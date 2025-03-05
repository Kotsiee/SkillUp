//Conversations
import { PageProps } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import { useUser } from "../../../../../islands/contexts/UserProvider.tsx";
import Attachment from "../../../../../islands/chat/Attachment.tsx";

export default function Conversations(props: PageProps) {
    const user = useUser();

    return (
        <Partial name="convo-messages">
            <Attachment/>
        </Partial>
    );
}