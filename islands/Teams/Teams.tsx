import { useSignal } from '@preact/signals';
import { Team, TeamRoles, User } from '../../lib/newtypes/index.ts';
import { useUser } from '../contexts/UserProvider.tsx';
import { useEffect } from 'preact/hooks';

export default function TeamsIsland() {
  const { user } = useUser();

  const roles = useSignal<TeamRoles[] | null>(null);

  useEffect(() => {
    fetch('/api/teams/user', {
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => {
        roles.value = data;
      });
  }, []);

  return (
    <div class="teams">
      <div class="top">
        <div class="switch-account">
          <div class="details">
            <img class="profilePic" src={user?.profilePicture?.small?.publicURL} />
            <div class="account">
              <p class="username">{user?.username}</p>
              <p class="type">Personal Account</p>
            </div>
          </div>
        </div>

        <a class="new-team" href={'/teams/create'} f-partial={'/teams/partials/create'}>
          + New Team
        </a>
      </div>

      <div class="teams-content">
        <div class="teams-list">
          {roles.value?.map(role => (
            <TeamsCard role={role} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TeamsCard({ role }: { role: TeamRoles }) {
  const team = role.team! as Team;

  return (
    <a class="team-card" href={`/${team.handle}`} f-client-nav={false}>
      <div class="team-images">
        <img class="banner" src={team.banner?.publicURL} />
        <img class="profilePic" src={team.logo?.small?.publicURL} />
      </div>

      <div class="team-details">
        <div class="deets">
          <div>
            <p class="name">{team.name}</p>
            <p class="handle">@{team.handle}</p>
          </div>
          <p class="role">{role.role}</p>
        </div>
      </div>
    </a>
  );
}
