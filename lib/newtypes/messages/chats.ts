import { ChatRole } from './chatRoles.ts';
import { Files } from '../files/files.ts';
import { Task } from '../projects/tasks.ts';
import { FileReference } from '../files/fileReferences.ts';
import { DateTime } from 'https://esm.sh/luxon@3.5.0';

export interface Chat {
  id: string;
  task?: Task;
  chatType?: string;
  users?: ChatRole[];
  name?: string;
  meta: ChatMeta;
  photo?: Files | FileReference;
  createdAt?: DateTime;
  updatedAt?: DateTime;
}

export interface ChatMeta {}

/**
 * Normalize raw chat object from Supabase into Chat type.
 * @param raw - Raw object from Supabase.
 * @returns A typed Chat object.
 */
export function normalizeChat(data: any): Chat {
  return {
    id: data.id ?? crypto.randomUUID(),
    task: data.task_id ?? undefined,
    chatType: data.type ?? undefined,
    users: data.roles ?? [],
    name: data.name ?? undefined,
    meta: data.meta ?? {}, // Example default meta structure
    photo: data.photo ?? undefined,
    createdAt: DateTime.fromISO(data.createdAt) ?? undefined,
  };
}
