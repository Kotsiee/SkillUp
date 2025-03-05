import { PageProps } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import { useUser } from "../../../../islands/contexts/UserProvider.tsx";
import ProjectsLayout from "../../../../islands/projects/ProjectsLayout.tsx";
import ChatLayout from "../../../../islands/chat/ChatLayout.tsx";

export default function Projects(pageProps: PageProps) {
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
      </ProjectsLayout>
    </Partial>
  );
}
