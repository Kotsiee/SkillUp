import { PageProps } from '$fresh/server.ts';
import { useChat } from '../../../islands/contexts/ChatProvider.tsx';
import { useProject } from '../../../islands/contexts/ProjectProvider.tsx';
import { Chat, Task } from '../../../lib/newtypes/index.ts';
import AIcon, { Icons } from '../../Icons.tsx';
import { ChatCard } from './ChatCard.tsx';
import { useEffect } from 'preact/hooks';

export function ChatList({ pageProps }: { pageProps: PageProps }) {
  const { project, fetchProject } = useProject();
  const { chat } = useChat();

  useEffect(() => {
    fetchProject(pageProps.params.projectid);
  }, [pageProps.params]);

  if (!project) return null;

  return (
    <div class="projects-chat-list" role="region" aria-label="Project Chats List">
      <div class="projects-chat-list__actions-top">
        <a
          class="projects-chat-list__actions-top-back"
          href="/projects"
          f-partial="/projects/partials"
        >
          <AIcon startPaths={Icons.LeftChevron} size={16} />
          Back
        </a>
        <AIcon className="projects-chat-list__actions-top-menu" startPaths={Icons.DotMenu} />
      </div>
      <div class="projects-chat-list__header" role="heading" aria-level={2} f-client-nav={false}>
        <a class="projects-chat-list__header-team-logo" href={`/${project.team.handle}`}>
          <img
            class="projects-chat-list__header-team-logo-img"
            src={project.team.logo.med.publicURL}
          />
        </a>
        <div class="projects-chat-list__header-details">
          <h3 class="projects-chat-list__header-title">{project.title}</h3>
          <a class="projects-chat-list__header-team-name" href={`/${project.team.handle}`}>
            {project.team.name}
          </a>
        </div>
        {/* <AIcon startPaths={Icons.Search} size={20} aria-label="Search Project Chats" /> */}
      </div>

      <div class="projects-chat-list__options" role="navigation" aria-label="Project Chats Options">
        {/* Options content here */}
      </div>

      <div class="projects-chat-list__chats" role="list" aria-label="Project Chats">
        {project.jobs.length > 0
          ? project.jobs.map((job: Task & { chat: Chat }) => (
              <ChatCard job={job} projectid={project.id} currentChat={chat} />
            ))
          : null}
      </div>
    </div>
  );
}
