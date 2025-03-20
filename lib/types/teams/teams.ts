// deno-lint-ignore-file no-explicit-any
import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { Files } from "../files/files.ts";

export interface Team {
    id: string;
    name: string;
    handle: string;
    logo?: {small?: Files, med?: Files, large?: Files};
    banner?: Files;
    description?: string;
    links?: Record<string, any>[];
    createdAt: DateTime;
}