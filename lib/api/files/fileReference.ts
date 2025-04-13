// deno-lint-ignore-file no-unused-vars no-explicit-any
import { getSupabaseClient } from '../../supabase/client.ts';
import { FileReference } from '../../types/index.ts';
import { DateTime } from 'https://esm.sh/luxon@3.5.0';
import { fetchFileById } from './file.ts';

export async function insertFileReference(fileRef: FileReference): Promise<FileReference | null> {
  try {
    const newFile = {
      id: fileRef.id,
      file_id: fileRef.file!.id,
      type: fileRef.entityType,
      entity_id: fileRef.entityId,
      meta: fileRef.meta,
      created_at: DateTime.now().toISO(),
    };

    const { data, error } = await getSupabaseClient()
      .schema('files')
      .from('references')
      .insert(newFile);
    if (error) throw error;
    return fileRef;
  } catch (error: any) {
    console.error('insertFile: Error inserting/updating file -', error.message);
    return null;
  }
}

export async function fetchFileReference(
  user: string,
  type: string,
  entityId: string
): Promise<FileReference[] | null> {
  const { data, error } = await getSupabaseClient()
    .schema('files')
    .from('references')
    .select('*')
    .eq('type', type)
    .eq('entity_id', entityId);

  if (error) {
    console.log('fetchFileReference: error was found :( - ' + error.message);
    return null;
  }

  const refs: FileReference[] = await Promise.all(
    data.map(async d => {
      await fetchFileById(user, d.file_id);

      return {
        id: d.id,
        file: await fetchFileById(user, d.file_id),
        entityType: type,
        entityId,
        meta: d.meta,
        createdAt: DateTime.fromISO(d.created_at),
      };
    })
  );

  return refs;
}

export async function fetchFileReferenceById(
  user: string,
  id: string
): Promise<FileReference | null> {
  const { data, error } = await getSupabaseClient()
    .schema('files')
    .from('references')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.log('fetchFileReference: error was found :( - ' + error.message);
    return null;
  }

  console.log(data);

  await fetchFileById(user, data.file_id);
  const ref: FileReference = {
    id: data.id,
    file: await fetchFileById(user, data.file_id),
    entityType: data.type,
    entityId: data.entity_id,
    meta: data.meta,
    createdAt: DateTime.fromISO(data.created_at),
  };

  return ref;
}
