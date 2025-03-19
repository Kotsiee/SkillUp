import { PageProps } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import ProjectsLayout from "../../../../../../islands/projects/ProjectsLayout.tsx";
import Attachments from "../../../../../../islands/chat/attachments/Attachments.tsx";

export default function Projects(pageProps: PageProps) {
  return (
    <Partial name="projects">
      <link rel="stylesheet" href="/styles/pages/messages/attachments.css" />

      <ProjectsLayout pageProps={pageProps}>
        <div class="chat-messages-container">
          <Attachments pageProps={pageProps} />
        </div>
      </ProjectsLayout>
    </Partial>
  );
}
