//Conversations
import { PageProps } from '$fresh/server.ts';
import { Partial } from '$fresh/runtime.ts';
import ProjectNavigation from '../../../../islands/projects/project/ProjectNavigation.tsx';
import ProjectMessages from '../../../../islands/projects/project/ProjectMessages.tsx';
import ProjectsList from '../../../../islands/projects/ProjectsList.tsx';

export default function Conversations(pageProps: PageProps) {
  return (
    <Partial name="projects">
      <link rel="stylesheet" href="/styles/pages/messages/chat.css" />
      <ProjectsList pageProps={pageProps}>
        <ProjectNavigation pageProps={pageProps} />
        <ProjectMessages pageProps={pageProps} />
      </ProjectsList>
    </Partial>
  );
}
