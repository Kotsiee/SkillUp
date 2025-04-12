// deno-lint-ignore-file no-explicit-any
import { DateTime } from 'https://esm.sh/luxon@3.5.0';
import { supabase } from '../../supabase/client.ts';
import { Team, TeamRoles, User } from '../../types/index.ts';

export async function fetchTeams(): Promise<Team[] | null> {
  const { data, error } = await supabase.schema('teams').from('teams').select('*');

  if (error) {
    console.log('fetchTeams: error was found :( - ' + error.message);
    return null;
  }

  const Teams: Team[] = await Promise.all(
    data.map(d => {
      return {
        id: d.id,
        name: d.name,
        handle: d.handle,
        description: d.description,
        links: d.links,
        createdAt: DateTime.fromISO(d.created_at),
      };
    })
  );

  return Teams;
}

export async function fetchTeamByID(id: string, simplify?: boolean): Promise<Team | null> {
  const { data, error } = await supabase
    .schema('teams')
    .from('teams')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.log('fetchTeamByID: error was found :( - ' + error.message);
    return null;
  }

  const Teams: Team = {
    id: data.id,
    name: data.name,
    handle: data.handle,
    createdAt: DateTime.fromISO(data.created_at),
  };

  if (!simplify) {
    Teams.logo = {
      small: {
        publicURL:
          'https://media.wired.com/photos/65382632fd3d190c7a1f5c68/master/w_2560%2Cc_limit/Google-Image-Search-news-Gear-GettyImages-824179306.jpg',
      },
      med: {
        publicURL:
          'https://media.wired.com/photos/65382632fd3d190c7a1f5c68/master/w_2560%2Cc_limit/Google-Image-Search-news-Gear-GettyImages-824179306.jpg',
      },
      large: {
        publicURL:
          'https://media.wired.com/photos/65382632fd3d190c7a1f5c68/master/w_2560%2Cc_limit/Google-Image-Search-news-Gear-GettyImages-824179306.jpg',
      },
    };

    Teams.banner = {
      publicURL:
        'https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg',
    };
    Teams.description = data.description;
    Teams.links = data.links;
    Teams.description = data.description;
  }

  return Teams;
}

export async function newTeam(
  team: Team,
  users: string,
  accessToken: string
): Promise<Team | null> {
  const { data, error } = await supabase
    .schema('teams')
    .from('teams')
    .insert([
      {
        id: crypto.randomUUID(),
        name: team.name,
        handle: team.handle,
        headline: team.headline,
        description: team.description,
      },
    ])
    .select('*')
    .single();

  if (error) {
    console.log('newTeam: error was found :( - ' + error.message);
    return null;
  }

  const role = {
    user: { id: users },
    team: { id: data.id },
    role: 'owner',
  };

  const rr = await newRole(role as TeamRoles);
  console.log(rr);

  return data;
}

export async function newRole(role: TeamRoles): Promise<TeamRoles | null> {
  const { data, error } = await supabase
    .schema('teams')
    .from('roles')
    .insert([
      {
        id: crypto.randomUUID(),
        user_id: role.user?.id,
        team_id: role.team?.id,
        role: role.role,
      },
    ])
    .select('*')
    .single();

  if (error) {
    console.log('newRole: error was found :( - ' + error.message);
    return null;
  }

  return data;
}
