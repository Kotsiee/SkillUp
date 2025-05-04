import { Handlers, PageProps } from '$fresh/server.ts';
import ProfilePage from '../../islands/profile/view.tsx';
import { Partial } from '$fresh/runtime.ts';
import { fetchProfile } from '../../lib/newapi/profile.ts';

export default function Profile({ pageProps }: { pageProps: PageProps }) {
  return (
    <Partial name="profile">
      <link rel="stylesheet" href="/styles/pages/profile/view.css" />
      <ProfilePage />
    </Partial>
  );
}
