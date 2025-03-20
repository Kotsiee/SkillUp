// deno-lint-ignore-file no-explicit-any
import { defineRoute } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import { ProjectDetails } from "../../../islands/explore/ProjectDetails.tsx";
import ProjectList from "../../../islands/explore/ProjectList.tsx";
import ExploreFilters from "../../../islands/explore/ExploreFilter.tsx";
import { parseProjectFilter } from "../../../lib/utils/parsers.ts";

export default defineRoute(async (req, _ctx) => {
  const url = new URL(req.url);
  const projectId = url.searchParams.get("project");
  const filters = parseProjectFilter(url.search);
  const project = await fetchProjectByID(projectId!);

  return (
    <div class="container">
      <link rel="stylesheet" href="/styles/pages/explore/projects.css" />
      <ExploreFilters
      url={url}
      sort={["Best Match", "Most Recent", "Recently Updated", "Estimated Budget", "Contributors"]}
      startSort={url.searchParams.get("sort") || "Best Match"}
      filter={[
        {
          contentType: 'multi-dropdown',
          items: ["English", "French"],
          name: "Job Type",
          placeholder: "Job Type...",
          startFilters: {
            items: url.searchParams.get("jobType")?.split(',')
          }
        },
        {
          contentType: 'multi-dropdown',
          items: ["English", "French"],
          name: "Language",
          placeholder: "Language...",
          startFilters: {
            items: url.searchParams.get("language")?.split(',')
          }
        },
        {
          contentType: 'dual-slider',
          name: "Budget",
          min: 0,
          max: 123,
          step: 3,
          startFilters: {
            min: url.searchParams.get("minBudget") as any as number | 'min',
            max: url.searchParams.get("maxBudget") as any as number | 'max'
          }
        },
        {
          contentType: 'dual-slider',
          name: "Contributors",
          min: 0,
          max: 500,
          step: 20,
          startFilters: {
            min: url.searchParams.get("minContributors") as any as number | 'min',
            max: url.searchParams.get("maxContributors") as any as number | 'max'
          }
        }
      ]}
      />

      <div class="explore-projects" f-client-nav>

        {/* <div class="explore-projects-items">
          <ProjectList filters={filters}/>
        </div>

        <div class="explore-projects-details">
          <div class="container">

            <Partial name="project-content">
              <ProjectDetails key={project?.id} project={project} />
            </Partial>

          </div>
        </div> */}


      </div>
    </div>
  );
});

// const data = await fetchProjects();

// const url = new URL(req.url);
// const projectId = url.searchParams.get("project")
//   ? url.searchParams.get("project")
//   : data?.[0].id;

// if (!url.searchParams.get("project")) {
//   const newUrl = `${url.href}?project=${data?.[0].id}`;
//   return Response.redirect(newUrl, 302);
// }

// const project = await fetchProjectByID(projectId!);
