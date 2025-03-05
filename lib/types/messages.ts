import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { Chat, ChatRoles, Files } from "./index.ts";

export interface Messages {
    id?: string;
    user: ChatRoles | null;
    chat?: Chat | null;
    content: jsonTag;
    attachments?: Files[];
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