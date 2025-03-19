import { Handlers } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";

const kv = await Deno.openKv();
export const handler: Handlers = {
    async POST(_req, _ctx) {
        const headers = new Headers();
        const key = crypto.randomUUID()
        setCookie(headers, {
          name: "accountsToken",
          value: key,
          secure: true,
          httpOnly: true,
          sameSite: "Strict",
          path: "/",
        });

        await kv.set(["accounts", key], { accounts: [ {id: "this is awesome"} ] } )

        return new Response('{"Hello": "World"}', {
            status: 200,
            headers,
        });
    },

    async GET(req, _ctx) {
        const cookies = getCookies(req.headers)
        const accountsToken = cookies["accountsToken"]

        const accounts = await kv.get(["accounts", accountsToken])
        console.log(accounts.value)

        return new Response(JSON.stringify(accounts.value), {
            headers: {"Content-Type": "application/json" }
        });
    },
};