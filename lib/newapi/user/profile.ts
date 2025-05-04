import { Profile } from '../../newtypes/index.ts';
import { getSupabaseClient } from '../../supabase/client.ts';
import { fetchTeamBanner, fetchTeamLogo } from '../teams/teams.ts';
import { normalizeProfile } from './../../newtypes/misc/profile.ts';
import { fetchAvatar, fetchBanner } from './user.ts';

export async function fetchProfileByHandle(
  handle: string,
  accessToken: string
): Promise<Profile | null> {
  const supabase = getSupabaseClient(accessToken).schema('public');

  const { data, error } = await supabase.rpc('search_profile_by_handle', {
    handle_input: handle,
  });

  if (error) {
    console.error('fetchProfileByHandle RPC error:', error.message);
    return null;
  }

  return normalizeProfile({
    ...data,
    logo:
      data.type === 'team'
        ? await fetchTeamLogo(data.account.id, accessToken)
        : await fetchAvatar(data.account.id, accessToken),
    banner:
      data.type === 'team'
        ? await fetchTeamBanner(data.account.id, accessToken)
        : await fetchBanner(data.account.id, accessToken),
  });
}
