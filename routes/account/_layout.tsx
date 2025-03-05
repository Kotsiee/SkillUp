import { PageProps } from "$fresh/server.ts";

export default function Layout(pageProps: PageProps) {

  return (
    <div class="loginLayout">
      <link rel="stylesheet" href="/styles/pages/login/layout.css" />
      <img class="background" src="https://images.unsplash.com/photo-1740475339769-664748d1193e?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"/>
      <pageProps.Component />
    </div>
  );
}