import { PageProps } from "$fresh/server.ts";
import { JSX } from "preact/jsx-runtime";
import ChatResize from "../chat/ChatResize.tsx";
import ProjectsList from "./ProjectsList.tsx";
import { useUser } from "../contexts/UserProvider.tsx";
import ChatLayout from "../chat/ChatLayout.tsx";

export default function ProjectsLayout(
  { pageProps, children }: JSX.HTMLAttributes<HTMLDivElement> & {
    pageProps: PageProps;
  },
) {
  const { user } = useUser();

  return (
    <div class="projects-layout">
      <div class="chat-list">
        <ProjectsList pageProps={pageProps} user={user} />
      </div>

      <div class="resize-container">
        <ChatResize />
      </div>
      <div class="chatarea">
        <ChatLayout
          pageProps={pageProps}
          type="projects"
        />
        {children}
      </div>
    </div>
  );
}
