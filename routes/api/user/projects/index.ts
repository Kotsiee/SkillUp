import { Handlers } from "$fresh/server.ts";
import superjson from "https://esm.sh/superjson@2.2.2";
import { fetchProjectRoleByUser } from "../../../../lib/api/projects/projectMembers.ts";
import { getCachedUser } from "../../../../lib/utils/cache.ts";

const kv = await Deno.openKv();

export const handler: Handlers = {
  async GET(req, _ctx) {
    const {user} = await getCachedUser(req, kv);
    if (!user) return new Response("Missing userId", { status: 400 });

    if (!user) {
      return new Response(null);
    }

    const chats = await fetchProjectRoleByUser(user);

    return new Response(superjson.stringify(chats), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
