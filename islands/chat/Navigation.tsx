import { PageProps } from '$fresh/server.ts';
import { useSignal } from '@preact/signals';
import AIcon, { Icons } from '../../components/Icons.tsx';
import { useEffect } from 'preact/hooks';
import { useChat } from '../contexts/ChatProvider.tsx';
import { useUser } from '../contexts/UserProvider.tsx';

export default function ChatNavigation({ pageProps }: { pageProps: PageProps }) {
  const title = useSignal('');
  const extras: string[] = ['chat', 'attachments', 'details'];

  const { chat } = useChat();
  const { user } = useUser();

  if (!user || !chat) return null;

  useEffect(() => {
    title.value = pageProps.route
      .replace('/messages', '')
      .replace('/partials', '')
      .replace('/:chatid', '')
      .split('/')[1];
    console.log(
      pageProps.route
        .replace('/messages', '')
        .replace('/partials', '')
        .replace('/:chatid', '')
        .split('/')
    );
  }, [pageProps.url]);

  return (
    <div class="chat-header" role="region" aria-label="Chat Header">
      <div class="chat-header__container">
        {/* Left Section */}
        <div class="chat-header__left">
          <div class="chat-header__title" role="group" aria-label="Chat Title">
            <img
              class="chat-header__photo"
              src="/assets/images/placeholders/messages.webp"
              alt={`${chat.name} photo`}
              loading="lazy"
            />
            <div class="chat-header__name">
              <h5>{chat.name}</h5>
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
                    href={`/messages/${pageProps.params.chatid}/${page}`}
                    f-partial={`/messages/partials/${pageProps.params.chatid}/${page}`}
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
