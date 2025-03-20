import { useEffect, useState } from "preact/hooks";
import { Skeleton } from "../../components/Skeletons.tsx";
import { ProjectCard } from "../../components/cards/ProjectCard.tsx";
import { ProjectFilter, joinProjectFilter } from "../../lib/utils/parsers.ts";
import { Project } from "../../lib/types/index.ts";

export default function ProjectList(props : {filters: ProjectFilter | null}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const query = joinProjectFilter(props.filters)

  useEffect(() => {
    fetch(`/api/projects?${query}`)
    .then((res) => res.json())
    .then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  return (
    <div class="container">
      {loading ? (
        <Skeleton count={5}>
          <h1>hi</h1>
        </Skeleton>
      ) : 
      (
        projects?.map((proj, index) => (
          <ProjectCard key={index} project={proj} query={query}/>
        ))
      )
      }
    </div>
  );
}