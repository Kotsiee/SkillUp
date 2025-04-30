import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';

export default function Confirm() {
  const email = useSignal('example@example.com');

  useEffect(() => {
    fetch('/api/auth/confirm', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        console.log('Confirmation data:', data);
        if (data.email) {
          email.value = data.email;
        }
      })
      .catch(error => {
        console.error('Error fetching confirmation data:', error);
      });
  }, []);

  return (
    <div class="confirm-container">
      <h1>Confirm Your Email</h1>
      <p>
        A confirmation email has been sent to <strong>{email.value}</strong>. Please check your
        inbox and click the confirmation link to verify your email address.
      </p>
      <p>
        Didn't receive the email?{' '}
        <button
          onClick={async () =>
            await fetch('/api/auth/confirm', {
              method: 'POST',
            })
          }
        >
          Resend Email
        </button>
      </p>
    </div>
  );
}
