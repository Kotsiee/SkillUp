import { useEffect, useState } from "preact/hooks";
import { User } from "../../../lib/types/index.ts";
import { BusinessProfile, PersonalProfile } from "./Profile.tsx";

export function PersonalProfiles() {
  const [profiles, setProfiles] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/auth/switchUser")
      .then((res) => res.json())
      .then(setProfiles)
      .catch((err) => console.error("Failed to fetch users", err));
  }, []);

  return (
    <div class="personal-profiles">
      {profiles.map((profile) => <PersonalProfile profile={profile} />)}
    </div>
  );
}

export function BusinessProfiles({ user }: { user: User }) {
  return (
    <div class="business-profiles">
      <PersonalProfile
        profile={user}
        onClick={async () => {
          await fetch(`/api/teams/logout`, { method: "POST" });
          globalThis.location.reload();
        }}
      />
      {user.teams?.map((team) =>
        ["Owner", "Co-owner", "Manager"].includes(team.role)
          ? <BusinessProfile profile={team} />
          : null
      )}
    </div>
  );
}
