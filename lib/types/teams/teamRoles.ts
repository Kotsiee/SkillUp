import { DateTime } from 'https://esm.sh/luxon@3.5.0';
import { Team } from './teams.ts';
import { User } from '../user/user.ts';

export interface TeamRoles {
  id: string;
  user?: string | User;
  team?: string | Team;
  role: string;
  access?: TeamAccess; // Custom access to specific things if needed. Works hand in hand with roles
  updatedAt?: DateTime;
}

export interface TeamAccess {
  level?: string;
}
