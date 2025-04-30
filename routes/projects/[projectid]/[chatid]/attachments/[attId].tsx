//Conversations
import { PageProps } from '$fresh/server.ts';
import { Partial } from '$fresh/runtime.ts';

export default function Conversations(pageProps: PageProps) {
  return (
    <Partial name="projects">
      {/* <link rel="stylesheet" href="/styles/pages/messages/attachment.css" />
            <ChatLayout pageProps={pageProps} type="messages" extras={[["chat", "Chat"], ["attachments", "Attachments"]]}/>
            <div class="chat-messages-container">
                <Attachment pageProps={pageProps}/>
            </div> */}
    </Partial>
  );
}
