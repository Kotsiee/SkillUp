import { DateTime } from 'https://esm.sh/luxon@3.5.0';
import { FileReference } from '../files/fileReferences.ts';
import { User } from '../user/user.ts';
import { Files } from '../files/files.ts';
import { jsonTag } from '../index.ts';

export interface Submission {
  id: string;
  job: string;
  task?: string;
  user: User | string;
  team?: string;
  files: FileReference[] | Files[];
  isDisqualified?: boolean;
  createdAt?: DateTime;
  meta: any;
  title?: string;
  description?: string | jsonTag;
  score: number;
}

export function normalizeSubmission(raw: any): Submission {
  return {
    id: raw.id,
    job: raw.job_id,
    user: raw.user,
    files: raw.file,
    isDisqualified: raw.is_disqualified ?? false,
    createdAt: raw.created_at ? DateTime.fromISO(raw.created_at) : DateTime.now(),
    meta: raw.meta ?? {},
    title: raw.title ?? undefined,
    description: raw.description ?? undefined,
    score: raw.score,
  };
}
