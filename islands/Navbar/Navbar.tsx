import { PageProps } from "$fresh/server.ts";
import { useUser } from "../contexts/UserProvider.tsx";
import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import AIcon, { Icons } from "../../components/Icons.tsx";
import { getNavbarState, toggleNavbar } from "./utils.ts";
import ProfileModal from "./ProfileModal.tsx";
import UserSideNav from "./SideNav.tsx";

export default function NavBar({ pageProps }: { pageProps: PageProps }) {
  const { user } = useUser();
  const openProfileModal = useSignal<boolean>(false);
  const isNavbarOpen = useSignal<boolean>(getNavbarState());

  return (
    <div>
      <link rel="stylesheet" href="/styles/islands/navbar.css" />
      <style>{`:root { --header-side-width-desktop: ${isNavbarOpen.value ? 300 : 76}px; }`}</style>

      <nav>
        <div class={`nav ${user ? "user-nav" : "guest-nav"}`}>
          {/* Left Section */}
          <div class="nav-list nav-left">
            <AIcon className="navMenuIcon" size={16} startPaths={Icons.Menu} endPaths={Icons.X} onClick={() => toggleNavbar(isNavbarOpen)} />
            <a href="/">DuckTasks</a>
          </div>

          {/* Center Section - Search */}
          {user && (
            <div class="nav-list nav-center">
              <div class="nav-search">
                <AIcon className="search-btn" startPaths={Icons.Search} />
                <input class="search-input" type="text" placeholder="Search..." />
              </div>
            </div>
          )}

          {/* Right Section - User Profile */}
          <div class="nav-list nav-right">
            {user ? (
              <div class="user-options">
                <img onClick={() => openProfileModal.value = !openProfileModal.value} class="profilePic" src={user?.profilePicture?.small?.publicURL} alt="Profile" />
                <ProfileModal isOpen={openProfileModal} user={user} />
              </div>
            ) : (
              <ul>
                <li><a href="/account/login">Log In</a></li>
                <li><a href="/account/signup">Sign Up</a></li>
              </ul>
            )}
          </div>
        </div>

        {/* Side Navigation for Logged-in Users */}
        {user && <UserSideNav pageProps={pageProps} isNavbarOpen={isNavbarOpen} />}
      </nav>
    </div>
  );
}
