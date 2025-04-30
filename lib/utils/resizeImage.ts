// lib/resizeImageBase64.ts

/**
 * Resizes a base64 image to the given width/height and outputs it in WebP format.
 * @param base64 - base64-encoded image string
 * @param width - desired width
 * @param height - desired height
 * @returns a Promise that resolves to the resized base64 string in WebP format
 */
export default async function resizeImageBase64(
  base64: string,
  width: number,
  height: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Create canvas with desired size
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) return reject(new Error('Canvas context not available'));

      // Calculate dimensions for center-cropping (cover-style)
      const imageRatio = img.width / img.height;
      const canvasRatio = width / height;
      let drawWidth = width,
        drawHeight = height,
        offsetX = 0,
        offsetY = 0;

      if (imageRatio > canvasRatio) {
        drawHeight = height;
        drawWidth = img.width * (height / img.height);
        offsetX = (width - drawWidth) / 2;
      } else {
        drawWidth = width;
        drawHeight = img.height * (width / img.width);
        offsetY = (height - drawHeight) / 2;
      }

      // Draw cropped image to canvas
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      // Export to WebP
      const resizedBase64 = canvas.toDataURL('image/webp', 1.0);
      resolve(resizedBase64);
    };

    img.onerror = e => reject(new Error('Failed to load image'));
    img.src = base64;
  });
}
