import { AccountProfile } from '../../lib/types/index.ts';

export default function ProfileLayout({ account }: { account: AccountProfile | null }) {
  if (!account) return null;

  return (
    <div>
      <ul class="profile-nav">
        <li>
          <a
            href={`/${account.profile.handle}/view`}
            f-partial={`/${account.profile.handle}/partial/view`}
          >
            View
          </a>
        </li>
        <li>
          <a
            href={`/${account.profile.handle}/edit`}
            f-partial={`/${account.profile.handle}/partial/edit`}
          >
            Edit
          </a>
        </li>
        <li>
          <a
            href={`/${account.profile.handle}/manage`}
            f-partial={`/${account.profile.handle}/partial/manage`}
          >
            Manage
          </a>
        </li>
      </ul>
    </div>
  );
}
