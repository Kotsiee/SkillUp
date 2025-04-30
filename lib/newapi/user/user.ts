// deno-lint-ignore-file no-explicit-any
// lib/api/users.ts

import { getSupabaseClient } from '../../supabase/client.ts';
import { normalizeUser, User } from '../../newtypes/index.ts';
import { fetchFileByPath } from '../files/files.ts';

export async function fetchAvatar(
  id: string,
  accessToken?: string
): Promise<{
  small: any | null;
  med: any | null;
  large: any | null;
}> {
  const small = await fetchFileByPath(id, 'profile/avatar', 'avatar_small.webp', accessToken);
  const med = await fetchFileByPath(id, 'profile/avatar', 'avatar_med.webp', accessToken);
  const large = await fetchFileByPath(id, 'profile/avatar', 'avatar_large.webp', accessToken);
  return { small, med, large };
}

/**
 * Fetch a user by their UUID.
 * @param userId - UUID of the user.
 * @param accessToken - Supabase access token for RLS.
 * @returns User data if found.
 */
export async function fetchUserById(userId: string, accessToken?: string): Promise<User | null> {
  const supabase = getSupabaseClient(accessToken).schema('users');
  const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
  if (error) throw new Error(error.message);
  return normalizeUser({ ...data, profilepics: await fetchAvatar(userId, accessToken) });
}

/**
 * Fetch a user by their handle/username. Public access.
 * @param username - Unique handle/username.
 * @returns User data if found.
 */
export async function fetchUserByHandle(username: string): Promise<User | null> {
  const supabase = getSupabaseClient().schema('users');
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();
  if (error) throw new Error(error.message);
  return normalizeUser(data);
}

/**
 * Search for users by name, username, headline or description. Public access.
 * Filters by language/skills if provided.
 * @param query - Search string.
 * @param filters - Optional filters { languages, skills }
 * @returns Array of matching users.
 */
export async function searchUsers(
  query: string,
  filters: { languages?: string[]; skills?: string[] } = {}
): Promise<User[]> {
  const supabase = getSupabaseClient().schema('users');
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .or(
      [
        `first_name.ilike.%${query}%`,
        `last_name.ilike.%${query}%`,
        `username.ilike.%${query}%`,
        `headline.ilike.%${query}%`,
        `biography.ilike.%${query}%`,
      ].join(',')
    );

  if (error) throw new Error(error.message);
  return data.map(normalizeUser);
}

/**
 * Update user profile.
 * @param userId - ID of the user.
 * @param updates - Partial fields to update.
 * @param accessToken - Supabase access token.
 * @returns Updated user.
 */
export async function updateUser(
  userId: string,
  updates: Partial<User>,
  accessToken: string
): Promise<User> {
  const supabase = getSupabaseClient(accessToken).schema('users');
  const patch = {
    first_name: updates.firstName,
    last_name: updates.lastName,
    username: updates.username,
    biography: updates.bio,
    headline: updates.headline,
    profile: updates.profilePicture,
    meta: updates.meta,
  };

  const { data, error } = await supabase
    .from('users')
    .update(patch)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return normalizeUser(data);
}
