import { SignInError, type Credentials, type Session } from './contract';
import { mockSignIn } from './mock';

function isSession(value: unknown): value is Session {
  if (!value || typeof value !== 'object' || !('token' in value) || !('user' in value)) {
    return false;
  }

  const { token, user } = value;
  return (
    typeof token === 'string' &&
    token.length > 0 &&
    !!user &&
    typeof user === 'object' &&
    'id' in user &&
    typeof user.id === 'string' &&
    'name' in user &&
    typeof user.name === 'string' &&
    'email' in user &&
    typeof user.email === 'string'
  );
}

export async function requestSignIn(credentials: Credentials): Promise<Session> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

  if (__DEV__ && !apiUrl) {
    return mockSignIn(credentials);
  }

  if (!apiUrl || (!__DEV__ && !apiUrl.startsWith('https://'))) {
    throw new SignInError('Sign-in is temporarily unavailable.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(`${apiUrl.replace(/\/+$/, '')}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(credentials),
      signal: controller.signal,
    });

    if (response.status === 401) {
      throw new SignInError('Email or password is incorrect.');
    }

    if (!response.ok) {
      throw new SignInError('Sign-in failed. Please try again.');
    }

    const session: unknown = await response.json();
    if (!isSession(session)) {
      throw new SignInError('The server returned an unexpected response. Please try again.');
    }

    return session;
  } catch (error) {
    if (error instanceof SignInError) {
      throw error;
    }
    if (error instanceof SyntaxError) {
      throw new SignInError('The server returned an unexpected response. Please try again.');
    }

    throw new SignInError('Could not reach the server. Check your connection and try again.');
  } finally {
    clearTimeout(timeout);
  }
}
