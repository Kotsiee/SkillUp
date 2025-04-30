//Conversations
import { PageProps } from '$fresh/server.ts';
import { Partial } from '$fresh/runtime.ts';
import ChatNavigation from '../../../../../islands/chat/Navigation.tsx';
import Attachments from '../../../../../islands/chat/attachments/Attachments.tsx';

export default function AttachmentsPage(pageProps: PageProps) {
  return (
    <Partial name="messages">
      <link rel="stylesheet" href="/styles/pages/messages/attachments.css" />
      <ChatNavigation pageProps={pageProps} />
      <Attachments pageProps={pageProps} />
    </Partial>
  );
}
