import { Signal } from '@preact/signals';

export default function LoginWithProvider({ loginSection }: { loginSection: Signal<string> }) {
  const providers = [
    { icon: '/assets/images/providers/google.webp', name: 'Google' },
    { icon: '/assets/images/providers/apple.png', name: 'Apple' },
    { icon: '/assets/images/providers/linkedin.png', name: 'LinkedIn' },
  ];

  return (
    <div class="loginWithProvider">
      {providers.map(provider => (
        <div class="loginWithCard" onClick={() => {}}>
          <img src={provider.icon} />
          <p>Log In With {provider.name}</p>
        </div>
      ))}

      <div class="loginWithSBEmail" onClick={() => (loginSection.value = 'withEmail')}>
        <p>Log In With Email</p>
      </div>
    </div>
  );
}
