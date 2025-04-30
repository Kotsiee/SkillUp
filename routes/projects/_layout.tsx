// projects/_layout

import { PageProps } from '$fresh/server.ts';
import ChatResize from '../../islands/chat/ChatResize.tsx';
import { PageProvider } from '../../islands/contexts/PageProvider.tsx';
import { ProjectProvider } from '../../islands/contexts/ProjectProvider.tsx';
import ProjectsList from '../../islands/projects/ProjectsList.tsx';
import { ChatProvider } from './../../islands/contexts/ChatProvider.tsx';

export default function Layout(pageProps: PageProps) {
  return (
    <PageProvider>
      <ProjectProvider pageProps={pageProps}>
        <ChatProvider pageProps={pageProps}>
          <link rel="stylesheet" href="/styles/pages/projects/projects.css" />
          <pageProps.Component />
        </ChatProvider>
      </ProjectProvider>
    </PageProvider>
  );
}
