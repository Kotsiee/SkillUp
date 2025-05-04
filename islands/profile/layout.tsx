import { Profile } from '../../lib/newtypes/index.ts';
import { useProfile } from '../contexts/ProfileProvider.tsx';
import { useEffect } from 'preact/hooks';
import { PageProps } from '$fresh/server.ts';
import { useUser } from '../contexts/UserProvider.tsx';

export default function ProfileLayout({ pageProps }: { pageProps: PageProps }) {
  const { profile } = useProfile();
  const { user, team } = useUser();

  if (!profile) return <h1>User Not Found</h1>;

  if (user?.username === profile.profile.handle || team?.handle === profile.profile.handle)
    return (
      <div>
        <ul class="profile-nav">
          <li>
            <a
              href={`/${profile.profile.handle}/view`}
              f-partial={`/${profile.profile.handle}/partial/view`}
            >
              View
            </a>
          </li>
          <li>
            <a
              href={`/${profile.profile.handle}/edit`}
              f-partial={`/${profile.profile.handle}/partial/edit`}
            >
              Edit
            </a>
          </li>
          <li>
            <a
              href={`/${profile.profile.handle}/manage`}
              f-partial={`/${profile.profile.handle}/partial/manage`}
            >
              Manage
            </a>
          </li>
        </ul>
      </div>
    );

  return null;
}
