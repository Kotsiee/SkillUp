import { PageProps } from '$fresh/server.ts';
import { ProjectsList } from '../../components/pages/projects/ProjectsList.tsx';
import { ChatList } from '../../components/pages/projects/ChatList.tsx';
import { useEffect } from 'preact/hooks';
import { ComponentChildren } from 'preact/src/index.d.ts';
import ChatResize from '../chat/ChatResize.tsx';

export default function ProjectList({
  pageProps,
  children,
}: {
  pageProps: PageProps;
  children: ComponentChildren;
}) {
  useEffect(() => {}, [pageProps.params]);

  return (
    <div class="chat-layout" f-client-nav>
      <div class="chat-layout__panel chat-layout__panel--left">
        {pageProps.params.projectid ? (
          <ChatList pageProps={pageProps} />
        ) : (
          <ProjectsList pageProps={pageProps} />
        )}
      </div>

      <ChatResize />

      <div class="chat-layout__panel chat-layout__panel--right">{children}</div>
    </div>
  );
}
