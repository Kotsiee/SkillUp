// deno-lint-ignore-file no-explicit-any
import { DateTime } from "https://esm.sh/luxon@3.5.0";

export interface Organisation {
    id: string;
    name: string;
    logo?: string;
    description?: string;
    links?: Record<string, any>[];
    createdAt: DateTime;
}