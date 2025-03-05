import { defineRoute } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import { fetchProjectByID } from "../../../lib/api/projectApi.ts";
import { ProjectDetails } from "../../../islands/explore/ProjectDetails.tsx";


export default defineRoute(async (req, _ctx) => {
  const url = new URL(req.url);
  const projectId = url.searchParams.get("project")
  const project = await fetchProjectByID(projectId!);
  return (
    <Partial name="project-content">
      <ProjectDetails key={project?.id} project={project} /> 
    </Partial>
  );
});