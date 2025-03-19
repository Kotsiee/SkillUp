import { Partial } from "$fresh/runtime.ts";

export default function ForgotPassword() {
  return (
    <Partial name="account-log">
      <div class="modal forgotpassword">
        <h1>Whos that yo</h1>
      </div>
    </Partial>
  );
}