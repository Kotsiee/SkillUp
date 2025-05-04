export function DashboardProfile() {
  return (
    <div class="dashboard__content__profile">
      <h4 class="dashboard__content__profile-title dashboard__content-title">Profile</h4>

      <div class="dashboard__content__profile-content dashboard__content-content">
        <div class="dashboard__content__profile-content__balance">
          <p class="dashboard__content__profile-content__balance-title content-title">
            Connections
          </p>
          <p class="dashboard__content__profile-content__balance-amount content-amount">73</p>
        </div>

        <div class="dashboard__content__profile-content__earnings">
          <p class="dashboard__content__profile-content__earnings-title content-title">Views</p>
          <p class="dashboard__content__profile-content__earnings-amount content-amount">210</p>
        </div>
      </div>
    </div>
  );
}
