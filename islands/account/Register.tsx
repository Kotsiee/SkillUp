import { useSignal } from '@preact/signals';

export default function Register() {
  const formData = useSignal<{ [name: string]: string }>({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const errors = useSignal<string[]>([]);
  const passwordStrength = useSignal('');

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    formData.value = { ...formData.value, [target.name]: target.value };
    validateForm();
  };

  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isOver16 = (dob: string) => {
    const dobDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - dobDate.getFullYear();
    const hasBirthdayPassed = today >= new Date(dobDate.setFullYear(dobDate.getFullYear() + 16));
    return age > 16 || (age === 16 && hasBirthdayPassed);
  };

  const checkPasswordStrength = (password: string) => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    const strength = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;

    if (password.length >= 8 && strength === 4) return 'Strong';
    if (password.length >= 6 && strength >= 2) return 'Medium';
    return 'Weak';
  };

  const validateForm = () => {
    const e: string[] = [];
    const { firstName, lastName, dob, email, password, confirmPassword } = formData.value;

    if (!firstName.trim()) e.push('First name is required.');
    if (!lastName.trim()) e.push('Last name is required.');
    if (!isEmailValid(email)) e.push('Email format is invalid.');
    if (!isOver16(dob)) e.push('You must be over 16 years old.');
    if (password !== confirmPassword) e.push('Passwords do not match.');
    if (checkPasswordStrength(password) === 'Weak') e.push('Password is too weak.');

    errors.value = e;
    passwordStrength.value = checkPasswordStrength(password);
    return e.length === 0;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const form = e.target as HTMLFormElement;
      const newformData = new FormData(form);
      Object.keys(formData.value).forEach(key => {
        if (formData.value[key] !== undefined) {
          newformData.append(key, formData.value[key]);
        }
      });

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: newformData,
      });

      if (!response.ok) throw new Error('Failed to register');
      console.log('Registration successful!');
      globalThis.location.assign('/account/confirm');
    } catch (error) {
      alert('Registration failed. Please try again.');
      console.error(error);
    }
  };

  return (
    <div class="register">
      <h1 class="register__title">Register</h1>

      {errors.value.length > 0 && (
        <ul class="register__error-list">
          {errors.value.map(err => (
            <li class="register__error-item">{err}</li>
          ))}
        </ul>
      )}

      <form class="register__form" onSubmit={handleSubmit}>
        <div class="register__form-name">
          <div class="register__field">
            <label class="register__form-label" htmlFor="firstName">
              First Name:
            </label>
            <input
              class="register__form-input"
              type="text"
              id="firstName"
              name="firstName"
              value={formData.value.firstName}
              onInput={handleChange}
              autoComplete={'given-name'}
              placeholder="First Name"
            />
          </div>

          <div class="register__field">
            <label class="register__form-label" htmlFor="lastName">
              Last Name:
            </label>
            <input
              class="register__form-input"
              type="text"
              id="lastName"
              name="lastName"
              value={formData.value.lastName}
              onInput={handleChange}
              autoComplete={'family-name'}
              placeholder="Last Name"
            />
          </div>
        </div>

        <div class="register__field">
          <label class="register__form-label" htmlFor="dob">
            Date of Birth:
          </label>
          <input
            class="register__form-input"
            type="date"
            id="dob"
            name="dob"
            value={formData.value.dob}
            onInput={handleChange}
            autoComplete={'bday'}
          />
        </div>

        <div class="register__field">
          <label class="register__form-label" htmlFor="email">
            Email:
          </label>
          <input
            class="register__form-input"
            type="email"
            id="email"
            name="email"
            value={formData.value.email}
            onInput={handleChange}
            autoComplete={'email'}
            placeholder="email@email.com"
          />
        </div>

        <div class="register__field">
          <label class="register__form-label" htmlFor="password">
            Password:
          </label>
          <input
            class="register__form-input"
            type="password"
            id="password"
            name="password"
            value={formData.value.password}
            onInput={handleChange}
            autoComplete={'new-password'}
            placeholder="*********"
          />
          {passwordStrength.value && (
            <div
              class={`register__password-strength register__password-strength--${passwordStrength.value.toLowerCase()}`}
            >
              Strength: {passwordStrength.value}
            </div>
          )}
        </div>

        <div class="register__field">
          <label class="register__form-label" htmlFor="confirmPassword">
            Confirm Password:
          </label>
          <input
            class="register__form-input"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.value.confirmPassword}
            onInput={handleChange}
            autoComplete={'new-password'}
            placeholder="*********"
          />
        </div>

        <div class="register__submit">
          <input type="submit" class="register__submit-button" value="Register" />
        </div>
      </form>

      <div class="login-form-footer">
        <p>
          Already have an account?{' '}
          <a href="/account/login" f-partial="/account/partials/login">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
