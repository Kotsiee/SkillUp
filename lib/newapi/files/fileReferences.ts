// lib/api/fileReferences.ts

import { FileReference, normalizeFileReference } from '../../newtypes/index.ts';
import { getSupabaseClient } from '../../supabase/client.ts';

/**
 * Fetch a file reference by ID.
 * @param id - File reference ID.
 * @param accessToken - Supabase access token.
 */
export async function fetchFileReferenceById(
  id: string,
  accessToken: string
): Promise<FileReference> {
  const supabase = getSupabaseClient(accessToken).schema('files');

  const { data, error } = await supabase
    .from('file_references')
    .select('*, file:files(*)')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return normalizeFileReference(data);
}

/**
 * Search file references by user.
 * @param userId - User ID.
 * @param accessToken - Supabase access token.
 */
export async function searchFileReferencesByUserId(
  userId: string,
  accessToken: string
): Promise<FileReference[]> {
  const supabase = getSupabaseClient(accessToken).schema('files');

  const { data, error } = await supabase
    .from('file_references')
    .select('*, file:files(*)')
    .eq('file.user', userId);

  if (error) throw new Error(error.message);
  return (data || []).map(normalizeFileReference);
}

/**
 * Search file references by chat ID.
 * @param chatId - Chat UUID.
 * @param accessToken - Supabase access token.
 */
export async function searchFileReferencesByChatId(
  chatId: string,
  accessToken: string
): Promise<FileReference[]> {
  const supabase = getSupabaseClient(accessToken).schema('files');

  const { data, error } = await supabase
    .from('file_references')
    .select('*, file:files(*)')
    .eq('entity_type', 'chat')
    .eq('entity_id', chatId);

  if (error) throw new Error(error.message);
  return (data || []).map(normalizeFileReference);
}

/**
 * Insert a new file reference.
 * @param ref - FileReference without ID or file object.
 * @param accessToken - Supabase access token.
 */
export async function insertFileReference(
  ref: Omit<FileReference, 'id' | 'createdAt'>,
  accessToken: string
): Promise<FileReference> {
  const supabase = getSupabaseClient(accessToken).schema('files');

  const { data, error } = await supabase
    .schema('files')
    .from('references')
    .insert({
      file_id: ref.file!.id,
      entity_type: ref.entityType,
      entity_id: ref.entityId,
      public_name: ref.publicName,
      description: ref.description,
    })
    .select('*, file:files(*)')
    .single();

  if (error) throw new Error(error.message);
  return normalizeFileReference(data);
}

/**
 * Update an existing file reference.
 * @param referenceId - ID of the reference.
 * @param updates - Partial file reference fields.
 * @param accessToken - Supabase access token.
 */
export async function updateFileReference(
  referenceId: string,
  updates: Partial<Omit<FileReference, 'id' | 'file' | 'createdAt'>>,
  accessToken: string
): Promise<FileReference> {
  const supabase = getSupabaseClient(accessToken).schema('files');

  const { data, error } = await supabase
    .from('file_references')
    .update({
      entity_type: updates.entityType,
      entity_id: updates.entityId,
      public_name: updates.publicName,
      description: updates.description,
    })
    .eq('id', referenceId)
    .select('*, file:files(*)')
    .single();

  if (error) throw new Error(error.message);
  return normalizeFileReference(data);
}

/**
 * Delete a file reference by ID.
 * @param id - FileReference ID.
 * @param accessToken - Supabase access token.
 */
export async function deleteFileReference(id: string, accessToken: string): Promise<boolean> {
  const supabase = getSupabaseClient(accessToken).schema('files');

  const { error } = await supabase.from('file_references').delete().eq('id', id);

  if (error) throw new Error(error.message);
  return true;
}
