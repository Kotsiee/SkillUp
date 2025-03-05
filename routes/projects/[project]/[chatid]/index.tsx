import { PageProps } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import { useUser } from "../../../../islands/contexts/UserProvider.tsx";
import ProjectsLayout from "../../../../islands/projects/ProjectsLayout.tsx";
import ChatMessages from "../../../../islands/chat/ChatMessages.tsx";
import {
  getSupabaseClient,
  SupabaseInfo,
} from "../../../../lib/supabase/client.ts";
import ProjectsChatLayout from "../../../../islands/projects/ProjectsHeader.tsx";
import ChatLayout from "../../../../islands/chat/ChatLayout.tsx";

export default function Projects(pageProps: PageProps) {
  const supabaseInfo = new SupabaseInfo(getSupabaseClient());
  const url = supabaseInfo.getUrl();
  const key = supabaseInfo.getAnonKey();
  const user = useUser();

  return (
    <Partial name="projects">
      <ProjectsLayout pageProps={pageProps} user={user}>
        <ChatLayout
          pageProps={pageProps}
          user={user}
          type="projects"
          extras={[["", "Chat"], ["submissions", "Submissions"], [
            "attachments",
            "Attachments",
          ], ["description", "Description"]]}
        />
        <ChatMessages
          pageProps={pageProps}
          p={{
            supabaseUrl: url,
            supabaseAnonKey: key,
            user: user!,
            type: "projects",
          }}
        />
      </ProjectsLayout>
    </Partial>
  );
}
