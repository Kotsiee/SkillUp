// deno-lint-ignore-file no-explicit-any
import { Handlers } from '$fresh/server.ts';
import { getCookies } from '$std/http/cookie.ts';

const kv = await Deno.openKv();

export const handler: Handlers = {
  async POST(req, _ctx) {
    const cookies = getCookies(req.headers);
    const session = cookies['session'];
    const sessionData = (await kv.get(['sessions', session])).value as any;

    kv.set(['sessions', session], { ...sessionData, activeTeam: undefined });

    return new Response(
      JSON.stringify({ message: 'Login successful', activeTeam: 'undefined hehe' }),
      {
        status: 200,
      }
    );
  },
};
