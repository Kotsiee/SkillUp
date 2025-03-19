// deno-lint-ignore-file no-explicit-any
import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { Files, User } from "./index.ts";

export interface Organisation {
    id: string;
    name: string;
    logo?: Files;
    description?: string;
    links?: Record<string, any>[];
    createdAt: DateTime;
}

export interface OrganisationRoles {
    id: string;
    user?: User;
    organisation: Organisation | null;
    role: "owner" | "co_owner" | "member";
    access?: OrganisationAccess; // Custom access to specific things if needed. Works hand in hand with roles
    updatedAt?: DateTime;
}

export interface OrganisationAccess {
    level?: string
}