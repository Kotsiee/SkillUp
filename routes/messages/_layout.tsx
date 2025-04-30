import { PageProps } from '$fresh/server.ts';
import ChatList from '../../islands/chat/ChatList.tsx';
import ChatResize from '../../islands/chat/ChatResize.tsx';
import { ChatProvider } from '../../islands/contexts/ChatProvider.tsx';

export default function Layout(pageProps: PageProps) {
  return (
    <ChatProvider pageProps={pageProps}>
      <link rel="stylesheet" href="/styles/pages/messages/messages.css" />
      <div class="chat-layout" f-client-nav>
        <div class="chat-layout__panel chat-layout__panel--left">
          <ChatList />
        </div>

        <ChatResize />

        <div class="chat-layout__panel chat-layout__panel--right">
          <pageProps.Component />
        </div>
      </div>
    </ChatProvider>
  );
}
