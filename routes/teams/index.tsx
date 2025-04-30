import { PageProps } from '$fresh/server.ts';
import { Partial } from '$fresh/runtime.ts';
import TeamsIsland from '../../islands/Teams/Teams.tsx';

export default function TeamsPage(pageProps: PageProps) {
  return (
    <Partial name="teams">
      <link rel="stylesheet" href="/styles/pages/teams/teams.css" />
      <TeamsIsland />
    </Partial>
  );
}
