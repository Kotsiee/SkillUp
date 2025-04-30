import { Partial } from '$fresh/runtime.ts';
import Login from '../../../islands/account/login/Login.tsx';

export default function LoginPage() {
  return (
    <Partial name="account-log">
      <div class="modal login">
        <Login />
      </div>
    </Partial>
  );
}
