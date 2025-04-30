import { Signal } from '@preact/signals';
import { User } from '../../../lib/newtypes/index.ts';
import AccountsCard from '../../../components/cards/AccountsCards.tsx';

export default function LoginWithAccount({
  profiles,
  loginSection,
}: {
  profiles: User[] | null;
  loginSection: Signal<string>;
}) {
  if (!profiles) return null;

  return (
    <div class="loginWithAccount">
      <h4>Already Logged In</h4>
      {profiles.map(profile => (
        <AccountsCard profile={profile} />
      ))}
      <button class="add-account" onClick={() => (loginSection.value = 'withProvider')}>
        + Add Account
      </button>
    </div>
  );
}
