import { PageProps } from '$fresh/server.ts';
import ProfilePage from '../../islands/profile/view.tsx';
import { Partial } from '$fresh/runtime.ts';

export default function Profile() {
  return (
    <Partial name="profile">
      <link rel="stylesheet" href="/styles/pages/profile/view.css" />
      <ProfilePage />
    </Partial>
  );
}
