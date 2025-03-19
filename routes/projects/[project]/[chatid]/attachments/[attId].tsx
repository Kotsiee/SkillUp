import { PageProps } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import ProjectsLayout from "../../../../../islands/projects/ProjectsLayout.tsx";
import Attachment from "../../../../../islands/chat/attachments/Attachment.tsx";

export default function Projects(pageProps: PageProps) {
  return (
    <Partial name="projects">
      <link rel="stylesheet" href="/styles/pages/messages/attachment.css" />

      <ProjectsLayout pageProps={pageProps}>
        <div class="chat-messages-container">
          <Attachment pageProps={pageProps} />
        </div>
      </ProjectsLayout>
    </Partial>
  );
}
