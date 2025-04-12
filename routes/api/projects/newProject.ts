import { Handlers } from '$fresh/server.ts';
import { newProject } from '../../../lib/api/projects/projects.ts';
import { getCachedUser } from '../../../lib/utils/cache.ts';

const kv = await Deno.openKv();

export const handler: Handlers = {
  async POST(req, _ctx) {
    const { user } = await getCachedUser(req, kv);
    if (!user) return new Response(null);

    const project = (await req.formData()).get('project');
    await newProject(JSON.parse(project as string), '');

    return new Response(JSON.stringify({}), {
      status: 200,
    });
  },
};
