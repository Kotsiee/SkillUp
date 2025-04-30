import { PageProps } from '$fresh/server.ts';
import { Partial } from '$fresh/runtime.ts';
import ProjectsList from '../../../islands/projects/ProjectsList.tsx';

export default function Projects(pageProps: PageProps) {
  return (
    <Partial name="projects">
      <ProjectsList pageProps={pageProps}>
        <h1>Nothing to see here</h1>
      </ProjectsList>
    </Partial>
  );
}
