import { Chat, Task } from '../../../lib/newtypes/index.ts';

export function ChatCard({
  job,
  projectid,
  currentChat,
}: {
  job: Task & { chat: Chat };
  projectid: string;
  currentChat: Chat;
}) {
  return (
    <a
      class={`project-chat-card ${currentChat && currentChat.id === job.chat.id ? '--active' : ''}`}
      href={`/projects/${projectid}/${job.chat.id}/chat`}
      f-partial={`/projects/partials/${projectid}/${job.chat.id}/chat`}
      aria-label={`Open project chat ${job.chat.name}`}
    >
      <div class="project-chat-card__container">
        <p class="project-chat-card__name">
          <span
            class="project-chat-card__name-icon"
            dangerouslySetInnerHTML={{ __html: job.meta?.icon ?? '#' }}
          />
          {job.chat.name}
        </p>
      </div>
    </a>
  );
}
