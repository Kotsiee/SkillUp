import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { useUser } from "../contexts/UserProvider.tsx";
import { TeamRoles, User } from "../../lib/types/index.ts";

export default function TeamsIsland() {
  const { user } = useUser();

  return (
    <div class="teams">
      <div class="top">
        <div class="switch-account">
          <div class="details">
            <img
              class="profilePic"
              src={user?.profilePicture?.small?.publicURL}
            />
            <div class="account">
              <p class="username">{user?.username}</p>
              <p class="type">Personal Account</p>
            </div>
          </div>
        </div>

        <button class="new-team">+ New Team</button>
      </div>

      <div class="teams-content">
        <TeamsList user={user} />
      </div>
    </div>
  );
}

function TeamsList({ user }: { user: User }) {
  if (!user) return null;

  const teams = useSignal<TeamRoles[] | null>(
    user.teams ?? null,
  );

  console.log(teams.value)

  return (
    <div class="teams-list">
      {teams.value?.map((team) => 
        <TeamsCard team={team} />
      )}
    </div>
  );
}

function TeamsCard({ team }: { team: TeamRoles }) {
  return (
    <div class="team-card">
      <div class="team-images">
        <img class="banner" src={team.team?.banner?.publicURL}/>
        <img class="profilePic" src={team.team?.logo?.small?.publicURL}/>
      </div>

      <div class="team-details">
        <div class="deets">
          <div>
            <p class="name">{team.team?.name}</p>
            <p class="handle">@{team.team?.handle}</p>
          </div>
          <p class="role">{team.role}</p>
        </div>

        <div>
          <p class="members">3 Members</p>
          <p class="projects">5 Projects</p>
        </div>
      </div>
    </div>
  );
}
