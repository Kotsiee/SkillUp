import { FreshContext } from '$fresh/server.ts';

export const handler = async (req: Request, _ctx: FreshContext) => {
  const url = new URL(req.url);
  const imageUrl = url.searchParams.get('url');

  if (!imageUrl) {
    return new Response('Missing image URL', { status: 400 });
  }

  try {
    // Fetch the external image
    const response = await fetch(imageUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    if (!response.ok) {
      return new Response('Failed to fetch image', { status: response.status });
    }

    // Return the image with CORS headers
    const headers = new Headers(response.headers);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Content-Type', response.headers.get('Content-Type') || 'image/png');

    return new Response(response.body, { status: 200, headers });
  } catch (error) {
    return new Response('Error fetching image', { status: 500 });
  }
};
