import { Image } from "https://deno.land/x/imagescript@1.2.15/mod.ts";

export const handler = async (req: Request): Promise<Response> => {
  try {
    // 1️⃣ Parse the uploaded file
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const image = await Image.decode(uint8Array);
    image.cover(128, 200);

    const encoded = await image.encode();

    return new Response(encoded, {
      status: 200,
      headers: { "Content-Type": "image/jpeg" },
    });

  } catch (error) {
    console.error("Image processing error:", error);
    return new Response(JSON.stringify({ error: "Failed to process image" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
