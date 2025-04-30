import { PageProps } from '$fresh/server.ts';
export default function Layout(pageProps: PageProps) {
  return (
    <div f-client-nav>
      <pageProps.Component />
    </div>
  );
}
