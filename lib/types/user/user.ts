import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { Files } from "../files/files.ts";
import { TeamRoles } from "../teams/teamRoles.ts";

export interface User {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    bio?: string;
    headline?: string;
    profilePicture?: {small?: Files | null, med?: Files | null, large?: Files | null} | null;
    banner?: Files | null;
    meta: UserMeta | null;
    teams?: TeamRoles[];
    createdAt: DateTime;
}

export interface UserMeta {
    settings?: UserSettings;
    history?: UserHistory;
    preferences?: UserPeferences;
}

export interface UserSettings {
    theme?: string;
    privacy?: string;
    language?: string;
    /*
        Allow for users to navigate with just their keyboard. 
        K - binding (ie., open menu)
        T - keys (ie., alt + m)
    */
    keyBindings?: Record<string, string[] | string>[];
}

export interface UserPeferences {
    chosenPreferences?: string[];                        // List of user selected topic preferences
    calculatedPreferences?: Record<string, number>[];    // List of system calculated topic preferences based on history and chosen preferences
}

export interface UserHistory {
    search?: string[];         // List of all search terms
    project?: string[];        // List of previously clicked project ids
    people?: string[];         // List of previously clicked user ids
    organisations?: string[];  // List of previously clicked organisation ids
    posts?: string[];          // List of previously clicked post ids
}