import { DateTime } from 'https://esm.sh/luxon@3.5.0';
import { Project } from './projects.ts';
import { User } from '../user/user.ts';

export interface ProjectRole {
  id: string;
  projectId: string;
  userId: string;
  joinedAt?: DateTime;
  type: string;
}

export function normalizeProjectRole(raw: any): ProjectRole {
  return {
    id: raw.id,
    projectId: raw.project_id,
    userId: raw.user_id,
    joinedAt: raw.joined_at ? DateTime.fromISO(raw.joined_at) : undefined,
    type: raw.type,
  };
}
