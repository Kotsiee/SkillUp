import { verify } from "node:crypto";
import { getSupabaseClient, SupabaseInfo } from "../supabase/client.ts";
import { Files, Privacy, User } from "../types/index.ts";
import { DateTime } from "https://esm.sh/luxon@3.5.0";
import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2.47.10/dist/module/index.js";
import { boolean } from "https://esm.sh/@types/webidl-conversions@7.0.3/index.d.ts";

export async function getFileUrl(filePath: string) {
  const { data } = await getSupabaseClient()
    .storage
    .from("user_uploads")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export const getRealFileURL = (filePath: string) => {
  const timestamp = new Date().getTime(); // Unique timestamp
  return `/storage/v1/object/public/${filePath}?t=${timestamp}`;
};

export async function fetchFiles(
  user: User,
  fileType?: string | null,
): Promise<Files[] | null> {
  let mimeFilters: string[] = [];

  if (fileType) {
    mimeFilters = fileType.split(" ").map((type) => type.trim());
  }

  // Start building query
  let query = getSupabaseClient().from("files").select("*").eq(
    "user_id",
    user.id,
  );

  if (mimeFilters.length > 0) {
    query = query.or(
      mimeFilters
        .map((type) =>
          type.endsWith("/*")
            ? `mime_type.ilike.${type.replace("/*", "/%")}`
            : `mime_type.eq.${type}`
        )
        .join(","),
    );
  }

  const { data, error } = await query;

  if (error) {
    console.log("fetchFiles: error was found :( - " + error.cause);
    return null;
  }

  const files: Files[] = await Promise.all(
    data.map(async (d) => {

      const timestamp = new Date().getTime();

      return {
        id: d.id,
        user: user,
        filePath: d.file_path,
        storedName: d.stored_name,
        publicName: d.public_name,
        fileType: d.type,
        mimeType: d.mime_type,
        verified: d.verified,
        privacyLvl: d.privacy_level,
        meta: d.meta,
        extension: d.extension,
        createdAt: d.created_at,
        publicURL: await getFileUrl(`profile/${user.id}/${d.file_path}/${d.stored_name}?t=${timestamp}`),
      };
    }),
  );

  return files;
}

export async function fetchFileByPath(user: User, path: string, name: string, simple?: boolean): Promise<Files | null> {
  console.log(user.id, path, name)

  let query = getSupabaseClient()
  .from("files")
  .select("*")
  .eq("user_id", user.id)
  .eq("file_path", path)
  .eq("stored_name", name)
  .single();

  const { data, error } = await query;

  if (error) {
    console.log("fetchFileByPath: error was found :( - " + error.message);
    return null;
  }
  const timestamp = new Date().getTime();

  const files: Files = {
    id: data.id,
    user: user,
    filePath: data.file_path,
    storedName: data.stored_name,
    publicName: data.public_name,
    fileType: data.type,
    mimeType: data.mime_type,
    verified: data.verified,
    privacyLvl: data.privacy_level,
    meta: data.meta,
    extension: data.extension,
    createdAt: data.created_at,

  }

  if (!simple)
    files.publicURL = await getFileUrl(`profile/${user.id}/${data.file_path}/${data.stored_name}?t=${timestamp}`)

  return files;
}

export async function insertFile(file: Files) {
  const exists = (await fetchFileByPath(file.user as User, file.filePath!, file.storedName!, true))

  if (exists){
    console.log("exists")
    const newFile = {
      user_id: exists.user?.id,
      file_path: exists.filePath,
      public_name: file.publicName,
      stored_name: exists.storedName,
      type: file.fileType,
      mime_type: file.mimeType,
      created_at: DateTime.now(),
      updated_at: DateTime.now(),
      verified: file.verified,
      extension: file.extension,
      meta: {
        size: file.meta?.size,
        application: file.meta?.application,
      },
    };

    const { data, error } = await getSupabaseClient()
    .from("files")
    .update([
      newFile,
    ])
    .eq("id", exists.id);

    if (error) {
      console.log("insertFile: error was found :( - " + error.message);
      return null;
    }
  
    return newFile;
  }

  console.log("does not exists")

  const uuid = file.id;

  const newFile = {
    id: uuid,
    user_id: file.user?.id,
    file_path: file.filePath,
    public_name: file.publicName,
    stored_name: file.isUpload ? file.storedName : `${uuid}.${file.extension}`,
    type: file.fileType,
    mime_type: file.mimeType,
    created_at: DateTime.now(),
    updated_at: DateTime.now(),
    privacy_level: file.privacyLvl || "private",
    verified: file.verified,
    extension: file.extension,
    meta: {
      size: file.meta?.size,
      application: file.meta?.application,
    },
  };

  const { data, error } = await getSupabaseClient().from("files").insert([
    newFile,
  ]);

  if (error) {
    console.log("insertFile: error was found :( - " + error.message);
    return null;
  }

  return newFile;
}

export const deleteFile = async (
  filePath: string,
  supabase: SupabaseClient<any, "public", any>,
) => {
  const { error } = await supabase.storage.from("user_uploads")
    .remove([filePath]);

  if (error) {
    console.error("Error deleting file:", error.message);
  } else {
    console.log("File deleted successfully:", filePath);
  }
};

export const uploadFile = async (file: Files, accessToken: string) => {
  const newFile = await insertFile(file);
  if (!newFile) return;

  const supabase = new SupabaseInfo(getSupabaseClient());
  const supabaseAuth = createClient(supabase.getUrl(), accessToken);

  if (!file.publicURL) {
    console.error("No valid Base64 file data provided.");
    return;
  }

  const base64Data = file.publicURL.split(",")[1];
  if (!base64Data) {
    console.error("Invalid Base64 format.");
    return;
  }

  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const fileBlob = new Blob([byteArray], { type: newFile.mime_type });

  const filePath =
    `profile/${newFile.user_id}/${newFile.file_path}/${newFile.stored_name}`;

  await deleteFile(filePath, supabaseAuth);

  const { data, error } = await supabaseAuth.storage
    .from("user_uploads")
    .upload(filePath, fileBlob, {
      contentType: newFile.mime_type,
      upsert: true,
    });

  if (error) {
    console.error("Upload error:", error.message);
    return;
  }

  return getRealFileURL(filePath);
};
