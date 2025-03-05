import { Handlers } from "$fresh/server.ts";
import { fetchMessagesByChat, newMessage } from "../../../../lib/api/messagesApi.ts";
import superjson from "https://esm.sh/superjson@2.2.2";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const chats = await fetchMessagesByChat(ctx.params.chatId)

    return new Response(superjson.stringify(chats), {
      headers: { "Content-Type": "application/json" },
    });
  },
  async POST(req, _ctx) {
    const body = await req.json();
    await newMessage(body)
    return new Response("Message received", { status: 201 });
  }
};
