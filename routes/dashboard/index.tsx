import { PageProps } from '$fresh/server.ts';
import Dashboard from '../../islands/dashboard/Dashboard.tsx';

export default function DashboardPage(props: PageProps) {
  return (
    <div>
      <link rel="stylesheet" href="/styles/pages/dashboard.css" />
      <Dashboard />
    </div>
  );
}
