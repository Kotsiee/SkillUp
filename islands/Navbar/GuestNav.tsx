import AIcon, { Icons } from "../../components/Icons.tsx";

export default function GuestNavbar() {
  return (
    <nav>
      <div class="nav guest-nav">
        {/* Left Section */}
        <div class="nav-left">
          <a href="/">DuckTasks</a>
        </div>

        {/* Center Section - Search */}
        <div class="nav-center">
          <div class="nav-search">
            <AIcon className="search-btn" startPaths={Icons.Search} />
            <input class="search-input" type="text" placeholder="Search..." />
          </div>
        </div>

        {/* Right Section - User Profile */}
        <div class="nav-right">
          <a class="nav-login" href="/account/login">Log In</a>
          <a class="nav-register" href="/account/register">Sign Up</a>
        </div>
      </div>
    </nav>
  );
}
