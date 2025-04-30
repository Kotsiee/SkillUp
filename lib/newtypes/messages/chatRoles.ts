import { DEFAULT_IMAGES, User } from '../user/user.ts';
import { DateTime } from 'https://esm.sh/luxon@3.5.0';

export interface ChatRole {
  id: string;
  chatId: string;
  user: User;
  role?: string;
  joinedAt?: DateTime;
}

/**
 * Normalize raw chat role record from Supabase.
 * @param raw - Raw row from Supabase.
 * @returns A typed ChatRole object.
 */
export function normalizeChatRole(raw: any): ChatRole {
  return {
    id: raw.id,
    chatId: raw.chat_id,
    user: {
      id: raw.user.id,
      username: raw.user.username,
      firstName: raw.user.first_name,
      lastName: raw.user.last_name,
      profilePicture: {
        small: raw.user.profilepics?.small ?? DEFAULT_IMAGES.small,
        med: raw.user.profilepics?.med ?? DEFAULT_IMAGES.med,
        large: raw.user.profilepics?.large ?? DEFAULT_IMAGES.large,
      },
      email: '',
    },
    role: raw.role,
    joinedAt: DateTime.fromISO(raw.joined_at),
  };
}
