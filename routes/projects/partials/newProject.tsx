import { PageProps } from '$fresh/server.ts';
import { Partial } from '$fresh/runtime.ts';
import NewProject from '../../../islands/projects/NewProject.tsx';

export default function Projects(pageProps: PageProps) {
  return (
    <Partial name="projects">
      <NewProject />
    </Partial>
  );
}
