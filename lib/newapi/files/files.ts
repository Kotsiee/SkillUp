// lib/api/files.ts

import { Files, normalizeFile } from '../../newtypes/index.ts';
import { getSupabaseClient } from '../../supabase/client.ts';
import { uploadFileToBucket } from '../storage/storage.ts';

/**
 * Fetch file by its ID.
 * @param fileId - UUID of the file.
 * @param accessToken - Supabase access token.
 */
export async function fetchFileById(fileId: string, accessToken: string): Promise<Files> {
  const supabase = getSupabaseClient(accessToken).schema('files');

  const { data, error } = await supabase.from('files').select('*').eq('id', fileId).single();
  if (error) throw new Error(error.message);

  const uploaderId = data.uploader_id;
  const recipientId = data.recipient_id;
  const basePathId = recipientId || uploaderId;
  const basePath = `profile/${basePathId}/${data.file_path}/${data.stored_name}`;

  const publicURL = await getFileUrl('user_uploads', basePath, accessToken);
  return normalizeFile({ ...data, publicURL });
}

/**
 * Fetch all files uploaded by a specific user.
 * @param userId - UUID of the user.
 * @param accessToken - Supabase access token.
 */
export async function fetchFilesByUserId(userId: string, accessToken: string): Promise<Files[]> {
  const supabase = getSupabaseClient(accessToken).schema('files');

  const { data, error } = await supabase.from('files').select('*').eq('uploader_id', userId);

  if (error) throw new Error('fetchFilesByUserId - ' + error.message);

  if (!data || data.length === 0) return [];

  const files = await Promise.all(
    data.map(async (rawFile: any) => {
      const uploaderId = rawFile.uploader_id;
      const recipientId = rawFile.recipient_id;
      const basePathId = recipientId || uploaderId;
      const basePath = `profile/${basePathId}/${rawFile.file_path}/${rawFile.stored_name}`;

      const publicURL = await getFileUrl('user_uploads', basePath, accessToken);

      return normalizeFile({
        ...rawFile,
        publicURL,
      });
    })
  );

  return files;
}

/**
 * Fetch a file by its full storage path.
 * @param filePath - Path within the bucket.
 * @param accessToken - Supabase access token.
 */
export async function fetchFileByPath(
  entityId: string,
  filePath: string,
  fileName: string,
  accessToken?: string
): Promise<Files | null> {
  const supabase = getSupabaseClient(accessToken).schema('files');

  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('file_path', filePath)
    .eq('stored_name', fileName)
    .or(`uploader_id.eq.${entityId},recipient_id.eq.${entityId}`)
    .single();

  if (error?.code.includes('PGRST116')) return null;
  if (error) throw new Error(error.code);
  const uploaderId = data.uploader_id;
  const recipientId = data.recipient_id;
  const basePathId = recipientId || uploaderId;
  const basePath = `profile/${basePathId}/${data.file_path}/${data.stored_name}`;

  const publicURL = await getFileUrl('user_uploads', basePath, accessToken);
  return normalizeFile({ ...data, publicURL });
}

/**
 * Generate a public or signed URL for a file.
 * @param bucket - Name of the Supabase bucket.
 * @param path - File path in bucket.
 * @param accessToken - Optional access token for private URLs.
 */
export async function getFileUrl(
  bucket: string,
  path: string,
  accessToken?: string
): Promise<string | null> {
  const supabase = getSupabaseClient(accessToken);
  const storage = supabase.storage.from(bucket);

  const { data } = await storage.getPublicUrl(path);
  return `${data.publicUrl}?t=${Date.now()}`;
}

/**
 * Insert a new file record in DB. Assumes upload already done to bucket.
 * @param file - File object (minus `id`).
 * @param accessToken - Supabase access token.
 */
export async function insertFile(
  bucket: string,
  file: Omit<Files, 'id'>,
  accessToken: string
): Promise<Files> {
  const supabase = getSupabaseClient(accessToken).schema('files');

  const { data, error } = await supabase
    .from('files')
    .insert({
      uploader_id: file.user,
      file_path: file.filePath,
      stored_name: file.storedName,
      public_name: file.publicName,
      file_type: file.fileType,
      mime_type: file.mimeType,
      verified: file.verified ?? false,
      privacy: file.privacy,
      meta: file.meta,
      extension: file.extension,
      recipient_id: file.recipient ?? null,
    })
    .select()
    .single();

  const storedPath = await uploadFileToBucket(bucket, file, accessToken);

  console.log(storedPath);

  if (error) throw new Error(error.message);
  return normalizeFile(data);
}

/**
 * Update metadata on a file record.
 * @param fileId - UUID of file.
 * @param updates - Partial file fields.
 * @param accessToken - Supabase access token.
 */
export async function updateFile(
  fileId: string,
  updates: Partial<Omit<Files, 'id' | 'createdAt' | 'publicURL'>>,
  accessToken: string
): Promise<Files> {
  const supabase = getSupabaseClient(accessToken).schema('files');

  const updatePayload = {
    ...updates,
  };

  const { data, error } = await supabase
    .from('files')
    .update(updatePayload)
    .eq('id', fileId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return normalizeFile(data);
}

/**
 * Delete a file (DB + optionally from storage bucket).
 * @param fileId - UUID of the file.
 * @param bucket - Bucket to delete from.
 * @param path - Path of file in bucket.
 * @param accessToken - Supabase access token.
 */
export async function deleteFile(
  fileId: string,
  bucket: string,
  path: string,
  accessToken: string
): Promise<boolean> {
  const supabase = getSupabaseClient(accessToken);

  // Step 1: delete from DB
  const dbDelete = await supabase.schema('files').from('files').delete().eq('id', fileId);
  if (dbDelete.error) throw new Error(dbDelete.error.message);

  // Step 2: delete from bucket
  const storageDelete = await supabase.storage.from(bucket).remove([path]);
  if (storageDelete.error) throw new Error(storageDelete.error.message);

  return true;
}
