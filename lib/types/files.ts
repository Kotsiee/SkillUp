import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { User } from "./index.ts";

export interface Files {
    id: string;
    userId: User;
    chatId: User | null;
    filePath: string;
    name: string;
    extension: string;
    createdAt: DateTime;
}