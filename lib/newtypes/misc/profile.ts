import { Files } from "../files/files.ts";
import { Team } from "../teams/teams.ts";
import { User } from "../user/user.ts";

export interface AccountProfile {
    type: string;
    account: User | Team
    profile: AccountProfileUnified
}

export interface AccountProfileUnified {
    name: string,
    handle: string,
    logo?: {small?: Files, med?: Files, large?: Files};
    banner?: Files;
    bio?: string;
    links?: Record<string, any>[];
}