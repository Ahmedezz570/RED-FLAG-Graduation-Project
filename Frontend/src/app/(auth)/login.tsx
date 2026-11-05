import { useRef, useState } from 'react';

import { SignInError, type Credentials } from '@/features/auth/contract';
import { useSession } from '@/features/auth/session';
import { LoginForm } from '@/ui/organisms/LoginForm';
import { AuthTemplate } from '@/ui/templates/AuthTemplate';

export default function LoginPage() {
  const { signIn } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestInProgress = useRef(false);

  async function submit(credentials: Credentials) {
    if (requestInProgress.current) {
      return;
    }

    requestInProgress.current = true;
    setSubmitting(true);
    setError(null);

    try {
      await signIn(credentials);
    } catch (cause) {
      setError(cause instanceof SignInError ? cause.message : 'Sign-in failed. Please try again.');
    } finally {
      requestInProgress.current = false;
      setSubmitting(false);
    }
  }

  return (
    <AuthTemplate title="Welcome back" description="Sign in to your RED FLAG account.">
      <LoginForm error={error} submitting={submitting} onEdit={() => setError(null)} onSubmit={submit} />
    </AuthTemplate>
  );
}
