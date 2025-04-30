import { User } from '../../lib/newtypes/index.ts';
import AIcon, { Icons } from '../Icons.tsx';

export default function AccountsCard({ profile }: { profile: User }) {
  const switchUser = async () => {
    const body = new FormData();
    body.set('newAccountId', JSON.stringify(profile.id));

    const res = await fetch('/api/auth/switchUser', { method: 'POST', body });
    if (res.ok) location.assign('/');
  };

  return (
    <div class="other-account" onClick={switchUser}>
      <div class="account-contents">
        <div class="account-image">
          <img src={profile.profilePicture?.med?.publicURL} alt="User" />
        </div>
        <div class="account">
          <p class="account-name">
            {profile.firstName} {profile.lastName}
          </p>
          <p class="account-username">@{profile.username}</p>
        </div>
      </div>
      <div class="account-options">
        <AIcon className="account-options-icon" startPaths={Icons.DotMenu} />
      </div>
    </div>
  );
}
