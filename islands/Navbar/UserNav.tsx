import { PageProps } from "$fresh/server.ts";
import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import AIcon, { Icons } from "../../components/Icons.tsx";
import { getNavbarState, toggleNavbar } from "./utils.ts";
import ProfileModal from "./ProfileModal.tsx";
import UserSideNav from "./SideNav.tsx";
import { User } from "../../lib/types/index.ts";

export default function UserNavbar(
  { pageProps, user }: { pageProps: PageProps; user: User },
) {
  if (!user) return null;

  const isNavbarOpen = useSignal<boolean>(getNavbarState());
  const openProfileModal = useSignal<boolean>(false);

  return (
    <nav>
      <div class="nav user-nav">
        {/* Left Section */}
        <div class="nav-list nav-left">
          <AIcon
            className="navMenuIcon"
            size={16}
            startPaths={Icons.Menu}
            endPaths={Icons.X}
            onClick={() => toggleNavbar(isNavbarOpen)}
          />
          <a href="/">DuckTasks</a>
        </div>

        {/* Center Section - Search */}
        <div class="nav-list nav-center">
          <div class="nav-search">
            <AIcon className="search-btn" startPaths={Icons.Search} />
            <input class="search-input" type="text" placeholder="Search..." />
          </div>
        </div>

        {/* Right Section - User Profile */}
        <div class="nav-list nav-right">
          <div class="user-options">
            <img
              onClick={() => openProfileModal.value = !openProfileModal.value}
              class="profilePic"
              src={user?.profilePicture?.small?.publicURL}
              alt="Profile"
            />
            <ProfileModal isOpen={openProfileModal} user={user} />
          </div>
        </div>
      </div>

      {/* Side Navigation for Logged-in Users */}
      <UserSideNav
        pageProps={pageProps}
        isNavbarOpen={isNavbarOpen}
      />
    </nav>
  );
}
