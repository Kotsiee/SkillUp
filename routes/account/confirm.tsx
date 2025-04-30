import { Partial } from '$fresh/runtime.ts';
import Confirm from '../../islands/account/Confirm.tsx';

export default function ConfirmPage() {
  return (
    <Partial name="account-log">
      <div class="modal confirm">
        <Confirm />
      </div>
    </Partial>
  );
}
