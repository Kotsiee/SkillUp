//Conversations
import { PageProps } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import ChatMessages from "../../../islands/chat/ChatMessages.tsx";
import { getSupabaseClient, SupabaseInfo } from "../../../lib/supabase/client.ts";
import { useUser } from "../../../islands/contexts/UserProvider.tsx";
import ChatLayout from "../../../islands/chat/ChatLayout.tsx";

export default function Conversations(pageProps: PageProps) {
  const supabaseInfo = new SupabaseInfo(getSupabaseClient());
  const url = supabaseInfo.getUrl();
  const key = supabaseInfo.getAnonKey();

  const user = useUser();

  return (
    <Partial name="convo-messages">
      <ChatLayout pageProps={pageProps} user={user}/>
      <ChatMessages
        pageProps={pageProps}
        p={{ supabaseUrl: url, supabaseAnonKey: key, user: user! }}
      />
    </Partial>
  );
}
