import { PageProps } from "$fresh/server.ts";

export default function Layout(pageProps: PageProps) {
  const page = pageProps.route.split('/user/account/')[1]

  // deno-lint-ignore no-explicit-any
  const pageFunc = (login: any, signup: any, forgot?: any) => {
    switch (page){
      case 'login': return login;
      case 'signup': return signup;
      case 'forgotpassword': return forgot;
    }
  }

  return (
    <div class="loginLayout">
      <link rel="stylesheet" href="/styles/pages/user/login.css" />
      <div class="background">
        <div class="text">
          <div class="title">
            <div class="container">
              <p class="option">{pageFunc('Log In', 'Sign Up', 'Oh no!')}</p>
              {pageFunc(
                <h1 class="welcome login">WELCOME<br/>BACK</h1>,
                <h1 class="welcome register">START<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;YOUR<br/>&nbsp;&nbsp;&nbsp;JOURNEY</h1>,
                <h1 class="welcome forgot">FORGOT<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;YOUR<br/>&nbsp;&nbsp;&nbsp;PASSWORD?</h1>
                 )}
              
              <p class="sub">{pageFunc(
                'Log back into your account and continue with your journey',
                'Create your new account and start building your career',
                "Don't worry, you can just reset your password and be on your way"
                 )}</p>
            </div>
          </div>

          <div class="signup">
            {pageFunc(
              <p>Don't have an account yet? <a href='/user/account/signup'>Sign Up</a></p>,
              <p>Already have an account? <a href='/user/account/login'>Log In</a></p>,
              <p>Remebered your password? <a href='/user/account/login'>Log In</a></p> )}
            
          </div>
        </div>

        <div class="overlay">
          <pageProps.Component />
        </div>
      </div>
    </div>
  );
}