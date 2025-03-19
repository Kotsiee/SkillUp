export function getBase64FileSize(base64String: string) {
  const base64WithoutPrefix = base64String.split(",")[1] || base64String;
  const padding = (base64WithoutPrefix.match(/=/g) || []).length;
  return (base64WithoutPrefix.length * 3) / 4 - padding;
}

export async function standardizeImage(
  url: string,
  width?: number,
  height?: number,
  format?: "png" | "jpeg" | "webp",
) {
  const formData = new FormData();
  formData.set("url", url);

  let apiURL = "/api/image/process";
  if (width || height || format) {
    apiURL += "?";
    if (width) apiURL += `w=${width}&`;
    if (height) apiURL += `h=${height}&`;
    if (format) apiURL += `format=${format}`;
  }

  const newImage = await fetch(apiURL, { method: "POST", body: formData });
  return await newImage.text();
}
