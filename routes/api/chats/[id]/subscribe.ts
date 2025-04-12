import { Handlers } from "$fresh/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.10/dist/module/index.js";

export const handler: Handlers = {
  async GET(req, _ctx) {
    const headers = new Headers({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*", // Ensure CORS allows requests
    });

    // Get Supabase credentials from environment variables
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const stream = new ReadableStream({
      start(controller) {
        console.log("SSE Connection Started...");
    
        const channel = supabase
          .channel("messages")
          .on(
            "postgres_changes",
            { event: "*", schema: "messages", table: "messages" },
            (payload) => {
              console.log("🔔 New Message:", payload);
              const data = `data: ${JSON.stringify(payload)}\n\n`;
              controller.enqueue(new TextEncoder().encode(data));
            },
          )
          .subscribe();
    
        req.signal.addEventListener("abort", () => {
          console.log("SSE Connection Closed...");
          channel.unsubscribe();
          controller.close();
        });
      },
    });    

    return new Response(stream, { headers });
  },
};