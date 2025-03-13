import { PageProps } from "$fresh/server.ts";
import {
  useSignal,
} from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import AIcon, { Icons } from "../components/Icons.tsx";
import { Ref, useRef } from "preact/hooks";
import { User } from "../lib/types/index.ts";
import { useUser } from "./contexts/UserProvider.tsx";

export default function NavBar({
  pageProps,
}: {
  pageProps: PageProps;
}) {
  const { user } = useUser();
  const navbarState = localStorage.getItem("navbarState") == "open";

  const openState = useSignal<boolean>(navbarState);
  const openState0 = useSignal<boolean>(false);

  const profileModal = useRef<HTMLDivElement>(null);

  const currentRoute = pageProps.route.split("/");
  const refs = useRef<{ [key: string]: AIcon | null }>({});
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClick = (key: string) => {
    refs.current[key]?.click();
  };

  return (
    <div>
      <link rel="stylesheet" href="/styles/islands/navbar.css" />
      <style>
        {`
                :root { --header-side-width-desktop: ${
          navbarState ? 300 : 60
        }px; }
            `}
      </style>

      {user
        ? (
          <nav>
            <div class="nav user-nav">
              <div class="nav-list nav-left">
                <AIcon
                  ref={(el) => (refs.current["r"] = el)}
                  className="navMenuIcon"
                  size={16}
                  startPaths={Icons.Menu}
                  endPaths={Icons.X}
                  initalState={navbarState}
                  onClick={(state) => {
                    if (state) {
                      menuRef.current?.classList.add("hidden");
                      document.documentElement.style.setProperty(
                        "--header-side-width-desktop",
                        "76px",
                      );
                      localStorage.setItem("navbarState", "closed");
                    } else {
                      menuRef.current?.classList.remove("hidden");
                      document.documentElement.style.setProperty(
                        "--header-side-width-desktop",
                        "300px",
                      );
                      localStorage.setItem("navbarState", "open");
                    }

                    openState.value = !state;
                  }}
                />
                <a href="/">DuckTasks</a>
              </div>

              <div class="nav-list nav-center">
                <div class="nav-search">
                  <AIcon
                    ref={(el) => (refs.current["search-btn"] = el)}
                    className="search-btn"
                    startPaths={Icons.Search}
                  />
                  <input class="search-input" type="text" />
                  <div class="search-type" onClick={() => handleClick("r0")}>
                    <p>People</p>
                    <AIcon
                      ref={(el) => (refs.current["r0"] = el)}
                      size={20}
                      className="chevron"
                      startPaths={Icons.DownChevron}
                      endPaths={Icons.UpChevron}
                    />
                  </div>
                </div>
              </div>

              <div class="nav-list nav-right">
                <div class="user-options">
                  <img
                    onClick={() => {
                      openState0.value = !openState0.value;

                      if (profileModal.current) {
                        profileModal.current.hidden = !profileModal.current
                          .hidden;
                        profileModal.current.focus();
                      }
                    }}
                    class="profilePic"
                    src={user?.profilePicture?.small?.publicURL}
                  />

                  <ProfileModal
                    r={profileModal}
                    user={user}
                  />
                </div>
              </div>
            </div>

            <div class="user-nav-side">
              <div class="container">
                <ul>
                  <li
                    class={`${
                      currentRoute[1] == "dashboard" ? "active" : ""
                    } nav-btn-link`}
                  >
                    <a href="/dashboard">
                      <AIcon startPaths={Icons.Filter} />
                    </a>
                    <label hidden={openState.value}>Dashboard</label>
                  </li>

                  <li
                    class={`${
                      currentRoute[1] == "messages" ? "active" : ""
                    } nav-btn-link`}
                  >
                    <a href="/messages">
                      <AIcon startPaths={Icons.Filter} />
                    </a>
                    <label hidden={openState.value}>Messages</label>
                  </li>

                  <li
                    class={`${
                      currentRoute[1] == "explore" ? "active" : ""
                    } nav-btn-link`}
                  >
                    <a href="/explore">
                      <AIcon startPaths={Icons.Search} />
                    </a>
                    <label hidden={openState.value}>Explore</label>
                  </li>

                  <li
                    class={`${
                      currentRoute[1] == "projects" ? "active" : ""
                    } nav-btn-link`}
                  >
                    <a href="/projects">
                      <AIcon startPaths={Icons.Filter} />
                    </a>
                    <label hidden={openState.value}>Projects</label>
                  </li>

                  <li
                    class={`${
                      currentRoute[1] == "files" ? "active" : ""
                    } nav-btn-link`}
                  >
                    <a href="/files">
                      <AIcon startPaths={Icons.Filter} />
                    </a>
                    <label hidden={openState.value}>Files</label>
                  </li>

                  <li
                    class={`${
                      currentRoute[1] == "teams" ? "active" : ""
                    } nav-btn-link`}
                  >
                    <a href="/teams">
                      <AIcon startPaths={Icons.Filter} />
                    </a>
                    <label hidden={openState.value}>Teams</label>
                  </li>
                </ul>
              </div>
            </div>

            <div class="search-modal"></div>

            <div class="settings-modal"></div>

            <div class="signout-modal"></div>
          </nav>
        )
        : (
          <nav class="nav guest-nav">
            <ul class="nav-list nav-left">
              <li class="nav-btn-link logo">
                <a href="/">DuckTasks</a>
              </li>
              <li class="nav-btn-link">
                <a href="/about">About</a>
              </li>
              <li class="nav-btn-link">
                <a href="#">Explore</a>
              </li>
            </ul>

            <ul class="nav-list nav-right">
              <li class="nav-btn-link">
                <a href="#">News</a>
              </li>
              <li class="nav-btn-link">
                <a href="#">Business</a>
              </li>
              <li class="nav-btn-log btn-login">
                <a href="/account/login">Log In</a>
              </li>
              <li class="nav-btn-log btn-signup">
                <a href="/account/signup">Sign Up</a>
              </li>
              <li class="nav-btn-link"></li>
            </ul>
          </nav>
        )}
    </div>
  );
}

