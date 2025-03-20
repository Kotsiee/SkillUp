import { Partial } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import EditProfile from "../../../islands/profile/edit.tsx";
import { fetchUserByUsername } from "../../../lib/api/user/user.ts";
import { User } from "../../../lib/types/index.ts";

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
            <EditProfile />
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
