import { User, TeamRoles } from "../../../lib/types/index.ts";

export function PersonalProfile({ profile, onClick }: { profile: User; onClick?: () => void }) {
  const switchUser = async () => {
    const body = new FormData();
    body.set("newAccountId", JSON.stringify(profile.id));
    await fetch('/api/auth/switchUser', { method: 'POST', body });
    globalThis.location.assign('/');
  };

  return (
    <div class="other-profile" onClick={onClick ?? switchUser}>
      <div class="profile-image">
        <img src={profile.profilePicture?.small?.publicURL} alt="Profile Picture" />
      </div>
      <div class="account">
        <p class="account-name">{profile.firstName} {profile.lastName}</p>
        <p class="account-username">@{profile.username}</p>
        <p class="account-type">Personal Account</p>
      </div>
    </div>
  );
}

export function BusinessProfile({ profile }: { profile: TeamRoles }) {
    const setTeam = async () => {
      await fetch(`/api/teams/${profile.team!.id}/login`, { method: "POST" });
      globalThis.location.reload();
    };
  
    return (
      <div class="business-profile other-profile" onClick={setTeam}>
        <div class="profile-image">
          <img
            src={profile.team?.logo?.small?.publicURL ?? "/assets/images/audio.png"}
            alt="Team Logo"
          />
        </div>
        <div class="account">
          <p class="account-name">{profile.team?.name}</p>
          <p class="account-username">@{profile.team?.name}</p>
          <p class="account-type">{profile.role[0].toUpperCase() + profile.role.slice(1)}</p>
        </div>
      </div>
    );
  }