import { Organisation, OrganisationRoles } from "../types/index.ts";
import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { getSupabaseClient } from "../supabase/client.ts";

export async function fetchOrganisations(): Promise<Organisation[] | null> {
    const { data, error } = await getSupabaseClient()
        .from('organizations')
        .select('*')

    if(error){
        console.log("fetchOrganisations: error was found :( - " + error.message);
        return null;
    }

    const organisations: Organisation[] = await Promise.all(
        data.map(async (d) => {
            return {
                id: d.id,
                name: d.name,
                description: d.description,
                links: d.links,
                createdAt:  DateTime.fromISO(d.created_at)
            };
        })
    );

    return organisations;
}

export async function fetchOrganisationByID(id: string): Promise<Organisation | null> {
    const { data, error } = await getSupabaseClient()
        .from('organizations')
        .select('*')
        .eq('id', id)
        .single()

    if(error){
        console.log("fetchOrganisationByID: error was found :( - " + error.message);
        return null;
    }

    const organisations: Organisation= {
        id: data.id,
        name: data.name,
        description: data.description,
        links: data.links,
        createdAt:  DateTime.fromISO(data.created_at)
    };

    return organisations;
}

export async function fetchOrganisationsByUser(userId: string): Promise<OrganisationRoles[] | null> {
    const { data, error } = await getSupabaseClient()
        .from('organization roles')
        .select('*')
        .eq('user_id', userId)

    if(error){
        console.log("fetchOrganisationsByUser: error was found :( - " + error.message);
        return null;
    }

    const roles: OrganisationRoles[] = await Promise.all(
        data.map(async (d) => {
            const org = d.organization_id
            return {
                id: d.id,
                user: d.user_id,
                organisation: await fetchOrganisationByID(d.organization_id),
                role: d.role,
                access: d.access,
                updatedAt: DateTime.fromISO(d.updated_at)
            };
        })
    );

    return roles;
}