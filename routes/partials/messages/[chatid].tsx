//Conversations
import { PageProps } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import ChatMessages from "../../../islands/chat/ChatMessages.tsx";
import { getSupabaseClient, SupabaseInfo } from "../../../lib/supabase/client.ts";
import { useUser } from "../../../islands/contexts/UserProvider.tsx";

export default function Conversations(props: PageProps) {
    const supabaseInfo = new SupabaseInfo(getSupabaseClient());
    const url = supabaseInfo.getUrl();
    const key = supabaseInfo.getAnonKey();

    const user = useUser();

    return (
        <div class="chat">
            <Partial name="convo-messages">
                <h1>okay</h1>
            </Partial>
        </div>
    );
}