const ProfileModal = ({
  user,
  r,
}: {
  r: Ref<HTMLDivElement>;
  user: User;
}) => {
  const refs = useRef<{ [key: string]: AIcon | null }>({});
  const onHover = useSignal<boolean>(false);

  const signOut = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      console.error("Login failed:", errorMsg);
      alert("Login failed: " + errorMsg);
      return;
    }
  };

  return (
    <div
      class="profile-popout"
      ref={r}
      onMouseEnter={() => {
        onHover.value = true;
      }}
      onMouseLeave={() => {
        onHover.value = false;
      }}
      hidden
      tabIndex={0}
      onBlur={() => {
        if (!onHover.value) r.current!.hidden = true;
      }}
    >
      <div>
        <div class="top">
          <div class="switch-account">
            <div class="details">
              <img class="profilePic" src={user?.profilePicture?.small?.publicURL} />

              <div class="account">
                <p class="username">{user?.username}</p>
                <p class="type">Personal Account</p>
              </div>
            </div>

            <AIcon
              ref={(el) => (refs.current["r1"] = el)}
              className="chevron"
              startPaths={Icons.DownChevron}
              endPaths={Icons.UpChevron}
            />
          </div>

          <AIcon
            ref={(el) => (refs.current["settings-btn-2"] = el)}
            className="settings-btn"
            startPaths={Icons.Settings}
          />
        </div>

        <div class="user-details">
          <p class="name">{`${user?.firstName} ${user?.lastName}`}</p>
          <p class="username">@{user?.username}</p>
        </div>
      </div>

      <div class="options">
        <hr />

        <ul>
          <li class="option">
            <a href={`/${user.username}`}>Profile</a>
          </li>
          <li class="option">
            <a>Network</a>
          </li>
          <li class="option">
            <a>Teams</a>
          </li>
          <li class="option">
            <a>History</a>
          </li>
          <li class="option">
            <a>Help</a>
          </li>
        </ul>

        <hr />

        <p class="option signout" onClick={() => signOut()}>
          Sign Out
        </p>
      </div>
    </div>
  );
};
