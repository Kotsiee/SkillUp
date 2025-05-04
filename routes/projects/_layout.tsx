// projects/_layout

import { PageProps } from '$fresh/server.ts';
import { ProjectProvider } from '../../islands/contexts/ProjectProvider.tsx';
import { ChatProvider } from './../../islands/contexts/ChatProvider.tsx';

export default function Layout(pageProps: PageProps) {
  return (
    <ProjectProvider pageProps={pageProps}>
      <ChatProvider pageProps={pageProps}>
        <link rel="stylesheet" href="/styles/pages/projects/projects.css" />
        <pageProps.Component />
      </ChatProvider>
    </ProjectProvider>
  );
}
