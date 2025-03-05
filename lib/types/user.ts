import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { Logo, Privacy, Theme } from "./index.ts";

export interface User {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    profilePicture: Logo | null;
    meta: UserMeta | null;
    createdAt: DateTime;
}

export interface UserMeta {
    settings?: UserSettings;
    history?: UserHistory;
    preferences?: UserPeferences;
}

export interface UserSettings {
    theme?: Theme;
    privacy?: Privacy;
    language?: Language;
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

export enum Language {
    Afrikaans,
    Arabic,
    Bengali,
    Burmese,
    Cebuano,
    Chinese,
    Dutch,
    English,
    Farsi,
    Filipino,
    French,
    German,
    Gujarati,
    Hausa,
    Hindi,
    Igbo,
    Indonesian,
    Italian,
    Japanese,
    Javanese,
    Kannada,
    Korean,
    Malay,
    Malayalam,
    Marathi,
    Pashto,
    Persian,
    Polish,
    Portuguese,
    Punjabi,
    Romanian,
    Russian,
    Sindhi,
    Spanish,
    Swahili,
    Tamil,
    Telugu,
    Thai,
    Turkish,
    Ukrainian,
    Urdu,
    Vietnamese,
    Yoruba,
    Zulu
}