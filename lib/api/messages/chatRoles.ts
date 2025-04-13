import { getSupabaseClient } from '../../supabase/client.ts';
import { DateTime } from 'https://esm.sh/luxon@3.5.0';
import { ChatRoles } from '../../types/index.ts';
import { fetchChatByID } from './chats.ts';
import { fetchUserByID } from '../user/user.ts';

export async function fetchChatRole(
  userId: string,
  chatId: string,
  simplify?: boolean
): Promise<ChatRoles | null> {
  const { data, error } = await getSupabaseClient()
    .schema('messages')
    .from('roles')
    .select('*, chat_id(*)')
    .eq('user_id', userId)
    .eq('chat_id', chatId)
    .single();

  if (error) {
    console.log('fetchChatRole: error was found :( - ' + error.cause);
    return null;
  }

  const chatRole: ChatRoles = {
    id: data.id,
    user: (await fetchUserByID(data.user_id)) ?? undefined,
    chat: simplify == true ? undefined : (await fetchChatByID(data.chat_id)) ?? undefined,
    role: data.role,
    joinedAt: DateTime.fromISO(data.joined_at),
  };

  return chatRole;
}

export async function fetchChatRolesByUserID(
  userId: string,
  simplify?: boolean
): Promise<ChatRoles[] | null> {
  const { data, error } = await getSupabaseClient()
    .schema('messages')
    .from('roles')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.log('fetchChatRolesByUserID: error was found :( - ' + error);
    return null;
  }

  const chatRoles: ChatRoles[] = await Promise.all(
    data.map(async d => {
      return {
        id: d.id,
        user: (await fetchUserByID(d.user_id)) ?? undefined,
        chat: simplify == true ? undefined : (await fetchChatByID(d.chat_id)) ?? undefined,
        role: d.role,
        joinedAt: DateTime.fromISO(d.joined_at),
      };
    })
  );

  return chatRoles;
}

export async function fetchChatRolesByChatID(
  chatId: string,
  simplify?: boolean
): Promise<ChatRoles[] | null> {
  const { data, error } = await getSupabaseClient()
    .schema('messages')
    .from('roles')
    .select('*, chat_id(*)')
    .eq('chat_id', chatId);

  if (error) {
    console.log('fetchChatRolesByChatID: error was found :( - ' + error);
    return null;
  }

  const chatRoles: ChatRoles[] = await Promise.all(
    data.map(async d => {
      return {
        id: d.id,
        user: (await fetchUserByID(d.user_id)) ?? undefined,
        chat: simplify == true ? undefined : (await fetchChatByID(d.chat_id)) ?? undefined,
        role: d.role,
        joinedAt: DateTime.fromISO(d.joined_at),
      };
    })
  );

  return chatRoles;
}
