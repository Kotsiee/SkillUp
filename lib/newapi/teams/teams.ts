// deno-lint-ignore-file no-explicit-any
import { Files, Team, normalizeTeam } from '../../newtypes/index.ts';
import { getSupabaseClient } from '../../supabase/client.ts';
import { fetchFileByPath, insertFile } from '../files/files.ts';

export async function fetchTeamLogo(
  id: string,
  accessToken?: string
): Promise<{
  small: any | null;
  med: any | null;
  large: any | null;
}> {
  const small = await fetchFileByPath(id, 'profile/logo', 'logo_small.webp', accessToken);
  const med = await fetchFileByPath(id, 'profile/logo', 'logo_med.webp', accessToken);
  const large = await fetchFileByPath(id, 'profile/logo', 'logo_large.webp', accessToken);
  return { small, med, large };
}

export async function fetchTeamBanner(id: string, accessToken?: string): Promise<any> {
  const banner = await fetchFileByPath(id, 'profile/banner', 'banner.webp', accessToken);
  return banner;
}

/**
 * Fetch a team by ID.
 */
export async function fetchTeamById(
  id: string,
  accessToken?: string,
  simplified?: boolean
): Promise<Team | null> {
  const supabase = getSupabaseClient(accessToken).schema('teams');

  const { data, error } = await supabase.from('teams').select('*').eq('id', id).single();

  if (error) {
    console.error('Error fetching team by ID:', error.message);
    return null;
  }

  return normalizeTeam({
    ...data,
    logo: simplified ? undefined : await fetchTeamLogo(id, accessToken || ''),
  });
}

/**
 * Fetch a team by its handle.
 */
export async function fetchTeamByHandle(
  handle: string,
  accessToken?: string
): Promise<Team | null> {
  const supabase = getSupabaseClient(accessToken).schema('teams');

  const { data, error } = await supabase.from('teams').select('*').eq('handle', handle).single();

  if (error) {
    console.error('Error fetching team by handle:', error.message);
    return null;
  }

  return data ? normalizeTeam(data) : null;
}

/**
 * Fetch teams that a user is a part of.
 */
export async function fetchTeamsByUserId(userId: string, accessToken: string): Promise<Team[]> {
  const supabase = getSupabaseClient(accessToken).schema('teams');

  const { data, error } = await supabase
    .from('roles')
    .select('team:teams(*)')
    .eq('user_id', userId);

  if (error) throw new Error(error.message);

  return (data || []).map(row => normalizeTeam(row.team));
}

/**
 * Search teams by name, handle, headline, description.
 */
export async function searchTeams(
  query: string,
  filters?: {
    industry?: string[];
    minProjects?: number;
  },
  accessToken?: string
): Promise<Team[]> {
  const supabase = getSupabaseClient(accessToken).schema('teams');

  let request = supabase.from('teams').select('*');

  if (query) {
    request = request.or(
      `name.ilike.%${query}%,handle.ilike.%${query}%,headline.ilike.%${query}%,description.ilike.%${query}%`
    );
  }

  // Future: apply filters like industry or no. projects

  const { data, error } = await request;

  if (error) throw new Error(error.message);

  return (data || []).map(normalizeTeam);
}

/**
 * Add a new team.
 */
export async function addTeam(
  user: string,
  team: Omit<Team, 'createdAt'>,
  accessToken: string
): Promise<Team> {
  const supabase = getSupabaseClient(accessToken).schema('teams');

  const { data, error } = await supabase
    .rpc('create_team', {
      team,
      user_id: user,
    })
    .single();

  if (error) throw new Error(error.message);

  const logoArray = team.logo
    ? [team.logo.small, team.logo.med, team.logo.large].filter(Boolean)
    : [];

  if (team.banner) logoArray.push(team.banner);

  for (let i = 0; i < logoArray.length; i++)
    if (logoArray[i]) insertFile('user_uploads', logoArray[i] as Omit<Files, 'id'>, accessToken);

  return normalizeTeam(data);
}

/**
 * Update an existing team.
 */
export async function updateTeam(
  id: string,
  updates: Partial<Team>,
  accessToken: string
): Promise<Team> {
  const supabase = getSupabaseClient(accessToken).schema('teams');

  const { data, error } = await supabase
    .from('teams')
    .update({
      name: updates.name,
      handle: updates.handle,
      logo: updates.logo,
      banner: updates.banner,
      description: updates.description,
      headline: updates.headline,
      links: updates.links,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return normalizeTeam(data);
}

/**
 * Delete a team by ID.
 */
export async function deleteTeam(id: string, accessToken: string): Promise<boolean> {
  const supabase = getSupabaseClient(accessToken).schema('teams');

  const { error } = await supabase.from('teams').delete().eq('id', id);

  if (error) throw new Error(error.message);

  return true;
}
