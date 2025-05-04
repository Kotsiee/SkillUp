import AIcon from '../../components/Icons.tsx';
import { Icons } from '../../components/Icons.tsx';
import { useSignal } from 'https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js';
import { useProfile } from '../contexts/ProfileProvider.tsx';
import RichText from '../../components/UI/RichText.tsx';

export default function ProfilePage() {
  const { profile } = useProfile();

  if (!profile) return null;

  const tab = useSignal<string>('posts');
  const account = profile.profile;

  return (
    <div class="view-profile" role="main" aria-label="User profile">
      <section class="view-profile__banner" aria-label="Profile banner">
        <img
          class="view-profile__banner-img"
          src={account.banner?.publicURL ?? '/assets/images/placeholders/Banner.webp'}
          alt="Profile banner"
        />
        <img
          class="view-profile__profile-img"
          src={account.logo?.large?.publicURL ?? '/assets/images/placeholders/teams_med.webp'}
          alt="Profile logo"
          style={{
            borderRadius: profile.type === 'user' ? '50%' : '35px',
          }}
        />
      </section>

      <section class="view-profile__info" role="region" aria-labelledby="user-info-heading">
        <div class="view-profile__info-container">
          <div class="view-profile__info-content">
            <div class="view-profile__details">
              <h3 id="user-info-heading" class="view-profile__name">
                {account.name}
              </h3>
              <p class="view-profile__handle">@{account.handle}</p>
              <p class="view-profile__headline">{account.headline}</p>
            </div>

            <div class="view-profile__actions" role="group" aria-label="User interaction buttons">
              <button
                class="view-profile__button view-profile__button--connect"
                aria-label="Connect with user"
              >
                Connect
              </button>
              <button
                class="view-profile__button view-profile__button--message"
                aria-label="Send message to user"
              >
                Message
              </button>
            </div>
          </div>

          <div class="view-profile__more-actions">
            <div class="view-profile__more-actions-container">
              <AIcon startPaths={Icons.DotMenu} aria-label="More options" />
            </div>
          </div>
        </div>
      </section>

      <section class="view-profile__about" role="region" aria-labelledby="about-section-heading">
        <h5 id="about-section-heading">About</h5>
        {account.bio && <RichText jsonText={account.bio} />}
        {profile.account?.meta?.languages && <h5>Languages</h5>}

        {profile.account?.meta?.skills && <h5>Skills</h5>}
      </section>

      <section class="view-profile__activity" role="region" aria-labelledby="activity-heading">
        <div class="view-profile__activity-select">
          <h5 id="activity-heading" class="visually-hidden">
            Activity
          </h5>
          <ul class="view-profile__tab-list" role="tablist" aria-label="Profile activity tabs">
            {['posts', 'projects', 'experience', 'teams'].map(id => (
              <li key={id}>
                <label for={id} role="presentation">
                  <input
                    type="radio"
                    name="activity-select"
                    id={id}
                    value={id}
                    hidden
                    checked={tab.value === id}
                    onChange={val => {
                      tab.value = val.currentTarget.value;
                    }}
                    role="tab"
                    aria-selected={tab.value === id}
                    aria-controls={`tab-panel-${id}`}
                  />
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </label>
              </li>
            ))}
          </ul>

          <div class="view-profile__filters" role="group" aria-label="Filter and search">
            <AIcon
              startPaths={Icons.Search}
              size={20}
              className="view-profile__search-icon"
              aria-label="Search activity"
            />
            <AIcon
              startPaths={Icons.Filter}
              size={20}
              className="view-profile__filter-icon"
              aria-label="Filter activity"
            />
          </div>
        </div>

        <div
          class="view-profile__activity-content"
          id={`tab-panel-${tab.value}`}
          role="tabpanel"
          aria-labelledby={tab.value}
        >
          <ActivityTab tab={tab.value} />
        </div>
      </section>
    </div>
  );
}

const ActivityTab = (props: { tab: string }) => {
  switch (props.tab) {
    case 'posts':
      return <div class="actvity-posts">Posts</div>;
    case 'projects':
      return <div class="actvity-projects">Projects</div>;
    case 'experience':
      return <div class="actvity-experience">XP</div>;
    case 'teams':
      return <div class="actvity-teams">Teams</div>;

    default:
      return null;
  }
};
