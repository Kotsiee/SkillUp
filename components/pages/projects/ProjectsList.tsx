import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { Project, ProjectRole } from '../../../lib/newtypes/index.ts';
import AIcon, { Icons } from '../../Icons.tsx';
import { ProjectCard } from './ProjectCard.tsx';
import { useUser } from '../../../islands/contexts/UserProvider.tsx';
import { PageProps } from '$fresh/server.ts';

export function ProjectsList({ pageProps }: { pageProps: PageProps }) {
  const projects = useSignal<{ project: Project; role: ProjectRole }[]>([]);
  const { team } = useUser();

  useEffect(() => {
    console.log('ProjectsList: ', pageProps.params);
    fetch(`/api/projects/user/projects`)
      .then(res => res.json())
      .then(data => {
        projects.value = data;
      });
  }, [pageProps.params]);

  return (
    <div class="projects-list" role="region" aria-label="Projects List">
      <div class="projects-list__header" role="heading" aria-level={2}>
        <h3 class="projects-list__title">Project</h3>
        <AIcon startPaths={Icons.Search} size={20} aria-label="Search Projects" />
      </div>

      <div class="projects-list__options" role="navigation" aria-label="Projects Options">
        {/* Options content here */}
      </div>

      <div class="projects-list__chats" role="list" aria-label="Projects">
        {projects.value.length > 0
          ? projects.value.map(project => (
              <ProjectCard project={project.project} key={project.project.id} />
            ))
          : null}

        {team && (
          <div class="projects-list__create">
            <a href="/projects/create" f-partial="/projects/partials/create">
              + Create Project
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
