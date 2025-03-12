import { Image } from "https://deno.land/x/imagescript@1.2.15/mod.ts";
import { FreshContext } from '$fresh/server.ts';

export const handler = async (req: Request, ctx: FreshContext): Promise<Response> => {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const height = Number.parseInt(ctx.params.h)
  const width = Number.parseInt(ctx.params.w)

  if (!file) {
    return new Response(JSON.stringify({ error: "No file uploaded" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  const image = await Image.decode(uint8Array);
  image.cover(height || 128, width || 128);

  const encoded = await image.encode();

  return new Response(encoded, {
    status: 200,
    headers: { "Content-Type": "image/png" },
  });
};
