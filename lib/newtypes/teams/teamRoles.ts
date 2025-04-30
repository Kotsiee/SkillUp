import { DateTime } from 'https://esm.sh/luxon@3.5.0';
import { normalizeTeam, Team } from './teams.ts';
import { User } from '../user/user.ts';

export interface TeamRoles {
  id: string;
  user?: string | User;
  team?: string | Team;
  role: string;
  access?: TeamAccess; // Custom access to specific things if needed. Works hand in hand with roles
  createdAt?: DateTime;
  updatedAt?: DateTime;
}

export interface TeamAccess {
  level?: string;
}

export function normalizeTeamRole(raw: any): TeamRoles {
  return {
    id: raw.id,
    role: raw.role,
    user: raw.user_id,
    team: raw.team ? normalizeTeam(raw.team) : raw.team,
    createdAt: raw.created_at ? DateTime.fromISO(raw.joined_at) : DateTime.now(),
    updatedAt: raw.created_at ? DateTime.fromISO(raw.updated_at) : DateTime.now(),
  };
}
