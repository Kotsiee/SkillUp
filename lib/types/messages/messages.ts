import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { ChatRoles } from "./chatRoles.ts";
import { Chat } from "./chats.ts";
import { FileReference } from "../files/fileReferences.ts";
import { Files } from "../files/files.ts";

export interface Messages {
  id?: string;
  user?: ChatRoles;
  chat?: Chat;
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
