import { Handlers } from "$fresh/server.ts";
import { getCookie, signInWithEmail } from "../../../lib/api/loginApi.ts";

export const handler: Handlers = {
    async POST(req, ctx) {
        const formData = await req.formData();
        const user = await signInWithEmail(formData);
        return user;
    }
};