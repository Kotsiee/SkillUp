import { useState } from 'preact/hooks';
import { useUser } from '../../contexts/UserProvider.tsx';
import AIcon, { Icons } from '../../../components/Icons.tsx';
import { useSignal } from '@preact/signals';

export default function LoginWithEmail() {
  const { fetchUser } = useUser();
  const error = useSignal<string | null>(null);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      await fetchUser(formData);
      location.assign('/');
    } catch (err) {
      error.value = (err as Error).message || 'Login failed';
      console.warn('Login error:', err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      class="login-email-form"
      role="form"
      aria-labelledby="login-title"
    >
      <h2 id="login-title" class="login-email-form__title">
        Login with Email
      </h2>

      {/* Email Field */}
      <div class="login-email-form__field">
        <label class="login-email-form__label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="example@email.com"
          class="login-email-form__input"
          required
          aria-required="true"
        />
      </div>

      {/* Password Field */}
      <div class="login-email-form__field">
        <label class="login-email-form__label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="********"
          class="login-email-form__input"
          required
          aria-required="true"
        />
      </div>

      {/* Error Message */}
      {error.value ? (
        <div class="login-email-form__error" role="alert" aria-live="assertive">
          {error.value}
        </div>
      ) : null}

      {/* Remember Me & Forgot Link */}
      <div class="login-email-form__extras">
        <label htmlFor="remember" class="login-email-form__remember">
          <input type="checkbox" id="remember" value="on" hidden />
          <div class="login-email-form__remember-label">
            <AIcon className="login-email-form__check-icon" startPaths={Icons.Tick} size={16} />
            Remember me
          </div>
        </label>
        <a href="/user/account/forgotpassword" class="login-email-form__forgot-link">
          Forgot Password?
        </a>
      </div>

      {/* Submit Button */}
      <div class="login-email-form__submit">
        <input
          type="submit"
          value="Log In"
          class="login-email-form__submit-btn"
          aria-label="Submit login form"
        />
      </div>
    </form>
  );
}
