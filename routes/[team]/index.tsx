import { Handlers, PageProps } from "$fresh/server.ts";
import { User } from "../../lib/types/index.ts";
import ProfilePage from "../../islands/profile/profile.tsx";
import { Partial } from "$fresh/runtime.ts";
import { fetchOrganisationByID } from "../../lib/api/organisationApi.ts";
import { Organisation } from './../../lib/types/index.ts';

export const handler: Handlers<Organisation | null> = {
  async GET(_req, ctx) {
    const user = await fetchOrganisationByID(ctx.params.team);

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
