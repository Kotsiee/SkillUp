import { PageProps } from '$fresh/server.ts';
import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import AIcon, { Icons } from '../../../components/Icons.tsx';
// import { useProject } from '../../contexts/ProjectProvider.tsx';
import { useChat } from '../../contexts/ChatProvider.tsx';
import { useUser } from '../../contexts/UserProvider.tsx';
import { useProject } from '../../contexts/ProjectProvider.tsx';
import { Project } from '../../../lib/newtypes/index.ts';

export default function ProjectNavigation({ pageProps }: { pageProps: PageProps }) {
  const title = useSignal('');
  const extras: string[] = ['chat', 'submissions', 'attachments', 'details'];

  useEffect(() => {
    title.value = pageProps.route
      .replace('/projects', '')
      .replace('/partials', '')
      .replace('/:projectid', '')
      .replace('/:chatid', '')
      .split('/')[1];
  }, [pageProps.params]);

  const { project } = useProject();
  const { chat } = useChat();
  const { user } = useUser();

  if (!user || !chat || !project) return null;

  return (
    <div class="chat-header" role="region" aria-label="Chat Header">
      <div class="chat-header__container">
        {/* Left Section */}
        <div class="chat-header__left">
          <div class="chat-header__title" role="group" aria-label="Chat Title">
            <div class="chat-header__name">
              <h5 class="chat-header__name-text">
                <span
                  class="chat-header__name-icon"
                  dangerouslySetInnerHTML={{
                    __html:
                      (project as Project).jobs?.find(job => job.chat.id === chat.id)?.meta?.icon ??
                      '#',
                  }}
                />
                {chat.name}
              </h5>
            </div>
          </div>
        </div>

        {/* Center Section */}
        <div class="chat-header__center" role="navigation" aria-label="View Selector">
          <div class="chat-header__select-view">
            <p class="chat-header__current-view">{title.value}</p>

            <div class="chat-header__lines-container">
              <div class="chat-header__lines">
                {extras.map(page => (
                  <a
                    class={`chat-header__select-view-input ${
                      title.value.toLowerCase() === page ? 'active' : ''
                    }`}
                    href={`/projects/${pageProps.params.projectid}/${pageProps.params.chatid}/${page}`}
                    f-partial={`/projects/partials/${pageProps.params.projectid}/${pageProps.params.chatid}/${page}`}
                    aria-label={`Switch to ${page} view`}
                  ></a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div class="chat-header__right" role="group" aria-label="Menu">
          <AIcon
            className="chat-header__menu-icon"
            startPaths={Icons.DotMenu}
            size={20}
            aria-label="Open chat menu"
          />
        </div>
      </div>
    </div>
  );
}
