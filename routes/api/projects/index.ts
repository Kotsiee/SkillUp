import { Handlers } from "$fresh/server.ts";
import superjson from "https://esm.sh/superjson@2.2.2";
import { fetchProjectRoleByUser } from "../../../lib/api/projectRolesApi.ts";

export const handler: Handlers = {
    async GET(req, _ctx) {
        const cookies = req.headers.get("cookie") || "";
        const userID = cookies.match(/user=([^;]+)/)?.[1] || null;

        if (!userID)
        return new Response(null);

        const chats = await fetchProjectRoleByUser(userID)

        return new Response(superjson.stringify(chats), {
            headers: { "Content-Type": "application/json" },
        });
    },
};