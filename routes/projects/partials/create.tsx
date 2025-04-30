import { PageProps } from '$fresh/server.ts';
import { Partial } from '$fresh/runtime.ts';
import NewProject from '../../../islands/projects/newProject/NewProject.tsx';

export default function NewProjects(pageProps: PageProps) {
  return (
    <Partial name="projects">
      <link rel="stylesheet" href="/styles/pages/projects/create/create.css" />
      <NewProject />
    </Partial>
  );
}
