import { DateTime } from 'https://esm.sh/luxon@3.5.0';
import { Task } from './tasks.ts';
import { normalizeTeam, Team } from '../teams/teams.ts';
import { Files } from '../files/files.ts';
import { FileReference } from '../files/fileReferences.ts';
import { ProjectRole } from './roles.ts';
import { TeamRoles } from '../teams/teamRoles.ts';

export interface Project {
  id?: string;
  team?: Team;
  title?: string;
  description?: string;
  attachments?: Files[] | FileReference[];
  is_public?: boolean;
  status?: string;

  startDate?: DateTime;
  endDate?: DateTime;
  createdAt?: DateTime;
  updatedAt?: DateTime;

  totalBudget?: number; // Full budget
  budgetLocked?: number; // Budget in escrow. i.e., the money held by the platform until payout time
  budgetUsed?: number;
  budgetReturned?: number;

  jobs?: Task[];
  roles?: ProjectRole | TeamRoles;

  meta?: {
    no_submissions?: number;
  };
}

export interface ProjectMeta {
  budget: number;
  contributors: number;
  timeline: ProjectTimeline;
}

export interface ProjectTimeline {
  startDate: DateTime;
  endDate: DateTime;
}

/**
 * Normalize raw DB project to typed Project.
 */
export function normalizeProject(raw: any): Project {
  return {
    id: raw.id,
    team: raw.team ? normalizeTeam(raw.team) : undefined, // can be expanded later
    title: raw.title,
    description: raw.description,
    attachments: raw.attachments ?? [],
    is_public: raw.is_public ?? false,
    status: raw.status,
    startDate: raw.start_date ? DateTime.fromISO(raw.start_date) : undefined,
    endDate: raw.end_date ? DateTime.fromISO(raw.end_date) : undefined,
    createdAt: raw.created_at ? DateTime.fromISO(raw.created_at) : undefined,
    updatedAt: raw.updated_at ? DateTime.fromISO(raw.updated_at) : undefined,
    totalBudget: raw.total_budget ?? 0,
    budgetLocked: raw.budget_locked ?? 0,
    budgetUsed: raw.budget_used ?? 0,
    budgetReturned: raw.budget_returned ?? 0,
    jobs: raw.jobs ?? [],
    meta: raw.meta ?? {},
    roles: raw.roles ?? {},
  };
}
