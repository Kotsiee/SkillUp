import { Partial } from "$fresh/runtime.ts";
import RegisterIsland from "../../../islands/account/Register.tsx";

export default function Register() {
  return (
    <Partial name="account-log">
      <div class="modal signup">
        <RegisterIsland />
      </div>
    </Partial>
  );
}