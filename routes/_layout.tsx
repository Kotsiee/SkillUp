import { PageProps } from "$fresh/server.ts";
import { UserProvider } from "../islands/contexts/UserProvider.tsx";
import NavBar from "../islands/Navbar/Navbar.tsx";

export default function Layout(pageProps: PageProps) {
  
  return (
    <UserProvider>
      <div class="layout">
          <NavBar pageProps={pageProps}/>
          <div class="body"> <pageProps.Component /> </div>
      </div>
    </UserProvider>
  );
}