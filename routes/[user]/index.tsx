import { Handlers, PageProps } from "$fresh/server.ts";
import ProfilePage from "../../islands/profile/profile.tsx";
import { Partial } from "$fresh/runtime.ts";
import { AccountProfile, Team, User } from "../../lib/types/index.ts";
import { fetchProfile } from "../../lib/api/misc/profile.ts";

export const handler: Handlers<AccountProfile | null | undefined> = {
  async GET(_req, ctx) {
    const account = await fetchProfile(ctx.params.user);

    return ctx.render(account);
  },
};

export default function Profile(props: PageProps<AccountProfile | null | undefined>) {
  console.log(props.data)
  return (
    <Partial name="profile">
      {props.data
        ? (
          <div>
            <ProfilePage account={props.data} />
          </div>
        )
        : (
          <div>
            <h1>User Not Found :(</h1>
          </div>
        )}
    </Partial>
  );
}
