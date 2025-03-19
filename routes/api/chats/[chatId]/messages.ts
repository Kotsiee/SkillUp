// deno-lint-ignore-file no-explicit-any
import { Handlers } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import {
  fetchMessagesByChat,
  newMessage,
} from "../../../../lib/api/messagesApi.ts";
import superjson from "https://esm.sh/superjson@2.2.2";

const kv = await Deno.openKv();

export const handler: Handlers = {
  async GET(_req, ctx) {
    const hasAttachment = ctx.url.searchParams
    const chats = await fetchMessagesByChat(ctx.params.chatId, !!hasAttachment.get("hasAttachments"));

    return new Response(superjson.stringify(chats), {
      headers: { "Content-Type": "application/json" },
    });
  },
  async POST(req, _ctx) {
    const cookies = getCookies(req.headers);
    const refreshToken = cookies["refreshToken"];

    if (!refreshToken) return new Response("Missing userId", { status: 400 });
    const user = await kv.get(["user", refreshToken]);

    const body = await req.json();
    const newMsg = await newMessage(body, (user.value as any).session.accessToken);
    return new Response(JSON.stringify(newMsg), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  },
};
