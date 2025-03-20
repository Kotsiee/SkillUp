import { PageProps } from "$fresh/server.ts";
import { useUser } from "../contexts/UserProvider.tsx";
import { getNavbarState } from "./utils.ts";
import UserNavbar from "./UserNav.tsx";
import GuestNavbar from "./GuestNav.tsx";
import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";

export default function NavBar({ pageProps }: { pageProps: PageProps }) {
  const { user } = useUser();
  const isNavbarOpen = useSignal<boolean>(getNavbarState());

  return (
    <div>
      <link rel="stylesheet" href="/styles/islands/navbar.css" />
      <style>{`:root { --header-side-width-desktop: ${isNavbarOpen.value ? 300 : 76}px; }`}</style>

      {user ? <UserNavbar pageProps={pageProps} user={user}/> : <GuestNavbar />}
    </div>
  );
}
