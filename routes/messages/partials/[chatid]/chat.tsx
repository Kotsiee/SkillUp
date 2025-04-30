//Conversations
import { PageProps } from '$fresh/server.ts';
import { Partial } from '$fresh/runtime.ts';
import ChatNavigation from '../../../../islands/chat/Navigation.tsx';
import ChatMessages from '../../../../islands/chat/messages/ChatMessages.tsx';

export default function Conversations(pageProps: PageProps) {
  return (
    <Partial name="messages">
      <link rel="stylesheet" href="/styles/pages/messages/chat.css" />
      <ChatNavigation pageProps={pageProps} />
      <ChatMessages pageProps={pageProps} />
    </Partial>
  );
}
