import { Partial } from '$fresh/runtime.ts';
import { PageProps } from '$fresh/server.ts';
import EditProfile from '../../islands/profile/edit.tsx';

export default function Profile(props: PageProps) {
  return (
    <Partial name="profile">
      <link rel="stylesheet" href="/styles/pages/profile/edit.css" />
      <EditProfile />
    </Partial>
  );
}
