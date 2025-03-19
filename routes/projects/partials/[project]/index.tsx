import { PageProps } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import ProjectsLayout from "../../../../islands/projects/ProjectsLayout.tsx";

export default function Projects(pageProps: PageProps) {
  return (
    <Partial name="projects">
      <ProjectsLayout pageProps={pageProps}>
        <div>
            <h1>Nothing to see here part 2</h1>
        </div>
      </ProjectsLayout>
    </Partial>
  );
}