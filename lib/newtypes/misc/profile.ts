import { Files } from '../files/files.ts';
import { DEFAULT_LOGO, jsonTag } from '../index.ts';
import { Team } from '../teams/teams.ts';
import { DEFAULT_IMAGES, User } from '../user/user.ts';

export interface Profile {
  type: string;
  account: User | Team;
  profile: ProfileUnified;
}

export interface ProfileUnified {
  id: string;
  name: string;
  handle: string;
  logo?: { small?: Files; med?: Files; large?: Files };
  banner?: Files;
  bio?: string;
  headline?: jsonTag;
  links?: Record<string, any>[];
}

export function normalizeProfile(raw: any): Profile {
  return {
    type: raw.type,
    account: raw.account,
    profile: {
      id: raw.profile.id,
      name: raw.profile.name,
      handle: raw.profile.handle,
      headline: raw.profile.headline,
      bio: raw.profile.bio ? JSON.parse(raw.profile.bio) : undefined,
      links: raw.profile.links,
      logo: {
        small: raw.logo.small ?? (raw.type === 'team' ? DEFAULT_LOGO.small : DEFAULT_IMAGES.small),
        med: raw.logo.med ?? (raw.type === 'team' ? DEFAULT_LOGO.med : DEFAULT_IMAGES.med),
        large: raw.logo.large ?? (raw.type === 'team' ? DEFAULT_LOGO.large : DEFAULT_IMAGES.large),
      },
      banner: raw.banner || undefined,
    },
  };
}
