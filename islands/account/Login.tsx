import AIcon, { Icons } from "../../components/Icons.tsx";
import { User } from "../../lib/types/index.ts";
import { useUser } from "../contexts/UserProvider.tsx";
import {
  Signal,
  useSignal,
} from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { useEffect, useState } from "preact/hooks";

export default function LoginIsland() {
  const loginSection = useSignal<string>("withProvider");
  const [profiles, setProfiles] = useState<User[] | null>(null);
  const { user } = useUser();

  const switchScreen = (section: string) => {
    switch (section) {
      case "withAccount":
        return (
          <LoginWithAccount profiles={profiles} loginSection={loginSection} />
        );
      case "withProvider":
        return <LoginWithProvider loginSection={loginSection} />;
      case "withEmail":
        return <LoginWithEmail />;
    }
  };

  useEffect(() => {
    fetch("/api/auth/switchUser", { method: "GET" })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((users) => setProfiles(users))
      .catch((error) => {
        console.log("Failed to fetch user:", error);
      });
  }, []);

  useEffect(() => {
    if (user) {
      loginSection.value = "withAccount";
    }
  }, [user]);

  return (
    <div class="form">
      <div>
        <div class="login-nav">
          <label>
            <input
              type="radio"
              name="select-login-nav"
              checked={loginSection.value === "withAccount"}
              onInput={() => loginSection.value = "withAccount"}
              hidden
              disabled={!profiles}
            />
          </label>
          <label>
            <input
              type="radio"
              name="select-login-nav"
              checked={loginSection.value === "withProvider"}
              onInput={() => loginSection.value = "withProvider"}
              hidden
            />
          </label>
          <label>
            <input
              type="radio"
              name="select-login-nav"
              checked={loginSection.value === "withEmail"}
              onInput={() => loginSection.value = "withEmail"}
              hidden
            />
          </label>
        </div>
        <h1 class="title">Login</h1>

        {switchScreen(loginSection.value)}

        <div class="otherAction">
          <p>
            Don't have an account?{" "}
            <a href="/account/register" f-partial="/account/partials/register">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function LoginWithAccount(
  { profiles, loginSection }: {
    profiles: User[] | null;
    loginSection: Signal<string>;
  },
) {
  if (!profiles) return null;

  return (
    <div class="loginWithAccount">
      <h4>Already Logged In</h4>
      {profiles?.map((profile) => <Profile profile={profile} />)}

      <button
        class="add-account"
        onClick={() => loginSection.value = "withProvider"}
      >
        + Add Account
      </button>
    </div>
  );
}

function Profile({ profile }: { profile: User }) {

  const switchUser = async () => {
    const body = new FormData();
    body.set("newAccountId", JSON.stringify(profile.id));

    const res = await fetch('/api/auth/switchUser', {method: 'POST', body: body})
    
    if (!res.ok) return
    globalThis.location.assign('/')
  }

  return (
    <div class="other-account" onClick={() => switchUser()}>
      <div class="account-contents">
        <div class="account-image">
          <img src={profile.profilePicture?.med?.publicURL} />
        </div>
        <div class="account">
          <p class="account-name">{profile.firstName} {profile.lastName}</p>
          <p class="account-username">@{profile.username}</p>
        </div>
      </div>

      <div class="account-options">
        <AIcon className="account-options-icon" startPaths={Icons.DotMenu} />
      </div>
    </div>
  );
}

function LoginWithProvider({ loginSection }: { loginSection: Signal<string> }) {
  const providers = [
    { icon: "", provider: "Google", onClick: () => {} },
    { icon: "", provider: "Apple", onClick: () => {} },
    { icon: "", provider: "LinkedIn", onClick: () => {} },
    { icon: "", provider: "Facebook", onClick: () => {} },
  ];

  return (
    <div class="loginWithProvider">
      {providers.map((provider) => {
        return (
          <div class="loginWithCard" onClick={() => provider.onClick()}>
            <img src={provider.icon} />
            <p>Log In With {provider.provider}</p>
          </div>
        );
      })}

      <div
        class="loginWithSBEmail"
        onClick={() => loginSection.value = "withEmail"}
      >
        <p>Log In With Email</p>
      </div>
    </div>
  );
}

function LoginWithEmail() {
  const { fetchUser } = useUser();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    await fetchUser(formData);
    globalThis.location.assign("/");
  };

  return (
    <form onSubmit={handleSubmit} class="loginWithEmail">
      <div class="input">
        <div class="container">
          <div class="email text">
            <div class="container-1">
              <p>Email</p>
              <input
                name="email"
                type="email"
                autocomplete="email"
                placeholder="example@email.com"
              />
            </div>
          </div>

          <div class="password text">
            <div class="container-1">
              <p>Password</p>
              <input
                name="password"
                type="password"
                autocomplete="current-password"
                placeholder="********"
              />
            </div>
          </div>

          <div class="additional">
            <div class="container-2">
              <div class="remeberme">
                <input type="checkbox" id="remember" value="on" hidden />
                <label for="remember">
                  <AIcon className="check" startPaths={Icons.Tick} size={16} />
                  Remember me
                </label>
              </div>

              <a href="/user/account/forgotpassword">Forgot Password?</a>
            </div>
          </div>
        </div>
      </div>

      <div class="enter">
        <input type="submit" value="Log In"/>
      </div>
    </form>
  );
}
