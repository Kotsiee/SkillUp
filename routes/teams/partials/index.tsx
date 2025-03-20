import { PageProps } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import TeamsIsland from "../../../islands/Teams/Teams.tsx";

export default function Teams(pageProps: PageProps) {
  return (
    <Partial name="teams">
        <TeamsIsland/>
    </Partial>
  );
}