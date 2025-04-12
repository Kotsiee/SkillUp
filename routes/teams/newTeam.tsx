import { PageProps } from '$fresh/server.ts';
import { Partial } from '$fresh/runtime.ts';
import NewTeam from '../../islands/Teams/NewTeam.tsx';

export default function Teams(pageProps: PageProps) {
  return (
    <Partial name="teams">
      <NewTeam />
    </Partial>
  );
}
