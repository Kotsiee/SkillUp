import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { Chat, Roles, User } from "./index.ts";

export interface ChatRoles {
    id: string;
    user: User | null;
    chat: Chat | null;
    role: Roles;
    joinedAt: DateTime;
}