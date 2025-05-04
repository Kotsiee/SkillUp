import { useSignal } from 'https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js';
import { User } from '../../../lib/newtypes/index.ts';
import { signOut } from '../utils.ts';
import { BusinessProfiles, PersonalProfiles } from './Profiles.tsx';

export default function UserSwitch({ user }: { user: User }) {
  const profileType = useSignal<'Business' | 'Personal'>('Business');

  return (
    <div class="profiles">
      <div class="profile-type">
        <label>
          <input
            type="radio"
            name="profile-type-switch"
            checked={profileType.value === 'Business'}
            onInput={() => (profileType.value = 'Business')}
            hidden
          />
          Business
        </label>
        <label>
          <input
            type="radio"
            name="profile-type-switch"
            checked={profileType.value === 'Personal'}
            onInput={() => (profileType.value = 'Personal')}
            hidden
          />
          Personal
        </label>
      </div>

      <button class="view-all">View All</button>

      <div class="view-profiles">
        {profileType.value === 'Business' ? <BusinessProfiles user={user} /> : <PersonalProfiles />}
      </div>

      <div class="other-actions">
        <a class="add-account" href="/account/login">
          + Add Account
        </a>
        <button class="logout" onClick={() => signOut()}>
          Log Out
        </button>
      </div>
    </div>
  );
}
