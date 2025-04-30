import { useEffect, useState } from 'preact/hooks';
import { TeamRoles, User } from '../../../lib/types/index.ts';
import { BusinessProfile, PersonalProfile } from './Profile.tsx';
import { useSignal } from '@preact/signals';

export function PersonalProfiles() {
  const [profiles, setProfiles] = useState<User[]>([]);

  useEffect(() => {
    fetch('/api/auth/switchUser')
      .then(res => res.json())
      .then(setProfiles)
      .catch(err => console.error('Failed to fetch users', err));
  }, []);

  return (
    <div class="personal-profiles">
      {profiles.map(profile => (
        <PersonalProfile profile={profile} />
      ))}
    </div>
  );
}

export function BusinessProfiles({ user }: { user: User }) {
  const roles = useSignal<TeamRoles[]>([]);

  useEffect(() => {
    fetch('/api/teams/user', {
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => {
        roles.value = data;
        console.log(data);
      });
  }, []);

  return (
    <div class="business-profiles">
      <PersonalProfile
        profile={user}
        onClick={async () => {
          await fetch(`/api/teams/logout`, { method: 'POST' });
          globalThis.location.reload();
        }}
      />

      {roles.value &&
        roles.value.map(team =>
          ['owner', 'co-owner', 'manager'].includes(team.role) ? (
            <BusinessProfile profile={team} />
          ) : null
        )}
    </div>
  );
}
