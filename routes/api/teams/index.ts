import { Handlers } from '$fresh/server.ts';
import { fetchTeams, newTeam } from '../../../lib/api/teams/teams.ts';
import { getCachedUser } from '../../../lib/utils/cache.ts';

const kv = await Deno.openKv();

export const handler: Handlers = {
  async GET(_req, _ctx) {
    const teams = await fetchTeams();

    return new Response(JSON.stringify(teams), {
      status: 200,
    });
  },

  async POST(req, _ctx) {
    const { user } = await getCachedUser(req, kv);
    if (!user) return new Response(null);

    const team = (await req.formData()).get('team');
    await newTeam(JSON.parse(team as string), user, '');

    return new Response(JSON.stringify({}), {
      status: 200,
    });
  },
};
