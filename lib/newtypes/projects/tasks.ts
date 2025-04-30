// deno-lint-ignore-file no-explicit-any
import { DateTime } from 'https://esm.sh/luxon@3.5.0';
import { FileReference } from '../files/fileReferences.ts';
import { Project } from './projects.ts';
import { Files } from '../files/files.ts';

export interface Task {
  id?: string;
  project?: Project | Task;
  title?: string;
  description?: string;
  status?: string;
  attachments?: Files[] | FileReference[];
  startDate?: DateTime;
  endDate?: DateTime;
  createdAt?: DateTime;
  updatedAt?: DateTime;
  metrics?: {
    [metric: string]: any; // Metric name & its weight
  };

  budgetAllocated?: number;
  tasks?: Task[];
  meta?: TaskMeta;
}

export type TaskMeta = {
  timeline?: TaskTimeline;
  priority?: string;
  subTasks?: Task[]; // Shoud also be a pointer
  icon?: string;
};

export type TaskTimeline = {
  startDate?: DateTime;
  endDate?: DateTime;
};

/**
 * Normalize a raw task from Supabase into a Task type.
 */
export function normalizeTask(raw: any): Task {
  return {
    id: raw.id,
    project: raw.job_id, // reference to job
    title: raw.title,
    description: raw.description,
    status: raw.status,
    startDate: raw.start_date ? DateTime.fromISO(raw.start_date) : undefined,
    endDate: raw.end_date ? DateTime.fromISO(raw.end_date) : undefined,
    createdAt: raw.created_at ? DateTime.fromISO(raw.created_at) : undefined,
    updatedAt: raw.updated_at ? DateTime.fromISO(raw.updated_at) : undefined,
    budgetAllocated: raw.budget_allocated,
    metrics: raw.metrics ?? {},
    meta: raw.meta ?? {},
  };
}
