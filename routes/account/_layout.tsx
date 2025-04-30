import { PageProps } from '$fresh/server.ts';

export default function Layout(pageProps: PageProps) {
  return (
    <div class="loginLayout" f-client-nav>
      <link rel="stylesheet" href="/styles/pages/login/layout.css" />
      <div class="background"></div>
      <pageProps.Component />
    </div>
  );
}
