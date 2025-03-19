import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { Chat, ChatRoles, FileReference, Files } from "./index.ts";

export interface Messages {
  id?: string;
  user: ChatRoles | null;
  chat?: Chat | null;
  content: jsonTag;
  textContent: jsonTag;
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
