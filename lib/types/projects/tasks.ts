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
