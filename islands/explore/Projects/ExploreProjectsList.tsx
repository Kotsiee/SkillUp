import { useEffect, useState } from 'preact/hooks';
import { ProjectCard } from '../../../components/cards/ProjectCard.tsx';
import { Skeleton } from '../../../components/Skeletons.tsx';
import { Project } from '../../../lib/types/index.ts';
import { ProjectFilter, joinProjectFilter } from '../../../lib/utils/parsers.ts';
import { Signal } from '@preact/signals';

export default function ProjectList({
  filters,
  project,
}: {
  filters: ProjectFilter | null;
  project: Signal<Project | null>;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const query = joinProjectFilter(filters);

  useEffect(() => {
    fetch(`/api/projects`)
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (filters && filters.project) {
      fetch(`/api/projects?id=${filters.project}`)
        .then(res => res.json())
        .then(data => {
          project.value = data;
        });
    } else if (!project.value && projects[0]) project.value = projects[0];
  }, [projects, filters?.project]);

  return (
    <div class="container">
      {loading ? (
        <Skeleton count={5}>
          <h1>hi</h1>
        </Skeleton>
      ) : (
        projects?.map((proj, index) => (
          <ProjectCard key={index} project={proj} query={query} currentProject={project} />
        ))
      )}
    </div>
  );
}
