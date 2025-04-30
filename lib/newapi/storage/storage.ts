import { FileReference, Files } from '../../newtypes/index.ts';
import { getSupabaseClient } from '../../supabase/client.ts';
import { insertFileReference } from '../files/fileReferences.ts';
import { insertFile } from '../files/files.ts';

/**
 * Uploads and inserts a file record, then links it as a reference.
 * @param rawFile - Blob or File object to upload
 * @param meta - Partial metadata for files table
 * @param userId - Current user
 * @param entity - Message context (e.g. chat/message)
 * @param accessToken - Supabase access token
 */
export async function uploadAndReferenceFile(
  file: Files,
  reference: Omit<FileReference, 'id' | 'file' | 'createdAt'>,
  accessToken: string
): Promise<FileReference> {
  const dbFile = await insertFile('user_uploads', file, accessToken);

  return await insertFileReference(
    {
      ...reference,
      file: {
        ...file,
        id: dbFile.id,
      },
    },
    accessToken
  );
}

/**
 * Upload a file to a specific Supabase Storage bucket
 */
export async function uploadFileToBucket(
  bucket: string,
  file: Files,
  accessToken: string
): Promise<string> {
  const supabase = getSupabaseClient(accessToken).storage;

  const base64Data = file.publicURL!.split(',')[1];
  if (!base64Data) throw new Error('Invalid Base64 format.');

  const byteArray = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
  const fileBlob = new Blob([byteArray], { type: file.mimeType });
  const filePath = `profile/${file.recipient ?? file.user}/${file.filePath}/${file.storedName}`;

  const { data, error } = await supabase.from(bucket).upload(filePath, fileBlob, {
    upsert: true,
  });

  if (error) {
    throw new Error('uploadFileToBucket - ' + error.message);
  }

  return data.path;
}
