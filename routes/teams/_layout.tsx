import { PageProps } from "$fresh/server.ts";
export default function Layout(pageProps: PageProps) {

    return (
        <div f-client-nav>
            <link rel="stylesheet" href="/styles/pages/teams/teams.css" />
            <pageProps.Component />
        </div>
  );
}