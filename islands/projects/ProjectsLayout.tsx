import { PageProps } from "$fresh/server.ts";
import { JSX } from "preact/jsx-runtime";
import ChatResize from "../chat/ChatResize.tsx";
import ProjectsList from "./ProjectsList.tsx";
import { User } from "../../lib/types/index.ts";

export default function ProjectsLayout({pageProps, children, user}: JSX.HTMLAttributes<HTMLDivElement> & {pageProps: PageProps, user: User | null}) {

    return (
        <div class="projects-layout">
            <div class="chat-list">
                <ProjectsList pageProps={pageProps} user={user}/>
            </div>

            <div class="resize-container">
                <ChatResize />
            </div>
            <div class="chatarea">
                {children}
            </div>
        </div>
  );
}