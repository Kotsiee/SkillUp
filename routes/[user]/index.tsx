import { Handlers, PageProps } from "$fresh/server.ts";
import { fetchUserByUsername } from "../../lib/api/userApi.ts";
import { User } from "../../lib/types/index.ts";
import ProfilePage from "../../islands/profile/profile.tsx";
import { Partial } from "$fresh/runtime.ts";

export const handler: Handlers<User | null> = {
  async GET(_req, ctx) {
    const user = await fetchUserByUsername(ctx.params.user);

    return ctx.render(user);
  },
};

export default function Profile(props: PageProps<User | null>) {
  return (
    <Partial name="profile">
      {props.data
        ? (
          <div>
            <ProfilePage user={props.data} />
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
