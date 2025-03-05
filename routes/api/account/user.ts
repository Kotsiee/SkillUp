import { Handlers } from "$fresh/server.ts";
import { getUser } from "../../../lib/api/loginApi.ts";
import { fetchUserByID } from "../../../lib/api/userApi.ts";

export const handler: Handlers = {
    async GET(req, ctx) {
        const user = await getUser(req)
        if (!user) return new Response("Unauthorised", { status: 401 });
        const user0 = await fetchUserByID(user.user.id)
        if (!user0) return new Response("Unauthorised", { status: 401 });

        return new Response(JSON.stringify(user0), {
            headers: { "Content-Type": "application/json" },
            status: 200
        });
    }
};