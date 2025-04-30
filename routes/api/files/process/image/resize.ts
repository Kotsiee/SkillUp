import { createCanvas, Image } from 'jsr:@gfx/canvas@0.5.6';
import { FreshContext } from '$fresh/server.ts';

export const handler = async (req: Request, ctx: FreshContext): Promise<Response> => {
  const file = await req.formData();
  const newFile = file.get('url')?.toString() || '';

  const height = Number.parseInt(ctx.url.searchParams.get('h') || '128');
  const width = Number.parseInt(ctx.url.searchParams.get('w') || '128');
  const format =
    (ctx.url.searchParams.get('format') as 'png' | 'jpeg' | 'webp' | undefined) || 'png';

  return new Response(await resizeImage(newFile, width, height, format), {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
};

const resizeImage = async (
  input: string,
  width: number,
  height: number,
  format?: 'png' | 'jpeg' | 'webp'
) => {
  let image = new Image();

  if (input.startsWith('http')) image = await Image.load(input);
  else if (input.startsWith('data:image')) image = new Image(input);

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const dimentions = getCoverFillDimensions(image.width, image.height, width, height);

  ctx.drawImage(image, dimentions.x, dimentions.y, dimentions.width, dimentions.height);

  return canvas.toDataURL(format, 100);
};

function getCoverFillDimensions(
  imageWidth: number,
  imageHeight: number,
  canvasWidth: number,
  canvasHeight: number
) {
  const imageRatio = imageWidth / imageHeight;
  const canvasRatio = canvasWidth / canvasHeight;

  let drawWidth, drawHeight, offsetX, offsetY;

  if (imageRatio > canvasRatio) {
    // Image is wider than canvas: Fit height, crop width
    drawHeight = canvasHeight;
    drawWidth = imageWidth * (canvasHeight / imageHeight);
    offsetX = (canvasWidth - drawWidth) / 2;
    offsetY = 0;
  } else {
    // Image is taller than canvas: Fit width, crop height
    drawWidth = canvasWidth;
    drawHeight = imageHeight * (canvasWidth / imageWidth);
    offsetX = 0;
    offsetY = (canvasHeight - drawHeight) / 2;
  }

  return { x: offsetX, y: offsetY, width: drawWidth, height: drawHeight };
}
