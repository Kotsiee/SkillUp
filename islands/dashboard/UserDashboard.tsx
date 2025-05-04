import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { User } from '../../lib/newtypes/index.ts';
import { DashboardWallet } from '../../components/pages/dashboard/views/wallets.tsx';
import { DashboardProfile } from '../../components/pages/dashboard/views/profile.tsx';
import DashboardUserProjects from './../../components/pages/dashboard/views/userProjects.tsx';

export function UserDashboard({ user }: { user: User }) {
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
        <DashboardWallet />
        <DashboardProfile />
        <DashboardUserProjects projects={projects.value} />
        <div class="dashboard__content__notifications">
          <h4 class="dashboard__content__notifications-title dashboard__content-title">
            Notifications
          </h4>
        </div>
      </div>
    </div>
  );
}
