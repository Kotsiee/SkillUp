import {
  Signal,
  useSignal,
} from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { useEffect, useRef, useState } from "preact/hooks";
import { OrganisationRoles, User } from "../../lib/types/index.ts";
import AIcon, { Icons } from "../../components/Icons.tsx";
import { signOut } from "./utils.ts";

export default function ProfileModal(
  { user, isOpen }: { isOpen: Signal<boolean>; user: User },
) {
  const isHovered = useSignal<boolean>(false);
  const profileModal = useRef<HTMLDivElement>(null);
  const openAccounts = useSignal<boolean>(false);

  return (
    <div
      class="profile-modal"
      onMouseEnter={() => {
        isHovered.value = true;
        profileModal.current!.focus();
      }}
      onMouseLeave={() => (isHovered.value = false)}
      ref={profileModal}
      tabIndex={0}
      hidden={!isOpen.value}
      onBlur={() => {
        if (!isHovered.value) isOpen.value = false;
      }}
    >
      <div class="top">
        <div class="switch-account" onClick={() => openAccounts.value = !openAccounts.value}>
          <div class="details">
            <img
              class="profilePic"
              src={user?.profilePicture?.small?.publicURL}
            />
            <div class="account">
              <p class="username">{user?.username}</p>
              <p class="type">Personal Account</p>
            </div>
          </div>
        </div>
        <AIcon className="settings-btn" startPaths={Icons.Settings} />
      </div>

      <div class="user-details">
        <p class="name">{`${user?.firstName} ${user?.lastName}`}</p>
        <p class="username">@{user?.username}</p>
      </div>

      <hr class="separator"/>

      {openAccounts.value ? <UserSwitch user={user} /> : <UserNav user={user}/>}
    </div>
  );
}

function UserNav({ user }: { user: User }) {
  return (
    <div class="options">
        <div class="option"><a href={`/${user.username}`}>Profile</a></div>
        <div class="option"><a href="#">Network</a></div>
        <div class="option"><a href="#">Teams</a></div>
        <div class="option"><a href="#">History</a></div>
        <div class="option"><a href="#">Help</a></div>
        <hr class="separator"/>
      <button class="logout" onClick={signOut}>log Out</button>
    </div>
  );
}

function UserSwitch({ user }: { user: User }) {
  const profileType = useSignal<string>("Business");

  return (
    <div class="profiles">
      <div class="profile-type">
        <label>
          <input
            type="radio"
            name="profile-type-switch"
            checked={profileType.value === "Business"}
            onInput={() => profileType.value = "Business"}
            hidden
          />
          Business
        </label>

        <label>
          <input
            type="radio"
            name="profile-type-switch"
            checked={profileType.value === "Personal"}
            onInput={() => profileType.value = "Personal"}
            hidden
          />
          Personal
        </label>
      </div>

      <button class="view-all">View All</button>

      <div class="view-profiles">
        {profileType.value === "Business"
          ? <BusinessProfiles user={user} />
          : <PersonalProfiles />}
      </div>

      <div class="other-actions">
        <a class="add-account" href='/account/login'>+ Add Account</a>
        <button class="logout" onClick={signOut}>Log Out</button>
      </div>
    </div>
  );
}

function PersonalProfiles() {
  const [profiles, setProfiles] = useState<User[] | null>(null)

  useEffect(() => {
    fetch('/api/auth/switchUser', {method: 'GET'})
    .then(res => {
      if (!res.ok)
        throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);

      return res.json()
    })
    .then(users => setProfiles(users))
    .catch((error) => {
      console.log("Failed to fetch user:", error);
    });
  }, [])

  return (
    <div class="personal-profiles">
      {
        profiles?.map((profile) => <PersonalProfile profile={profile}/>)
      }
    </div>
  );
}

function BusinessProfiles({ user }: { user: User }) {
  return (
    <div class="business-profiles">
      <PersonalProfile profile={user}/>
      {user.organisations?.map((item) => {
        if (["owner", "co_owner", "manager"].includes(item.role)) {
          return <BusinessProfile profile={item} />;
        }
      })}
    </div>
  );
}

function PersonalProfile({ profile }: { profile: User }) {
  const switchUser = async () => {
    const body = new FormData();
    body.set("newAccountId", JSON.stringify(profile.id));

    const res = await fetch('/api/auth/switchUser', {method: 'POST', body: body})
    
    if (!res.ok) return
    globalThis.location.assign('/')
  }

  return (
    <div class="other-profile" onClick={() => switchUser()}>
      <div class="profile-image">
        <img src={profile.profilePicture?.small?.publicURL}/>
      </div>
      <div class="account">
        <p class="account-name">{profile.firstName} {profile.lastName}</p>
        <p class="account-username">@{profile.username}</p>
        <p class="account-type">Personal Account</p>
      </div>
    </div>
  );
}

function BusinessProfile({ profile }: { profile: OrganisationRoles }) {
  return (
    <div class="business-profile other-profile">
      <div class="profile-image">
        <img
          src={profile.organisation?.logo?.publicURL ??
            "/assets/images/audio.png"}
        />
      </div>
      <div class="account">
        <p class="account-name">{profile.organisation?.name}</p>
        <p class="account-username">@{profile.organisation?.name}</p>
        <p class="account-type">{profile.role[0].toUpperCase() + profile.role.substring(1)}</p>
      </div>
    </div>
  );
}
