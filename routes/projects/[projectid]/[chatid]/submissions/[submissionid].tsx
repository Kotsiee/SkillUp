import { PageProps } from '$fresh/server.ts';
import { Partial } from '$fresh/runtime.ts';
import ProjectsList from '../../../../../islands/projects/ProjectsList.tsx';
import ProjectNavigation from './../../../../../islands/projects/project/ProjectNavigation.tsx';
import SubmissionItem from '../../../../../islands/chat/submissions/Submission.tsx';

export default function SubmissionPage(pageProps: PageProps) {
  return (
    <Partial name="projects">
      <link rel="stylesheet" href="/styles/pages/messages/submission.css" />
      <ProjectsList pageProps={pageProps}>
        <ProjectNavigation pageProps={pageProps} />
        <SubmissionItem pageProps={pageProps} />
      </ProjectsList>
    </Partial>
  );
}
