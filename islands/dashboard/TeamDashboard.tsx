import { DashboardProfile } from '../../components/pages/dashboard/views/profile.tsx';
import DashboardTeamProjects from '../../components/pages/dashboard/views/teamsProjects.tsx';
import { DashboardWallet } from '../../components/pages/dashboard/views/wallets.tsx';
import { Team } from '../../lib/newtypes/index.ts';

export function TeamDashboard({ team }: { team: Team }) {
  return (
    <div class="team-dashboard">
      <div class="dashboard__header">
        <h1 class="dashboard__header-wb">WELCOME BACK</h1>
        <h1 class="dashboard__header-name">{team.name}!</h1>
      </div>

      <div class="dashboard__content">
        <DashboardWallet />
        <DashboardProfile />
        <DashboardTeamProjects projects={[]} />
        <div class="dashboard__content__notifications">
          <h4 class="dashboard__content__notifications-title dashboard__content-title">
            Notifications
          </h4>
        </div>
      </div>
    </div>
  );
}
