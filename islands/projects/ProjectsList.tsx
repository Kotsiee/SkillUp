import { useEffect, useState } from 'preact/hooks';
import { Skeleton } from '../../components/Skeletons.tsx';
import type { PageProps } from '$fresh/server.ts';
import ProjectCard from '../../components/cards/ProjectsCard.tsx';
import AIcon, { Icons } from '../../components/Icons.tsx';
import ProjectChatCard from '../../components/cards/ProjectChatCard.tsx';
import { User, Project, ProjectRole, Chat } from '../../lib/types/index.ts';

export default function ChatList({ pageProps, user }: { pageProps: PageProps; user: User | null }) {
  if (!user) return null;

  return (
    <div class="chat-list-container">
      {pageProps.params.project ? <ProjectChatList pageProps={pageProps} /> : <ProjectsList />}
    </div>
  );
}

function ProjectChatList({ pageProps }: { pageProps: PageProps }) {
  const [project, setProject] = useState<Project>();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/user/projects/${pageProps.params.project}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setProject(data.json);
        setLoading(false);
      });

    fetch(`/api/user/projects/${pageProps.params.project}/chats`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setChats(data.json);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div class="projects-list">
        <div class="title">
          <h3>Projects</h3>
          <AIcon startPaths={Icons.Search} size={20} />
        </div>
        <Skeleton count={5}>
          <div class="skeleton sk-flex sk-interactive">
            <div class="sk-shiny sk-circle sk-med"></div>
            <div class="sk-block">
              <div class="sk-shiny sk-rect sk-med" />
              <div class="sk-shiny sk-rect sk-small" />
            </div>
          </div>
        </Skeleton>
      </div>
    );
  }

  return (
    <div class="project-chat-list">
      <div class="head">
        <a class="back" href="/projects" f-partial="/projects/partials">
          Back
        </a>
        <AIcon className="menu" startPaths={Icons.DotMenu} size={20} />
      </div>

      <div class="title">
        <img
          class="organisation-image"
          src={
            'https://media.wired.com/photos/65382632fd3d190c7a1f5c68/1:1/w_1800,h_1800,c_limit/Google-Image-Search-news-Gear-GettyImages-824179306.jpg'
          }
        />
        <div>
          <h4>{project?.title}</h4>
          <p class="organisation-name">{project?.team?.name}</p>
        </div>
      </div>

      <div class="project-details"></div>

      <div class="project-chats">
        <ul>
          {chats.map((chat, _index) => {
            return <ProjectChatCard pageProps={pageProps} chat={chat} />;
          })}
        </ul>
      </div>
    </div>
  );
}

function ProjectsList() {
  const [role, setRole] = useState<ProjectRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/user/projects`)
      .then(res => res.json())
      .then(data => {
        setRole(data.json);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div class="projects-list">
        <div class="title">
          <h3>Projects</h3>
          <AIcon startPaths={Icons.Search} size={20} />
        </div>
        <Skeleton count={5}>
          <div class="skeleton sk-flex sk-interactive">
            <div class="sk-shiny sk-circle sk-med"></div>
            <div class="sk-block">
              <div class="sk-shiny sk-rect sk-med" />
              <div class="sk-shiny sk-rect sk-small" />
            </div>
          </div>
        </Skeleton>
      </div>
    );
  }

  return (
    <div class="projects-list">
      <div class="title">
        <h3>Projects</h3>
        <AIcon startPaths={Icons.Search} size={20} />
      </div>
      <ul>
        {role.map((role, _index) => {
          return <ProjectCard project={role} />;
        })}
      </ul>

      <a href="/projects/newProject" f-partial="/projects/partials/newProject">
        New Project
      </a>
    </div>
  );
}
