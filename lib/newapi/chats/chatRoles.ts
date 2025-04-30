// lib/api/chatRoles.ts

import { ChatRole, normalizeChatRole } from '../../newtypes/index.ts';
import { getSupabaseClient } from '../../supabase/client.ts';

/**
 * Fetch a chat role by its ID.
 * @param id - Role ID.
 * @param accessToken - Supabase access token.
 * @returns A ChatRole object.
 */
export async function fetchChatRoleById(id: string, accessToken: string): Promise<ChatRole> {
  const supabase = getSupabaseClient(accessToken).schema('chats');

  const { data, error } = await supabase.from('chat_roles').select('*').eq('id', id).single();

  if (error) throw new Error(error.message);
  return normalizeChatRole(data);
}

/**
 * Fetch all chat roles associated with a specific chat.
 * @param chatId - Chat ID.
 * @param accessToken - Supabase access token.
 * @returns Array of ChatRole objects.
 */
export async function fetchChatRolesByChatId(
  chatId: string,
  accessToken: string
): Promise<ChatRole[]> {
  const supabase = getSupabaseClient(accessToken).schema('chats');

  const { data, error } = await supabase.from('chat_roles').select('*').eq('chat_id', chatId);

  if (error) throw new Error(error.message);
  return (data || []).map(normalizeChatRole);
}

/**
 * Fetch all chat roles for a user.
 * @param userId - User ID.
 * @param accessToken - Supabase access token.
 * @returns Array of ChatRole objects.
 */
export async function fetchChatRolesByUserId(
  userId: string,
  accessToken: string
): Promise<ChatRole[]> {
  const supabase = getSupabaseClient(accessToken).schema('chats');

  const { data, error } = await supabase.from('chat_roles').select('*').eq('user_id', userId);

  if (error) throw new Error(error.message);
  return (data || []).map(normalizeChatRole);
}

/**
 * Add a new chat role.
 * @param chatId - Chat UUID.
 * @param userId - User UUID.
 * @param role - Role type ("owner" | "moderator" | "participant").
 * @param accessToken - Supabase access token.
 * @returns Created ChatRole object.
 */
export async function addChatRole(
  chatId: string,
  userId: string,
  role: ChatRole['role'],
  accessToken: string
): Promise<ChatRole> {
  const supabase = getSupabaseClient(accessToken).schema('chats');

  const { data, error } = await supabase
    .from('chat_roles')
    .insert({ chat_id: chatId, user_id: userId, role })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return normalizeChatRole(data);
}

/**
 * Update the role type of a chat role.
 * @param roleId - Role ID.
 * @param role - New role to assign.
 * @param accessToken - Supabase access token.
 * @returns Updated ChatRole object.
 */
export async function updateChatRole(
  roleId: string,
  role: ChatRole['role'],
  accessToken: string
): Promise<ChatRole> {
  const supabase = getSupabaseClient(accessToken).schema('chats');

  const { data, error } = await supabase
    .from('chat_roles')
    .update({ role })
    .eq('id', roleId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return normalizeChatRole(data);
}

/**
 * Delete a chat role by its ID.
 * @param roleId - Role UUID.
 * @param accessToken - Supabase access token.
 * @returns True on success.
 */
export async function deleteChatRole(roleId: string, accessToken: string): Promise<boolean> {
  const supabase = getSupabaseClient(accessToken).schema('chats');

  const { error } = await supabase.from('chat_roles').delete().eq('id', roleId);
  if (error) throw new Error(error.message);
  return true;
}
