import { PageProps } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import { useUser } from "../../../islands/contexts/UserProvider.tsx";
import ProjectsLayout from "../../../islands/projects/ProjectsLayout.tsx";

export default function Projects(pageProps: PageProps) {
  const user = useUser()

  return (
    <Partial name="projects">
      <ProjectsLayout pageProps={pageProps} user={user}>
        <div>
            <h1>Nothing to see here part 2</h1>
        </div>
      </ProjectsLayout>
    </Partial>
  );
}