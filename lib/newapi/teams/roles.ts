import { Team, TeamRoles } from '../../newtypes/index.ts';
import { getSupabaseClient } from '../../supabase/client.ts';
import { normalizeTeamRole } from './../../newtypes/teams/teamRoles.ts';
import { fetchTeamBanner, fetchTeamLogo } from './teams.ts';

export async function fetchTeamsRolesByUserId(
  userId: string,
  accessToken: string
): Promise<TeamRoles[]> {
  const supabase = getSupabaseClient(accessToken).schema('teams');

  const { data, error } = await supabase
    .from('roles')
    .select('*, team:teams(*)')
    .eq('user_id', userId);

  if (error) throw new Error(error.message);

  const roles = await Promise.all(
    (data || []).map(async (role: TeamRoles) => {
      const team = role.team as Team;
      team.logo = await fetchTeamLogo(team.id);
      team.banner = await fetchTeamBanner(team.id);

      return normalizeTeamRole({ ...role, team });
    })
  );

  return roles;
}
