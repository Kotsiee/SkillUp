import { Handlers } from "$fresh/server.ts";
import superjson from "https://esm.sh/superjson@2.2.2";
import { fetchFileReferenceById } from "../../../lib/api/files/fileReference.ts";
import { getCachedUser } from "../../../lib/utils/cache.ts";

const kv = await Deno.openKv();

export const handler: Handlers = {
  async GET(req, ctx) {
    const {user} = await getCachedUser(req, kv);

    if (!user) return new Response("Missing userId", { status: 400 });
    const chats = await fetchFileReferenceById(
      user,
      ctx.params.id,
    );

    return new Response(superjson.stringify(chats), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
