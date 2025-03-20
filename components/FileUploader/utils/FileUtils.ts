// deno-lint-ignore-file no-explicit-any
import { identifyFile } from "../../../lib/utils/fileDetector.ts";

export function processFile(
  file: File,
  url: string,
  path: string,
  user: User,
  uploadedFiles: any,
  selectedFiles: any,
  multiple?: boolean,
) {
  const fileType = identifyFile(file);
  const id = crypto.randomUUID();

  const newFile: Files = {
    id,
    user: user.id,
    filePath: path,
    storedName: `${id}.${fileType.extension}`,
    publicName: file.name,
    mimeType: file.type,
    publicURL: url,
    fileType: fileType.category,
    verified: fileType.verified,
    extension: fileType.extension,
    isUpload: true,
    meta: {
      application: fileType.application,
      size: file.size,
    },
  };

  uploadedFiles.value = multiple
    ? [...uploadedFiles.value, newFile]
    : [newFile];
  selectedFiles.value.push(newFile);
}

export async function fetchStorageFiles(fileType?: string) {
  try {
    const response = await fetch(
      `/api/storage/files${
        fileType ? `?types=${fileType.replace(" ", "+")}` : ""
      }`,
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching storage files:", error);
    return null;
  }
}

export async function uploadFile(file: any) {
  const body = new FormData();
  body.set("file", JSON.stringify(file));

  try {
    await fetch("/api/storage/files", {
      method: "POST",
      body: body,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}
