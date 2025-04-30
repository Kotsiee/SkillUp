import { PageProps } from '$fresh/server.ts';
import { Signal } from 'https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js';
import AIcon, { Icons } from '../../components/Icons.tsx';

const navLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: Icons.Dashboard },
  { name: 'Messages', path: '/messages', icon: Icons.Messages },
  { name: 'Explore', path: '/explore', icon: Icons.Search },
  { name: 'Projects', path: '/projects', icon: Icons.Projects },
  { name: 'Files', path: '/files', icon: Icons.Filter },
  { name: 'Teams', path: '/teams', icon: Icons.Filter },
];

export default function UserSideNav({
  pageProps,
  isNavbarOpen,
}: {
  pageProps: PageProps;
  isNavbarOpen: Signal<boolean>;
}) {
  const currentRoute = pageProps.route.split('/')[1];

  return (
    <div class="user-nav-side">
      <ul>
        {navLinks.map(({ name, path, icon }) => (
          <li class={`${currentRoute === path.substring(1) ? 'active' : ''} nav-btn-link`}>
            <a href={path}>
              <AIcon startPaths={icon} />
            </a>
            <label>{name}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}
