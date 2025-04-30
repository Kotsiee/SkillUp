//Conversations
import { PageProps } from '$fresh/server.ts';
import { Partial } from '$fresh/runtime.ts';
import ProjectNavigation from './../../../../../islands/projects/project/ProjectNavigation.tsx';
import Attachments from '../../../../../islands/chat/attachments/Attachments.tsx';
import ProjectsList from '../../../../../islands/projects/ProjectsList.tsx';

export default function AttachmentsPage(pageProps: PageProps) {
  return (
    <Partial name="projects">
      <link rel="stylesheet" href="/styles/pages/messages/attachments.css" />
      <ProjectsList pageProps={pageProps}>
        <ProjectNavigation pageProps={pageProps} />
        <Attachments pageProps={pageProps} />
      </ProjectsList>
    </Partial>
  );
}
