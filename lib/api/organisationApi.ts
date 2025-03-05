import { Organisation } from "../types/index.ts";
import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { getFileUrl } from "./fetchData.ts";
import { getSupabaseClient } from "../supabase/client.ts";

export async function fetchOrganisations(): Promise<Organisation[] | null> {
    const { data, error } = await getSupabaseClient()
        .from('organizations')
        .select('*')

    if(error){
        console.log("error was found :( - " + error);
        return null;
    }

    const organisations: Organisation[] = await Promise.all(
        data.map(async (d) => {
            const logo = await getFileUrl(`organizations/${d.id}/Branding/${d.logo}`);
            return {
                id: d.id,
                name: d.name,
                description: d.description,
                logo: logo,
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

    if(error){
        console.log("error was found :( - " + error);
        return null;
    }

    const organisations: Organisation[] = await Promise.all(
        data.map(async (d) => {
            const logo = await getFileUrl(`organizations/${d.id}/Branding/${d.logo}`);
            return {
                id: d.id,
                name: d.name,
                description: d.description,
                logo: logo,
                links: d.links,
                createdAt:  DateTime.fromISO(d.created_at)
            };
        })
    );

    return organisations[0];
}