import { DateTime } from 'https://esm.sh/luxon@3.5.0';
import { Task } from './tasks.ts';
import { Team } from '../teams/teams.ts';
import { Files } from '../files/files.ts';
import { FileReference } from '../files/fileReferences.ts';

export interface Project {
  id?: string;
  team?: Team;
  title?: string;
  description?: string;
  attachments?: Files[] | FileReference[];
  createdAt?: DateTime;
  updatedAt?: DateTime;
  is_public?: boolean;

  totalBudget?: number; // Full budget
  budgetLocked?: number; // Budget in escrow. i.e., the money held by the platform until payout time
  budgetUsed?: number;
  budgetReturned?: number;

  jobs?: Task[];

  meta?: {
    startDate?: DateTime;
    endDate?: DateTime;
    no_contributors?: number;
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

interface ProjectTemplate {
  id: string;
  team: Team;
  title: string;
  description: string;
  attachments: Files[] | FileReference[];
  createdAt: DateTime;
  updatedAt: DateTime;
  is_public: boolean;

  totalBudget: number; // Full budget
  budgetLocked: number; // Budget in escrow. i.e., the money held by the platform until payout time
  budgetUsed: number;
  budgetReturned: number;

  Jobs: TasksTemplate[];

  meta: {
    startDate: DateTime;
    endDate: DateTime;
    no_contributors: number;
  };
}

interface TasksTemplate {
  id: string;
  project: ProjectTemplate | TasksTemplate;
  title: string;
  description: string;
  attachments: Files[] | FileReference[];
  startDate: DateTime;
  endDate: DateTime;
  createdAt: DateTime;
  updatedAt: DateTime;
  metrics: {
    [metric: string]: number;
  };

  budgetAllocated: number;

  tasks?: TasksTemplate[];
}
