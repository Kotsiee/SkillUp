import { Project } from '../../../lib/newtypes/index.ts';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      class="project-card"
      href={`/projects/${project.id}`}
      f-partial={`/projects/partials/${project.id}`}
      aria-label={`Open project with ${project.title}`}
    >
      <div class="project-card__container">
        <div class="project-card__photo" role="img" aria-label="Project photo">
          <img
            class="project-card__photo-image"
            src={project.team?.logo?.med?.publicURL ?? 'assets/images/placeholders/teams.webp'}
            alt={`${project.team?.name} project photo`}
            loading="lazy"
          />
        </div>

        <div class="project-card__details">
          <p class="project-card__name">{project.title}</p>
          <p class="project-card__team">{project.team?.name}</p>
        </div>
      </div>
    </a>
  );
}
