import { useUser } from "../contexts/UserProvider.tsx";

export default function TeamsIsland() {
  const { user } = useUser();

  return (
    <div class="teams">
      <div>
        <div class="switch-account">
          <div class="details">
            <img
              class="profilePic"
              src={user?.profilePicture?.small?.publicURL}
            />
            <div class="account">
              <p class="username">{user?.username}</p>
              <p class="type">Personal Account</p>
            </div>
          </div>
        </div>

        <div>
            <button>+ New Team</button>
        </div>
      </div>

      <div>
        <TeamsCard/>
      </div>
    </div>
  );
}


function TeamsCard() {
    return (
        <div>
            <div>
                <img class="banner"/>
                <img class="profilePic"/>
            </div>

            <div>
                <div>
                    <p>Business Name</p>
                    <p>Business Handle</p>
                    <p>Owner</p>
                </div>

                <div>
                    <p>3 Members</p>
                    <p>5 Projects</p>
                </div>
            </div>
        </div>
    )
}