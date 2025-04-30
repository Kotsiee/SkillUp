import { FreshContext } from '$fresh/server.ts';

export const handler = async (req: Request, _ctx: FreshContext) => {
  const url = new URL(req.url);
  const fileUrl = url.searchParams.get('url');

  if (!fileUrl) {
    return new Response('Missing file URL', { status: 400 });
  }

  try {
    const res = await fetch(fileUrl);
    if (!res.ok) {
      console.error('Fetch failed:', res.status, await res.text());
      return new Response('Failed to fetch file', { status: 500 });
    }

    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get('Content-Type') ?? 'application/octet-stream';
    const base64 = arrayBufferToBase64(buffer);

    const dataUrl = `data:${contentType};base64,${base64}`;

    return new Response(dataUrl, {
      headers: { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    console.error('Error at /tobase64', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};

// Helper for large files
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}
