import { PageProps } from "$fresh/server.ts";

export default function Layout(pageProps: PageProps) {
    const currentRoute = pageProps.route.split("/explore");

    return (
        <div class="explore-layout">
            <link rel="stylesheet" href="/styles/pages/explore/explore.css" />
            <div class="explore-select">
                <ul>
                    <li class={`${(currentRoute[1] == "" ? "active" : "")} nav-btn-explore`}>
                        <a href="/explore">Home</a>
                    </li>
                    <li class={`${(currentRoute[1] == "/projects" ? "active" : "")} nav-btn-explore`}>
                        <a href="/explore/projects">Projects</a>
                    </li>
                    <li class={`${(currentRoute[1] == "/people" ? "active" : "")} nav-btn-explore`}>
                        <a href="/explore/people">People</a>
                    </li>
                    <li class={`${(currentRoute[1] == "/posts" ? "active" : "")} nav-btn-explore`}>
                        <a href="/explore/posts">Posts</a>
                    </li>
                </ul>
            </div>

            <div class="explore-content">
                <pageProps.Component />
            </div>            
        </div>
    );
}