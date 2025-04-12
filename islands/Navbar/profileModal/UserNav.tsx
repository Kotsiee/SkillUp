import { User } from "../../../lib/types/index.ts";
import { signOut } from "../utils.ts";

export default function UserNav({ currentAccount }: { currentAccount: any }) {
  return (
    <div class="options">
      <div class="option"><a href={`/${currentAccount.handle}`}>Profile</a></div>
      <div class="option"><a href="#">Network</a></div>
      <div class="option"><a href="#">Teams</a></div>
      <div class="option"><a href="#">History</a></div>
      <div class="option"><a href="#">Help</a></div>
      <hr class="separator" />
      <button class="logout" onClick={signOut}>Log Out</button>
    </div>
  );
}
