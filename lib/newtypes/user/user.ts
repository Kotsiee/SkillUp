// deno-lint-ignore-file no-explicit-any
import { Files } from '../files/files.ts';

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  bio?: string;
  headline?: string;
  profilePicture?: { small?: Files | null; med?: Files | null; large?: Files | null } | null;
  banner?: Files | null;
  meta?: UserMeta | null;
  createdAt?: Date;
}

export interface UserMeta {
  settings?: UserSettings;
  history?: UserHistory;
  preferences?: UserPeferences;
}

export interface UserSettings {
  theme?: string;
  privacy?: string;
  language?: string;
  /*
        Allow for users to navigate with just their keyboard. 
        K - binding (ie., open menu)
        T - keys (ie., alt + m)
    */
  keyBindings?: Record<string, string[] | string>[];
}

export interface UserPeferences {
  chosenPreferences?: string[]; // List of user selected topic preferences
  calculatedPreferences?: Record<string, number>[]; // List of system calculated topic preferences based on history and chosen preferences
}

export interface UserHistory {
  search?: string[]; // List of all search terms
  project?: string[]; // List of previously clicked project ids
  people?: string[]; // List of previously clicked user ids
  organisations?: string[]; // List of previously clicked organisation ids
  posts?: string[]; // List of previously clicked post ids
}

export const DEFAULT_IMAGES = {
  small: { publicURL: '/assets/images/placeholders/profile_small.webp' },
  med: { publicURL: '/assets/images/placeholders/profile_med.webp' },
  large: { publicURL: '/assets/images/placeholders/profile_large.webp' },
};

export function normalizeUser(raw: any): User {
  return {
    id: raw.id,
    email: raw.primary_email,
    username: raw.username,
    firstName: raw.first_name,
    lastName: raw.last_name,
    bio: raw.biography ?? '',
    headline: raw.headline ?? '',
    createdAt: new Date(raw.created_at),
    profilePicture: {
      small: raw.profilepics?.small ?? DEFAULT_IMAGES.small,
      med: raw.profilepics?.med ?? DEFAULT_IMAGES.med,
      large: raw.profilepics?.large ?? DEFAULT_IMAGES.large,
    },
    banner: null, // Placeholder, to be updated when Files implemented
    meta: raw.meta ?? null,
  };
}
