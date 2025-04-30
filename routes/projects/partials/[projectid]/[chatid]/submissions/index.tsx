//Conversations
import { PageProps } from '$fresh/server.ts';
import { Partial } from '$fresh/runtime.ts';
import ProjectNavigation from './../../../../../../islands/projects/project/ProjectNavigation.tsx';
import Submissions from '../../../../../../islands/chat/submissions/Submissions.tsx';
import ProjectsList from '../../../../../../islands/projects/ProjectsList.tsx';

export default function SubmissionsPage(pageProps: PageProps) {
  return (
    <Partial name="projects">
      <link rel="stylesheet" href="/styles/pages/messages/submissions.css" />
      <ProjectsList pageProps={pageProps}>
        <ProjectNavigation pageProps={pageProps} />
        <Submissions pageProps={pageProps} />
      </ProjectsList>
    </Partial>
  );
}
