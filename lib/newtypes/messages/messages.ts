import { FileReference, normalizeFileReference } from '../files/fileReferences.ts';
import { Files } from '../files/files.ts';
import { DateTime } from 'https://esm.sh/luxon@3.5.0';
import { User } from '../user/user.ts';

export interface Messages {
  id?: string;
  user: string | User;
  chatid?: string;
  content: jsonTag;
  textContent?: string;
  attachments?: Files[] | FileReference[] | null;
  sentAt: DateTime;
}

export interface jsonTag {
  Tag?: string;
  Style?: style | null;
  Content?: string | null;
  index?: number;
  range?: number;
  indent?: number;
  Children?: jsonTag[];
}

export interface style {
  color?: string;
}

export interface FileMessage {
  fileRef: FileReference;
  message?: Messages;
}

/**
 * Normalize raw message from Supabase into a typed `Messages` object.
 */
export function normalizeMessage(raw: any): Messages {
  return {
    id: raw.id,
    user: raw.user
      ? typeof raw.user === 'string'
        ? raw.user
        : {
            id: raw.user.id,
            username: raw.user.username ?? '',
            firstName: raw.user.firstName ?? '',
            lastName: raw.user.lastName ?? '',
          }
      : raw.user_id,
    chatid: raw.chat_id,
    content: raw.content,
    textContent: raw.text_content ?? undefined,
    attachments: raw.fileRefs?.map((ref: any) => normalizeFileReference(ref)) ?? [],
    sentAt: DateTime.fromISO(raw.sent_at),
  };
}
