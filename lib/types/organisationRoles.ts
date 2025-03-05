// deno-lint-ignore-file no-explicit-any
import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { Organisation, Roles, User } from "./index.ts";

export interface OrganisationRoles {
    id: string;
    userId: User;
    organisation: Organisation;
    role: Roles;
    access?: OrganisationAccess; // Custom access to specific things if needed. Works hand in hand with roles
    updatedAt?: DateTime;
}

export interface OrganisationAccess {
    level: string
}