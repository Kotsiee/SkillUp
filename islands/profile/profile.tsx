import AIcon from "../../components/Icons.tsx";
import { Icons } from "../../components/Icons.tsx";
import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import type { User } from "../../lib/types/index.ts";

export default function ProfilePage({ user }: { user: User }) {
  const tab = useSignal<string>("posts");

  return (
    <div>
      <ul class="profile-nav">
        <li>
          <a
            href={`/${user.username}/view`}
            f-partial={`/${user.username}/partial/view`}
          >
            View
          </a>
        </li>
        <li>
          <a
            href={`/${user.username}/edit`}
            f-partial={`/${user.username}/partial/edit`}
          >
            Edit
          </a>
        </li>
        <li>
          <a
            href={`/${user.username}/manage`}
            f-partial={`/${user.username}/partial/manage`}
          >
            Manage
          </a>
        </li>
      </ul>
      <div class="profileLayout">
        <section class="banner">
          <img
            class="banner-img"
            src="https://letsenhance.io/static/a31ab775f44858f1d1b80ee51738f4f3/11499/EnhanceAfter.jpg"
          />
          <img
            class="profile-img"
            src={user.profilePicture?.large?.publicURL}
          />
        </section>
        <section class="user-info">
          <div class="user-info-container">
            <div class="contents">
              <div class="details">
                <h3>{`${user.firstName} ${user.lastName}`}</h3>
                <p>@{user.username}</p>
                <p>
                  Software Developer | C#, Unity, C++, Unreal | Tech Enthusiast
                </p>
              </div>

              <div class="actions">
                <button class="connect">Connect</button>
                <button class="message">Message</button>
              </div>
            </div>

            <div class="additional-actions">
              <div class="additional-actions-container">
                <AIcon startPaths={Icons.DotMenu} />
              </div>
            </div>
          </div>
        </section>

        <section class="about">
          <h5>About</h5>
          <h5>Languages</h5>
          <h5>Skills</h5>
        </section>

        <section class="activity">
          <div class="select">
            <ul class="select-tab">
              <li>
                <input
                  type="radio"
                  name="activity-select"
                  id="posts"
                  value="posts"
                  hidden
                  checked={tab.value == "posts"}
                  onChange={(val) => {
                    tab.value = val.currentTarget.value;
                  }}
                />
                <label for="posts">Activity</label>
              </li>

              <li>
                <input
                  type="radio"
                  name="activity-select"
                  id="projects"
                  value="projects"
                  checked={tab.value == "projects"}
                  hidden
                  onChange={(val) => {
                    tab.value = val.currentTarget.value;
                  }}
                />
                <label for="projects">Projects</label>
              </li>

              <li>
                <input
                  type="radio"
                  name="activity-select"
                  id="experience"
                  value="experience"
                  checked={tab.value == "experience"}
                  hidden
                  onChange={(val) => {
                    tab.value = val.currentTarget.value;
                  }}
                />
                <label for="experience">Experience</label>
              </li>

              <li>
                <input
                  type="radio"
                  name="activity-select"
                  id="teams"
                  value="teams"
                  checked={tab.value == "teams"}
                  hidden
                  onChange={(val) => {
                    tab.value = val.currentTarget.value;
                  }}
                />
                <label for="teams">Teams</label>
              </li>
            </ul>

            <div class="filter">
              <AIcon
                startPaths={Icons.Search}
                size={20}
                className="search-icon"
              />
              <AIcon
                startPaths={Icons.Filter}
                size={20}
                className="filter-icon"
              />
            </div>
          </div>

          <div class="content">
            <ActivityTab tab={tab.value} />
          </div>
        </section>
      </div>
    </div>
  );
}

const ActivityTab = (props: { tab: string }) => {
  switch (props.tab) {
    case "posts":
      return <div class="actvity-posts">Posts</div>;
    case "projects":
      return <div class="actvity-projects">Projects</div>;
    case "experience":
      return <div class="actvity-experience">XP</div>;
    case "teams":
      return <div class="actvity-teams">Teams</div>;

    default:
      return <div class="actvity-teams">Teams</div>;
  }
};
