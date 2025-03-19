import { Handlers } from "$fresh/server.ts";
import superjson from "https://esm.sh/superjson@2.2.2";
import {
  fetchFileReferenceById,
} from "../../../lib/api/filesApi.ts";
import { getCookies } from "$std/http/cookie.ts";

const kv = await Deno.openKv();

export const handler: Handlers = {
  async GET(req, ctx) {
    const cookies = getCookies(req.headers);
    const refreshToken = cookies["refreshToken"];

    if (!refreshToken) return new Response("Missing userId", { status: 400 });
    const user = await kv.get(["user", refreshToken]);
    const chats = await fetchFileReferenceById(
      (user.value as any).user.id,
      ctx.params.attId,
    );

    return new Response(superjson.stringify(chats), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
