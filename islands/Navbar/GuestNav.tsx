import AIcon, { Icons } from '../../components/Icons.tsx';

export default function GuestNavbar() {
  return (
    <nav>
      <div class="nav guest-nav">
        {/* Left Section */}
        <div class="nav-left">
          <a class="nav-left-logo" href="/">
            <img src="/assets/images/Logo.webp" />
          </a>

          <div>
            <a class="nav-quicklinks" href="#">
              About
            </a>
            <a class="nav-quicklinks" href="/explore">
              Explore
            </a>
          </div>
        </div>

        {/* Right Section - User Profile */}
        <div class="nav-right">
          <div class="nav-right-biz">
            <a class="nav-quicklinks" href="#">
              News
            </a>
            <a class="nav-quicklinks" href="#">
              Business
            </a>
          </div>

          <div class="nav-right-actions">
            <a class="nav-login" href="/account/login">
              Log In
            </a>
            <a class="nav-register" href="/account/register">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
