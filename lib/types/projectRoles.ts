import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { Project, User } from "./index.ts";

export interface ProjectRole {
    id: string;
    project: Project | null;
    user: User | null;
    createdAt: DateTime;
}