import { supabase } from "../../supabase/client.ts";
import { TeamRoles } from "../../types/index.ts";
import { fetchTeamByID } from "./teams.ts";
import { DateTime } from "https://esm.sh/luxon@3.5.0";

export async function fetchTeamsByUser(userId: string): Promise<TeamRoles[] | null> {
    const { data, error } = await supabase
    .schema("teams")
    .from("roles")
        .select('*')
        .eq('user_id', userId)

    if(error){
        console.log("fetchTeamsByUser: error was found :( - " + error.message);
        return null;
    }

    const roles: TeamRoles[] = await Promise.all(
        data.map(async (d) => {
            const role: string = (d.role as string)[0].toUpperCase() + (d.role as string).substring(1)

            return {
                id: d.id,
                user: d.user_id,
                team: await fetchTeamByID(d.team_id),
                role,
                access: d.access,
                updatedAt: DateTime.fromISO(d.updated_at)
            };
        })
    );

    return roles;
}