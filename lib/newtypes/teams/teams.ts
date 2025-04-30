// deno-lint-ignore-file no-explicit-any
import { DateTime } from 'https://esm.sh/luxon@3.5.0';
import { Files } from '../files/files.ts';

export interface Team {
  id: string;
  name: string;
  handle: string;
  logo?: { small?: Files; med?: Files; large?: Files };
  banner?: Files;
  description?: string;
  headline?: string;
  links?: Record<string, any>[];
  createdAt: DateTime;
  meta?: any;
}

export const DEFAULT_LOGO = {
  small: { publicURL: '/assets/images/placeholders/teams_small.webp' },
  med: { publicURL: '/assets/images/placeholders/teams_med.webp' },
  large: { publicURL: '/assets/images/placeholders/teams_large.webp' },
};

export function normalizeTeam(raw: any): Team {
  return {
    id: raw.id,
    name: raw.name,
    handle: raw.handle,
    logo: {
      small: raw.logo?.small ?? DEFAULT_LOGO.small,
      med: raw.logo?.med ?? DEFAULT_LOGO.med,
      large: raw.logo?.large ?? DEFAULT_LOGO.large,
    },
    banner: raw.banner ?? { publicURL: '/assets/images/placeholders/Banner.webp' },
    description: raw.description ?? '',
    headline: raw.headline ?? '',
    links: raw.links ?? [],
    createdAt: raw.created_at ? DateTime.fromISO(raw.created_at) : DateTime.now(),
  };
}
