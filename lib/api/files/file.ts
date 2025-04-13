// deno-lint-ignore-file no-explicit-any no-unused-vars
import { DateTime } from 'https://esm.sh/luxon@3.5.0';
import {
  createClient,
  SupabaseClient,
} from 'https://esm.sh/@supabase/supabase-js@2.47.10/dist/module/index.js';
import { Files } from '../../types/index.ts';
import { getSupabaseClient, SupabaseInfo } from '../../supabase/client.ts';

function toFile(data: any): Files {
  return {
    id: data.id,
    user: data.user_id,
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
  };
}

/**
 * Retrieves the public URL of a file stored in getSupabaseClient().
 * @param filePath - Path of the file in storage.
 * @returns The public URL of the file.
 */
export async function getFileUrl(filePath: string): Promise<string | null> {
  const { data } = await getSupabaseClient().storage.from('user_uploads').getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Generates a real-time file URL with a unique timestamp.
 * @param filePath - The relative file path.
 * @returns A cache-busting file URL.
 */
export const getRealFileURL = (filePath: string): string => {
  return `${filePath}?t=${Date.now()}`;
};

/**
 * Fetches all files uploaded by a specific user with optional file type filtering.
 * @param user - User ID.
 * @param fileType - Optional file type filter.
 * @returns A list of user files or null if an error occurs.
 */
export async function fetchFiles(user: string, fileType?: string | null): Promise<Files[] | null> {
  try {
    let query = getSupabaseClient().schema('files').from('files').select('*').eq('user_id', user);
    if (fileType) {
      const mimeFilters = fileType.split(' ').map(type => type.trim());
      query = query.or(
        mimeFilters.map(type => `mime_type.ilike.${type.replace('/*', '/%')}`).join(',')
      );
    }
    const { data, error } = await query;
    if (error) throw error;

    return await Promise.all(
      data.map(async (d: any) => {
        return {
          ...toFile(d),
          publicURL:
            (await getFileUrl(`profile/${user}/${d.file_path}/${d.stored_name}?t=${Date.now()}`)) ||
            undefined,
        };
      })
    );
  } catch (error: any) {
    console.error('fetchFiles: Error fetching files -', error.message);
    return null;
  }
}

/**
 * Fetches a single file by its path and name.
 * @param user - User ID.
 * @param path - File path.
 * @param name - Stored file name.
 * @param simple - If true, excludes the public URL.
 * @returns The file data or null if not found.
 */
export async function fetchFileByPath(
  user: string,
  path: string,
  name: string,
  simple?: boolean
): Promise<Files | null> {
  try {
    const { data, error } = await getSupabaseClient()
      .schema('files')
      .from('files')
      .select('*')
      .eq('user_id', user)
      .eq('file_path', path)
      .eq('stored_name', name)
      .single();

    if (error) throw error;

    return {
      ...toFile(data),
      publicURL: simple
        ? undefined
        : (await getFileUrl(
            `profile/${user}/${data.file_path}/${data.stored_name}?t=${Date.now()}`
          )) || undefined,
    };
  } catch (error: any) {
    if (error.code === 'PGRST116') return null;

    console.error('fetchFileByPath: Error fetching file -', error);
    return null;
  }
}

/**
 * Fetches a single file by its path and name.
 * @param user - User ID.
 * @param id - File ID.
 * @param simple - If true, excludes the public URL.
 * @returns The file data or null if not found.
 */
export async function fetchFileById(
  user: string,
  id: string,
  simple?: boolean
): Promise<Files | null> {
  try {
    const { data, error } = await getSupabaseClient()
      .schema('files')
      .from('files')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;

    return {
      ...toFile(data),
      publicURL: simple
        ? undefined
        : (await getFileUrl(
            `profile/${user}/${data.file_path}/${data.stored_name}?t=${Date.now()}`
          )) || undefined,
    };
  } catch (error: any) {
    console.error('fetchFileById: Error fetching file -', error.message);
    return null;
  }
}

/**
 * Inserts or updates a file record in the database.
 * @param file - The file metadata to insert.
 * @returns The inserted/updated file data.
 */
export async function insertFile(file: Files) {
  try {
    const existingFile = await fetchFileByPath(file.user!, file.filePath!, file.storedName!, true);
    const newFile = {
      user_id: file.user,
      file_path: file.filePath,
      public_name: file.publicName,
      stored_name: file.isUpload ? file.storedName : `${file.id}.${file.extension}`,
      type: file.fileType,
      mime_type: file.mimeType,
      created_at: DateTime.now().toISO(),
      updated_at: DateTime.now().toISO(),
      privacy_level: file.privacyLvl || 'private',
      verified: file.verified,
      extension: file.extension,
      meta: file.meta,
    };

    const { data, error } = existingFile
      ? await getSupabaseClient()
          .schema('files')
          .from('files')
          .update(newFile)
          .eq('id', existingFile.id)
      : await getSupabaseClient().schema('files').from('files').insert(newFile);
    if (error) throw error;
    return newFile;
  } catch (error: any) {
    console.error('insertFile: Error inserting/updating file -', error.message);
    return null;
  }
}

/**
 * Deletes a file from getSupabaseClient() storage.
 * @param filePath - File path to delete.
 * @param getSupabaseClient() - getSupabaseClient() client instance.
 */
export async function deleteFile(filePath: string, getSupabaseClient: SupabaseClient) {
  try {
    const { error } = await getSupabaseClient.storage.from('user_uploads').remove([filePath]);
    if (error) throw error;
    console.log('File deleted successfully:', filePath);
  } catch (error: any) {
    console.error('deleteFile: Error deleting file -', error.message);
  }
}

/**
 * Uploads a file to getSupabaseClient() storage.
 * @param file - The file metadata.
 * @param accessToken - getSupabaseClient() access token.
 * @returns The public URL of the uploaded file.
 */
export async function uploadFile(file: Files, accessToken: string): Promise<string | null> {
  try {
    const newFile = await insertFile(file);
    if (!newFile) return null;

    const supabaseAuth = createClient(new SupabaseInfo(getSupabaseClient()).getUrl(), accessToken);
    if (!file.publicURL) throw new Error('No valid Base64 file data provided.');

    const base64Data = file.publicURL.split(',')[1];
    if (!base64Data) throw new Error('Invalid Base64 format.');

    const byteArray = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    const fileBlob = new Blob([byteArray], { type: newFile.mime_type });
    const filePath = `profile/${newFile.user_id}/${newFile.file_path}/${newFile.stored_name}`;

    await deleteFile(filePath, supabaseAuth);
    const { error } = await supabaseAuth.storage
      .from('user_uploads')
      .upload(filePath, fileBlob, { upsert: true });
    if (error) throw error;

    return filePath;
  } catch (error: any) {
    console.error('uploadFile: Upload error -', error.message);
    return null;
  }
}
