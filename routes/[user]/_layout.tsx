import { PageProps } from '$fresh/server.ts';
import { ProfileProvider } from '../../islands/contexts/ProfileProvider.tsx';
import ProfileLayout from '../../islands/profile/layout.tsx';

export default function Layout(pageProps: PageProps) {
  return (
    <ProfileProvider pageProps={pageProps}>
      <div class="profile-layout">
        <link rel="stylesheet" href="/styles/pages/profile/profile.css" />
        <ProfileLayout pageProps={pageProps} />
        <pageProps.Component />
      </div>
    </ProfileProvider>
  );
}
