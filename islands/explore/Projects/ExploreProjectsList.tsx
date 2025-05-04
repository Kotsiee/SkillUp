import { useEffect, useState } from 'preact/hooks';
import { Project } from '../../../lib/newtypes/index.ts';
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

  return <div class="container"></div>;
}
