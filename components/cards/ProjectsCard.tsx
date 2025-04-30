import { ProjectRole } from '../../lib/types/index.ts';

export default function ProjectCard({ project }: { project: ProjectRole }) {
  return (
    <li class="chat-item">
      <a
        class={`chat-link`}
        href={`/projects/${project.project?.id}`}
        f-partial={`/projects/partials/${project.project?.id}`}
      >
        <Card project={project} />
      </a>
    </li>
  );
}

const Card = ({ project }: { project: ProjectRole }) => {
  console.log(project);

  return (
    <div class="container">
      <div>
        <img class="chat-photo" src={project.project?.team?.logo?.med?.publicURL} />
      </div>
      <div>
        <p>{project.project?.title}</p>
        <p className="lastMessage">{project.project?.team?.name}</p>
      </div>
    </div>
  );
};
