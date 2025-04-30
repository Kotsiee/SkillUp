// lib/api/users.ts

import { getSupabaseClient } from '../../supabase/client.ts';

/**
 * Fetch all connections for a given user ID.
 * @param userId - ID of the user.
 * @param accessToken - Supabase access token.
 * @returns List of user connections.
 */
export async function fetchConnectionsByUserId(userId: string, accessToken: string) {
  const supabase = getSupabaseClient(accessToken).schema('users');

  const { data, error } = await supabase
    .from('connections')
    .select('*')
    .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`);

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Add a new connection between two users.
 * @param user1 - First user ID.
 * @param user2 - Second user ID.
 * @param accessToken - Supabase access token.
 * @returns Newly created connection.
 */
export async function addConnection(user1: string, user2: string, accessToken: string) {
  const supabase = getSupabaseClient(accessToken).schema('users');
  const { data, error } = await supabase
    .from('connections')
    .insert({ user_id_1: user1, user_id_2: user2, status: 'pending' })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Update an existing connection status.
 * @param connectionId - ID of the connection.
 * @param status - New connection status.
 * @param accessToken - Supabase access token.
 * @returns Updated connection.
 */
export async function updateConnection(connectionId: string, status: string, accessToken: string) {
  const supabase = getSupabaseClient(accessToken).schema('users');
  const { data, error } = await supabase
    .from('connections')
    .update({ status })
    .eq('id', connectionId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Delete a connection by ID.
 * @param connectionId - UUID of the connection.
 * @param accessToken - Supabase access token.
 * @returns True on success.
 */
export async function deleteConnection(
  connectionId: string,
  accessToken: string
): Promise<boolean> {
  const supabase = getSupabaseClient(accessToken).schema('users');
  const { error } = await supabase.from('connections').delete().eq('id', connectionId);
  if (error) throw new Error(error.message);
  return true;
}
