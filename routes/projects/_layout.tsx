import { PageProps } from "$fresh/server.ts";
export default function Layout(pageProps: PageProps) {

    return (
        <div class="projectss-layout" f-client-nav>
            <link rel="stylesheet" href="/styles/pages/projects/projects.css" />
            <pageProps.Component />
        </div>
  );
}