import { PageProps } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import ProjectsLayout from "../../../../islands/projects/ProjectsLayout.tsx";
import ChatMessages from "../../../../islands/chat/messages/ChatMessages.tsx";
import ChatLayout from "../../../../islands/chat/ChatLayout.tsx";

export default function Projects(pageProps: PageProps) {

  return (
    <Partial name="projects">
      <ProjectsLayout pageProps={pageProps}>
        <ChatLayout
          pageProps={pageProps}
          type="projects"
        />
        <ChatMessages
          pageProps={pageProps}
        />
      </ProjectsLayout>
    </Partial>
  );
}
