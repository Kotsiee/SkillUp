//Conversations
import { PageProps } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import { useUser } from "../../../../components/UserContext.tsx";
import ChatLayout from "../../../../islands/chat/ChatLayout.tsx";
import ChatMessages from "../../../../islands/chat/ChatMessages.tsx";
import { SupabaseInfo, getSupabaseClient } from "../../../../lib/supabase/client.ts";

export default function Conversations(pageProps: PageProps) {
  const supabaseInfo = new SupabaseInfo(getSupabaseClient());
  const url = supabaseInfo.getUrl();
  const key = supabaseInfo.getAnonKey();

  return (
    <Partial name="convo-messages">
      <ChatLayout pageProps={pageProps} type="messages" extras={[["", "Chat"], ["attachments", "Attachments"]]}/>
      <ChatMessages
        pageProps={pageProps}
        p={{ supabaseUrl: url, supabaseAnonKey: key, type: "messages" }}
      />
    </Partial>
  );
}
