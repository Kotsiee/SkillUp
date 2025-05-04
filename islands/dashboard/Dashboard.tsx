import { Team } from '../../lib/newtypes/index.ts';
import { useUser } from '../contexts/UserProvider.tsx';
import { TeamDashboard } from './TeamDashboard.tsx';
import { UserDashboard } from './UserDashboard.tsx';

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
