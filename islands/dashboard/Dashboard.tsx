import AIcon, { Icons } from '../../components/Icons.tsx';
import { Team, User } from '../../lib/newtypes/index.ts';
import { useUser } from '../contexts/UserProvider.tsx';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { UserProjectCard } from '../../components/pages/dashboard/projects/userProjectCard.tsx';

export default function Dashboard() {
  const { user, team } = useUser();

  if (!user && !team) return <div>Loading...</div>;

  return (
    <div class="dashboard">
      {user && !team ? (
        <UserDashboard user={user} />
      ) : team ? (
        <TeamDashboard team={team} />
      ) : (
        <div>No User, please login</div>
      )}
    </div>
  );
}

function UserDashboard({ user }: { user: User }) {
  const projects = useSignal([]);

  useEffect(() => {
    fetch('/api/projects/user/projects', {
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error('Error fetching projects:', data.error);
        } else {
          console.log('Fetched projects:', data);
          projects.value = data;
        }
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
      });
  }, []);

  return (
    <div class="user-dashboard">
      <div class="dashboard__header">
        <h2 class="dashboard__header-wb">WELCOME BACK</h2>
        <h1 class="dashboard__header-name">{user.firstName.toUpperCase()}!</h1>
      </div>

      <div class="dashboard__content">
        <div class="dashboard__content__wallet">
          <h4 class="dashboard__content__wallet-title dashboard__content-title">Wallet</h4>
          <div class="dashboard__content__wallet-content dashboard__content-content">
            <div class="dashboard__content__wallet-content__balance">
              <p class="dashboard__content__wallet-content__balance-title content-title">Balance</p>
              <p class="dashboard__content__wallet-content__balance-amount content-amount">
                £0.00<span class="content-currency">GBP</span>
              </p>
            </div>

            <div class="dashboard__content__wallet-content__earnings">
              <p class="dashboard__content__wallet-content__earnings-title content-title">
                This Months Earnings
              </p>
              <p class="dashboard__content__wallet-content__earnings-amount content-amount">
                £0.00<span class="content-currency">GBP</span>
              </p>
              <p class="dashboard__content__wallet-content__earnings-growth positive">0.00%</p>
            </div>
          </div>
        </div>
        <div class="dashboard__content__profile">
          <h4 class="dashboard__content__profile-title dashboard__content-title">Profile</h4>

          <div class="dashboard__content__profile-content dashboard__content-content">
            <div class="dashboard__content__profile-content__balance">
              <p class="dashboard__content__profile-content__balance-title content-title">
                Connections
              </p>
              <p class="dashboard__content__profile-content__balance-amount content-amount">73</p>
            </div>

            <div class="dashboard__content__profile-content__earnings">
              <p class="dashboard__content__profile-content__earnings-title content-title">Views</p>
              <p class="dashboard__content__profile-content__earnings-amount content-amount">210</p>
            </div>
          </div>
        </div>
        <div class="dashboard__content__projects">
          <h4 class="dashboard__content__projects-title dashboard__content-title">Projects</h4>
          {/*Change Views*/}
          <div class="dashboard__content__projects-content">
            <div class="dashboard__content__projects-content-views">
              <div class="dashboard__content__projects-content__history">
                <label class="dashboard__content__projects-content__history-input">
                  <input type="radio" name="projects-history" value="ongoing" checked hidden />
                  Ongoing
                </label>
                <label class="dashboard__content__projects-content__history-input">
                  <input type="radio" name="projects-history" value="completed" hidden />
                  Completed
                </label>
              </div>
              <div class="dashboard__content__projects-content__views">
                <label class="dashboard__content__projects-content__views-input">
                  <input type="radio" name="projects-views" value="ongoing" checked hidden />
                  <AIcon startPaths={Icons.Filter} />
                </label>
                <label class="dashboard__content__projects-content__views-input">
                  <input type="radio" name="projects-views" value="completed" hidden />
                  <AIcon startPaths={Icons.Filter} />
                </label>
              </div>
            </div>
            {/*View Projects*/}
            <div class="dashboard__content__projects-content__projects">
              {projects.value.map((project: any) => (
                <UserProjectCard project={project} />
              ))}
            </div>
          </div>
        </div>
        <div class="dashboard__content__notifications">
          <h4 class="dashboard__content__notifications-title dashboard__content-title">
            Notifications
          </h4>
        </div>
      </div>
    </div>
  );
}

function TeamDashboard({ team }: { team: Team }) {
  return (
    <div class="team-dashboard">
      <div class="dashboard__header">
        <h1 class="dashboard__header-wb">WELCOME BACK</h1>
        <h1 class="dashboard__header-name">{team.name}!</h1>
      </div>
    </div>
  );
}
