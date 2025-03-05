import { Handlers, PageProps } from '$fresh/server.ts';
import { Partial } from "$fresh/runtime.ts";
import ProfilePage from "../../../islands/profile/profile.tsx";
import { fetchUserByUsername } from "../../../lib/api/userApi.ts";
import { User } from "../../../lib/types/user.ts";

export const handler: Handlers<User | null> = {
    async GET(_req, ctx) {
        const user = await fetchUserByUsername(ctx.params.user)

        return ctx.render(user);
    },
};

export default function Profile(props: PageProps<User | null>) {

    return (
        <Partial name="profile">
        <div class="profile">
            {
                props.data? (
                    <div>
                        <ProfilePage user={props.data}/>
                    </div>
                ) :
                (
                    <div>
                        <h1>User Not Found :(</h1>
                    </div>
                )
                
            }
        </div>
        </Partial>
    );
}
