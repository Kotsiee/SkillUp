import AIcon, { Icons } from "../../components/Icons.tsx";
import { useUser } from "../contexts/UserProvider.tsx";

export default function LoginIsland(){
    const {storeUser} = useUser();

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        await storeUser(formData)
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div class="input">
                <div class="container">

                    <div class="email text">
                        <div class="container-1">
                        <p>Email</p>
                        <input name='email' type='email' autocomplete='email' placeholder='example@email.com'/>
                        </div>
                    </div>

                    <div class="password text">
                        <div class="container-1">
                        <p>Password</p>
                        <input name='password' type='password' autocomplete='current-password' placeholder='********'/>
                        </div>
                    </div>

                    <div class="additional">
                        <div class="container-2">
                        <div class="remeberme">
                            <input type='checkbox' id="remember" value="on" hidden/>
                            <label for="remember">
                            <AIcon className="check" startPaths={Icons.Tick} size={16}/>
                            Remember me
                            </label>
                        </div>
                        
                        <a href="/user/account/forgotpassword">Forgot Password?</a>
                        </div>
                    </div>

                </div>
            </div>

            <button type='submit' class="enter">Log In</button>
        </form>
    )
}