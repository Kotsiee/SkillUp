// deno-lint-ignore-file no-explicit-any
import { supabase } from '../../supabase/client.ts';
import { AccountProfile, Team, User } from '../../types/index.ts';
import { fetchTeamByID } from '../teams/teams.ts';
import { fetchUserByID } from '../user/user.ts';

export async function fetchProfile(handle: string): Promise<AccountProfile | null> {
  const { data, error } = await supabase
    .rpc('search_identities', {
      query: handle,
    })
    .single();

  if (error) {
    console.log('fetchUserByUsername: error was found :( - ' + error.message);
    return null;
  }

  const d = data as any;
  let accountType: any;

  if (d.type === 'team') accountType = await fetchTeamByID(d.id);
  else if (d.type === 'user') accountType = await fetchUserByID(d.id);

  if (!accountType) return null;

  const profile = {
    type: d.type,
    account: accountType as User | Team,
    profile: {
      name: accountType.name ?? `${accountType.firstName} ${accountType.lastName}`,
      handle: accountType.handle ?? accountType.username,
      logo: accountType.logo ?? accountType.profilePicture,
      banner: accountType.banner,
      bio: accountType.description ?? accountType.bio,
      links: accountType.links ?? undefined,
    },
  };

  return profile;
}
