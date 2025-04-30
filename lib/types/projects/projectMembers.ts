import { DateTime } from 'https://esm.sh/luxon@3.5.0';
import { Project } from './projects.ts';
import { User } from '../user/user.ts';

export interface ProjectRole {
  id?: string;
  project?: Project | null;
  user?: User | null;
  role?: string;
  joinedAt?: DateTime;
}
