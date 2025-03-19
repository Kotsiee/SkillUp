import { Handlers } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { User } from "../../../lib/types/index.ts";

const kv = await Deno.openKv();

export const handler: Handlers = {
  async GET(req, ctx) {
    const cookies = getCookies(req.headers);
    const refreshToken = cookies["refreshToken"];

    if (!refreshToken) return new Response("Missing userId", { status: 400 });

    const users = await kv.get(["user", refreshToken]);
    if (!users.value) return new Response("User not found", { status: 404 });

    const user = ((users.value as any).user as User)
    const smallPic = new URL(user.profilePicture?.small?.publicURL as string)
    const mediumPic = new URL(user.profilePicture?.med?.publicURL as string)
    const largePic = new URL(user.profilePicture?.large?.publicURL as string)

    user.profilePicture!.small!.publicURL = `${smallPic.origin}${smallPic.pathname}?t=${Date.now()}`
    user.profilePicture!.med!.publicURL = `${mediumPic.origin}${mediumPic.pathname}?t=${Date.now()}`
    user.profilePicture!.large!.publicURL = `${largePic.origin}${largePic.pathname}?t=${Date.now()}`

    await kv.set(["user", refreshToken], { user });

    return new Response(JSON.stringify(user), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  },
};
