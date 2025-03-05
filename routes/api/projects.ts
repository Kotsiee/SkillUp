import { Handlers } from "$fresh/server.ts";
import { fetchProjectByID, fetchProjects } from "../../lib/api/projectApi.ts";

export const handler: Handlers = {
    async GET(req, _ctx) {
        const url = new URL(req.url)
        const id = url.searchParams.get("id");

        let projects

        if(id) projects = await fetchProjectByID(id)
        else projects = await fetchProjects(
            url.searchParams.get("q")
        )

        return new Response(JSON.stringify(projects), {
            headers: { "Content-Type": "application/json" },
        });
    },
};