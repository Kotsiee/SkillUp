import { ProjectRole } from "../../lib/types/index.ts";

export default function ProjectCard({project}: { project: ProjectRole }) {
    return (
        <li class="chat-item">
            <a class={`chat-link`}
            href={`/projects/${project.project?.id}`} 
            f-partial={`/projects/partials/${project.project?.id}`}
            >
                <Card project={project}/>
            </a>
        </li>
    )
}

const Card = ({project}: { project: ProjectRole}) => {
    return(
        <div class="container">
            <div>
                <img class="chat-photo" src={"https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-169994-674010.jpg&fm=jpg"}/>
            </div>
            <div>
                <p>{project.project?.title}</p>
                <p className="lastMessage">{project.project?.team?.name}</p>
            </div>
        </div>
    )
}