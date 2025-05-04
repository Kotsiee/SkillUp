export function DashboardWallet() {
  return (
    <div class="dashboard__content__wallet">
      <h4 class="dashboard__content__wallet-title dashboard__content-title">Wallet</h4>
      <div class="dashboard__content__wallet-content dashboard__content-content">
        <div class="dashboard__content__wallet-content__balance">
          <p class="dashboard__content__wallet-content__balance-title content-title">Balance</p>
          <p class="dashboard__content__wallet-content__balance-amount content-amount">
            £0.00<span class="content-currency">GBP</span>
          </p>
        </div>

        <div class="dashboard__content__wallet-content__earnings">
          <p class="dashboard__content__wallet-content__earnings-title content-title">
            This Months Earnings
          </p>
          <p class="dashboard__content__wallet-content__earnings-amount content-amount">
            £0.00<span class="content-currency">GBP</span>
          </p>
          <p class="dashboard__content__wallet-content__earnings-growth positive">0.00%</p>
        </div>
      </div>
    </div>
  );
}
