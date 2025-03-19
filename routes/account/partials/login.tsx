import { Partial } from "$fresh/runtime.ts";
import LoginIsland from "../../../islands/account/Login.tsx";

export default function Login() {
  return (
    <Partial name="account-log">
      <div class="modal login">
        <LoginIsland />
      </div>
    </Partial>
  );
}
  