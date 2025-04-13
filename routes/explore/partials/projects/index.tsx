// deno-lint-ignore-file no-explicit-any
import { PageProps } from '$fresh/server.ts';
import { Partial } from '$fresh/runtime.ts';
import ExploreProjects from '../../../../islands/explore/Projects/ExploreProjects.tsx';

export default function Projects(pageProps: PageProps) {
  return (
    <div class="container">
      <link rel="stylesheet" href="/styles/pages/explore/projects.css" />
      <Partial name="explore-projects">
        <ExploreProjects ctx={pageProps} />
      </Partial>
    </div>
  );
}
