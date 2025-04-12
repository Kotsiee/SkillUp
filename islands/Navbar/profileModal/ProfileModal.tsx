import { useRef } from "preact/hooks";
import AIcon, { Icons } from "../../../components/Icons.tsx";
import { User, Team } from "../../../lib/types/index.ts";
import UserSwitch from "./UserSwitch.tsx";
import UserNav from "./UserNav.tsx";
import { Signal, useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";

export default function ProfileModal({
  isOpen,
  user,
  team,
}: {
  isOpen: Signal<boolean>;
  user: User;
  team: Team;
}) {
  const isHovered = useSignal(false);
  const openAccounts = useSignal(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const currentAccount = team ? {
    profilePicture: team.logo?.small?.publicURL,
    name: team.name,
    handle: team.handle,
    accountType: "Business Account"
  } : {
    profilePicture: user.profilePicture?.small?.publicURL,
    name: `${user.firstName} ${user.lastName}`,
    handle: user.username,
    accountType: "Personal Account"
  }

  return (
    <div
      class="profile-modal"
      ref={modalRef}
      tabIndex={0}
      hidden={!isOpen.value}
      onMouseEnter={() => {
        isHovered.value = true;
        modalRef.current?.focus();
      }}
      onMouseLeave={() => (isHovered.value = false)}
      onBlur={() => {
        if (!isHovered.value) isOpen.value = false;
      }}
    >
      <div class="top">
        <div class="switch-account" onClick={() => openAccounts.value = !openAccounts.value}>
          <div class="details">
            <img class="profilePic" src={currentAccount.profilePicture} alt="Profile Picture" />
            <div class="account">
              <p class="username">{currentAccount.name}</p>
              <p class="type">{currentAccount.accountType}</p>
            </div>
          </div>
        </div>
        <AIcon className="settings-btn" startPaths={Icons.Settings} />
      </div>

      <div class="user-details">
        <p class="name">{currentAccount.name}</p>
        <p class="username">@{currentAccount.handle}</p>
      </div>

      <hr class="separator" />

      {openAccounts.value ? <UserSwitch user={user} /> : <UserNav currentAccount={currentAccount} />}
    </div>
  );
}