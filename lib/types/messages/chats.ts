import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { ChatRoles } from "./chatRoles.ts";
import { Messages } from "./messages.ts";
import { Files } from "../files/files.ts";
import { Task } from "../projects/tasks.ts";

export interface Chat {
    id: string;
    task?: Task;
    chatType?: string;
    users?: ChatRoles[];
    name: string;
    meta: ChatMeta;
    lastMessage?: Messages;
    photo?: Files;
    createdAt: DateTime;
}

export interface ChatMeta{
    desc: string
}