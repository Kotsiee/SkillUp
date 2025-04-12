import { defineLayout } from '$fresh/server.ts';
import ProfileLayout from '../../islands/profile/layout.tsx';
import { fetchProfile } from '../../lib/api/misc/profile.ts';

export default defineLayout(async (req, ctx) => {
  const account = await fetchProfile(ctx.params.user);
  (ctx.state! as any).account = account;

  return (
    <div class="layout">
      <link rel="stylesheet" href="/styles/pages/profile/profile.css" />
      <ProfileLayout account={account} />
      <ctx.Component />
    </div>
  );
});
