// Main Login screen logic

import { useEffect, useState } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { User } from '../../../lib/newtypes/index.ts';
import { useUser } from '../../contexts/UserProvider.tsx';
import LoginWithAccount from './LoginWithAccount.tsx';
import LoginWithEmail from './LoginWithEmail.tsx';
import LoginWithProvider from './LoginWithProvider.tsx';

export default function Login() {
  const loginSection = useSignal<string>('withProvider');
  const [profiles, setProfiles] = useState<User[] | null>(null);
  const { user } = useUser();

  // Load previously authenticated users
  useEffect(() => {
    fetch('/api/auth/switchUser')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setProfiles)
      .catch(console.error);
  }, []);

  // Show user login screen if already authenticated
  useEffect(() => {
    if (user) loginSection.value = 'withAccount';
  }, [user]);

  const renderSection = () => {
    switch (loginSection.value) {
      case 'withAccount':
        return <LoginWithAccount profiles={profiles} loginSection={loginSection} />;
      case 'withProvider':
        return <LoginWithProvider loginSection={loginSection} />;
      case 'withEmail':
        return <LoginWithEmail />;
    }
  };

  return (
    <div class="login-form-container" aria-labelledby="login-title">
      <div class="login-method-toggle" role="radiogroup" aria-label="Login method selection">
        {/* Toggle login method */}
        <label>
          <input
            type="radio"
            name="login-method"
            hidden
            aria-checked={loginSection.value === 'withAccount'}
            disabled={!profiles}
            checked={loginSection.value === 'withAccount'}
            onInput={() => (loginSection.value = 'withAccount')}
          />
        </label>
        <label>
          <input
            type="radio"
            name="login-method"
            hidden
            aria-checked={loginSection.value === 'withProvider'}
            checked={loginSection.value === 'withProvider'}
            onInput={() => (loginSection.value = 'withProvider')}
          />
        </label>
        <label>
          <input
            type="radio"
            name="login-method"
            hidden
            aria-checked={loginSection.value === 'withEmail'}
            checked={loginSection.value === 'withEmail'}
            onInput={() => (loginSection.value = 'withEmail')}
          />
        </label>
      </div>

      <h1 id="login-title" class="login-form-title">
        Login
      </h1>

      {renderSection()}

      <div class="login-form-footer">
        <p>
          Don't have an account?{' '}
          <a href="/account/register" f-partial="/account/partials/register">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
