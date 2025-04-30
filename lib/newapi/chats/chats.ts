// lib/api/chats.ts

import { Chat, normalizeChat, normalizeChatRole, normalizeUser } from '../../newtypes/index.ts';
import { getSupabaseClient } from '../../supabase/client.ts';
import { getFileUrl } from '../files/files.ts';
import { fetchAvatar } from '../user/user.ts';

/**
 * Fetch a chat by its ID.
 * @param chatId - UUID of the chat.
 * @param accessToken - Supabase access token.
 * @returns A Chat object.
 */
export async function fetchChatById(chatId: string, accessToken: string): Promise<Chat> {
  const supabase = getSupabaseClient(accessToken).schema('messages');

  const { data, error } = await supabase.rpc('get_chat_by_id', {
    chat_uuid: chatId,
  });

  if (error) throw new Error('fetchChatById - ' + error.message);

  if (!data || data.length === 0) {
    throw new Error('fetchChatById - No chat found');
  }

  const rawChat = data[0].chat;

  const chat = normalizeChat(rawChat);

  chat.users = await Promise.all(
    (rawChat.roles || []).map(async (rawRole: any) => {
      const profilepics = await fetchAvatar(rawRole.user.id);
      return normalizeChatRole({ ...rawRole, user: { ...rawRole.user, profilepics } });
    })
  );

  return chat;
}

/**
 * Fetch all chats the user is part of.
 * @param userId - ID of the user.
 * @param accessToken - Supabase access token.
 * @returns Array of Chat objects.
 */
export async function fetchChatsByUserId(userId: string, accessToken: string): Promise<Chat[]> {
  const supabase = getSupabaseClient(accessToken).schema('messages');

  const { data, error } = await supabase.rpc('get_user_chats', {
    user_id_input: userId,
  });

  if (error) throw new Error('fetchChatsByUserId - ' + error.message);

  return await Promise.all(
    (data || []).map(async (rawChat: any) => {
      const chat = normalizeChat(rawChat);
      chat.users = await Promise.all(
        (rawChat.roles || []).map(async (rawRole: any) => {
          const profilepics = await fetchAvatar(rawRole.user.id);
          return normalizeChatRole({ ...rawRole, profilepics });
        })
      );

      return chat;
    })
  );
}

/**
 * Fetch all chats related to a specific project.
 * @param projectId - UUID of the project.
 * @param accessToken - Supabase access token.
 * @returns Array of Chat objects.
 */
export async function fetchChatsByProjectId(
  projectId: string,
  accessToken: string
): Promise<Chat[]> {
  const supabase = getSupabaseClient(accessToken).schema('chats');

  const { data, error } = await supabase.from('chats').select('*').eq('project_id', projectId);

  if (error) throw new Error(error.message);
  return (data || []).map(normalizeChat);
}

/**
 * Create a new chat.
 * @param title - Chat title.
 * @param createdBy - User ID who is creating the chat.
 * @param accessToken - Supabase access token.
 * @param description - Optional description.
 * @param projectId - Optional related project ID.
 * @returns The newly created Chat object.
 */
export async function addNewChat(
  title: string,
  createdBy: string,
  accessToken: string,
  description?: string,
  projectId?: string
): Promise<Chat> {
  const supabase = getSupabaseClient(accessToken).schema('chats');

  const { data, error } = await supabase
    .from('chats')
    .insert({
      title,
      created_by: createdBy,
      description: description ?? null,
      project_id: projectId ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return normalizeChat(data);
}

/**
 * Update a chat's title, description, or project reference.
 * @param chatId - Chat UUID.
 * @param fields - Fields to update.
 * @param accessToken - Supabase access token.
 * @returns The updated Chat object.
 */
export async function updateChat(
  chatId: string,
  fields: Partial<Pick<Chat, 'name' | 'meta'>>,
  accessToken: string
): Promise<Chat> {
  const supabase = getSupabaseClient(accessToken).schema('chats');

  const updatePayload = {
    name: fields.name,
    meta: fields.meta,
  };

  const { data, error } = await supabase
    .from('chats')
    .update(updatePayload)
    .eq('id', chatId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return normalizeChat(data);
}

/**
 * Delete a chat by ID.
 * @param chatId - Chat UUID.
 * @param accessToken - Supabase access token.
 * @returns True if deleted.
 */
export async function deleteChat(chatId: string, accessToken: string): Promise<boolean> {
  const supabase = getSupabaseClient(accessToken).schema('chats');

  const { error } = await supabase.from('chats').delete().eq('id', chatId);
  if (error) throw new Error(error.message);
  return true;
}
