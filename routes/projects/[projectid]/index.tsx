import { PageProps } from '$fresh/server.ts';
import { Partial } from '$fresh/runtime.ts';
import ProjectDetails from '../../../islands/projects/project/ProjectDetails.tsx';
import ProjectsList from '../../../islands/projects/ProjectsList.tsx';

export default function Projects(pageProps: PageProps) {
  return (
    <Partial name="projects">
      <ProjectsList pageProps={pageProps}>
        <ProjectDetails pageProps={pageProps} />
      </ProjectsList>
    </Partial>
  );
}
