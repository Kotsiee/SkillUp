// deno-lint-ignore-file
import RealtimeChannel from 'https://esm.sh/@supabase/realtime-js@2.11.2/dist/module/RealtimeChannel.js';
import {
  FileReference,
  Files,
  Messages,
  normalizeFileReference,
  normalizeMessage,
} from '../../newtypes/index.ts';
import { getSupabaseClient } from '../../supabase/client.ts';
import { fetchFileById, fetchFileByPath } from '../files/files.ts';
import { uploadAndReferenceFile } from '../storage/storage.ts';
import { insertFileReference } from '../files/fileReferences.ts';

/**
 * Fetch a message by its ID.
 * @param messageId - UUID of the message.
 * @param accessToken - Supabase access token.
 * @returns A normalized `Messages` object.
 */
export async function fetchMessageById(messageId: string, accessToken: string): Promise<Messages> {
  const supabase = getSupabaseClient(accessToken).schema('messages');

  // Fetch message
  const { data: messageData, error: messageError } = await supabase
    .from('messages')
    .select('*')
    .eq('id', messageId)
    .single();

  if (messageError) throw new Error(messageError.message);

  // Fetch file references
  const { data: refData, error: refError } = await supabase
    .schema('files')
    .from('references')
    .select('*, file:files(*)')
    .eq('entity_type', 'messages')
    .eq('entity_id', messageId);

  if (refError) throw new Error(refError.message);

  const attachments = (refData || []).map(normalizeFileReference);

  return {
    ...normalizeMessage(messageData),
    attachments,
  };
}

/**
 * Fetch all messages in a chat.
 * @param chatId - Chat ID.
 * @param accessToken - Supabase access token.
 * @returns Array of `Messages` objects ordered by sent time.
 */
export async function fetchMessagesByChatId(
  chatId: string,
  accessToken: string
): Promise<Messages[]> {
  const supabase = getSupabaseClient(accessToken).schema('messages');

  const { data, error } = await supabase.rpc('get_messages_by_chat_id', {
    chat_uuid: chatId,
  });

  if (error) throw new Error(error.message);

  const messages = await Promise.all(
    (data || []).map(async (msg: any) => {
      if (msg.message.has_attachment) {
        for (const fileRef of msg.message.fileRefs ?? []) {
          if (fileRef?.file) {
            fileRef.file = await fetchFileByPath(
              msg.message.user.id,
              fileRef.file.file_path,
              fileRef.file?.stored_name,
              accessToken
            );
          }
        }
      }

      return normalizeMessage(msg.message);
    })
  );

  return messages;
}

/**
 * Add a new message to a chat.
 * @param message - Message payload (excluding `id`).
 * @param accessToken - Supabase access token.
 * @returns Inserted `Messages` object.
 */
export async function addMessage(message: Messages, accessToken: string): Promise<Messages> {
  const supabase = getSupabaseClient(accessToken).schema('messages');

  const { data, error } = await supabase
    .from('messages')
    .insert({
      id: message.id,
      user_id: message.user,
      chat_id: message.chatid,
      content: message.content,
      text_content: message.textContent ?? null,
      sent_at: message.sentAt,
      has_attachment: message.attachments && message.attachments?.length > 0,
      type: 'message',
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  const newMessage = normalizeMessage(data);

  // Handle attachments: upload or reference
  const finalAttachments: FileReference[] = [];

  if (message.attachments?.length) {
    for (const file of message.attachments as Files[]) {
      const uploadableFile: Files = { ...file, user: message.user as string };

      // Upload new file if marked as uploadable
      if (uploadableFile.isUpload && typeof uploadableFile.publicURL === 'string') {
        const fileRef = await uploadAndReferenceFile(
          uploadableFile,
          {
            entityId: newMessage.id!,
            entityType: 'messages',
            publicName: uploadableFile.publicName,
          },
          accessToken
        );

        finalAttachments.push(fileRef);
      }

      // Reference existing file if it's from Supabase already
      if (!file.isUpload && file.id) {
        const ref = await insertFileReference(
          {
            file,
            entityId: newMessage.id!,
            entityType: 'messages',
            publicName: file.publicName,
          },
          accessToken
        );

        finalAttachments.push(ref);
      }
    }
  }

  return {
    ...newMessage,
    attachments: finalAttachments,
  };
}

/**
 * Update a message's content and optional fields.
 * @param messageId - UUID of the message.
 * @param updates - Partial message fields to update.
 * @param accessToken - Supabase access token.
 * @returns Updated `Messages` object.
 */
export async function updateMessage(
  messageId: string,
  updates: Partial<Omit<Messages, 'id' | 'userid' | 'chatid' | 'sentAt'>>,
  accessToken: string
): Promise<Messages> {
  const supabase = getSupabaseClient(accessToken).schema('messages');

  const payload = {
    content: updates.content,
    text_content: updates.textContent ?? null,
    attachments: updates.attachments ?? null,
  };

  const { data, error } = await supabase
    .from('messages')
    .update(payload)
    .eq('id', messageId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return normalizeMessage(data);
}

/**
 * Delete a message by ID.
 * @param messageId - Message UUID.
 * @param accessToken - Supabase access token.
 * @returns True on success.
 */
export async function deleteMessage(messageId: string, accessToken: string): Promise<boolean> {
  const supabase = getSupabaseClient(accessToken).schema('messages');

  const { error } = await supabase.from('messages').delete().eq('id', messageId);
  if (error) throw new Error(error.message);
  return true;
}

/**
 * Subscribe to new messages in a chat.
 * @param chatId - Chat ID to subscribe to.
 * @param accessToken - Supabase access token.
 * @param onMessage - Callback when a new message is inserted.
 * @returns The subscription channel (you can close it later).
 */
export function subscribeToMessages(
  chatId: string,
  accessToken: string,
  onEvent: (event: {
    eventType: 'INSERT' | 'UPDATE' | 'DELETE';
    new?: Messages;
    old?: Messages;
  }) => void
): RealtimeChannel {
  const supabase = getSupabaseClient(accessToken);

  const channel = supabase
    .channel(`messages:${chatId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'messages',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`,
      },
      async payload => {
        const type = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';

        let newMsg: Messages | undefined;
        let oldMsg: Messages | undefined;

        if (type !== 'DELETE' && payload.new) {
          newMsg = normalizeMessage(payload.new);

          const { data: fileRefs, error: fileError } = await supabase
            .schema('files')
            .from('references')
            .select('*, file:files(*)')
            .eq('entity_type', 'messages')
            .eq('entity_id', newMsg.id);

          if (fileError) {
            console.error(fileError.message);
          }

          const attachments = fileRefs
            ? await Promise.all(
                fileRefs.map(async ref => {
                  const file = await fetchFileById(ref.file_id, accessToken);
                  return normalizeFileReference({ ...ref, file });
                })
              )
            : [];

          newMsg = {
            ...newMsg,
            attachments,
          };
        }

        onEvent({
          eventType: type,
          new: newMsg,
          old: oldMsg,
        });
      }
    )
    .subscribe();

  return channel;
}
