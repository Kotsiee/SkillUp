import { Handlers } from '$fresh/server.ts';
import { newProjectRole } from '../../../../lib/api/projects/projects.ts';
import { getCachedUser } from '../../../../lib/utils/cache.ts';

const kv = await Deno.openKv();

export const handler: Handlers = {
  async POST(req, ctx) {
    const { user } = await getCachedUser(req, kv);
    if (!user) return new Response(null);

    console.log(user);

    await newProjectRole(
      {
        project: { id: ctx.params.id },
        // deno-lint-ignore no-explicit-any
        user: { id: user } as any,
      },
      ''
    );

    return new Response(JSON.stringify({}), {
      status: 200,
    });
  },
};
