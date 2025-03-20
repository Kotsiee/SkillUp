import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { User } from "../user/user.ts";
import { Chat } from "./chats.ts";

export interface ChatRoles {
    id: string;
    user?: User;
    chat?: Chat;
    role: string;
    joinedAt: DateTime;
}