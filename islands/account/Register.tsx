import AIcon, { Icons } from "../../components/Icons.tsx";

export default function RegisterIsland(){
    const user = localStorage.getItem('user')
    
    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        globalThis.history.replaceState({}, '', '/')
        globalThis.window.location.reload()
    }

    return (
        <form onSubmit={handleSubmit}>
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
                            <input name='password' type='password' autocomplete='none' placeholder='********'/>
                        </div>
                    </div>

                    <div class="confirm-password text">
                        <div class="container-1">
                            <p>Confirm Password</p>
                            <input name='confirm-password' type='password' autocomplete='none' placeholder='********'/>
                        </div>
                    </div>

                    <div class="additional">

                    </div>

                </div>
            </div>

            <button type='submit' class="enter">Create Account</button>
        </form>
    )
}