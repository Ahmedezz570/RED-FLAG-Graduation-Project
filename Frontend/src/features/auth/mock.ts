import { SignInError, type Credentials, type Session } from './contract';

export async function mockSignIn({ email, password }: Credentials): Promise<Session> {
  await new Promise((resolve) => setTimeout(resolve, 350));

  if (email === 'offline@redflag.test') {
    throw new SignInError('Could not reach the server. Check your connection and try again.');
  }

  if (email !== 'demo@redflag.test' || password !== 'redflag-demo') {
    throw new SignInError('Email or password is incorrect.');
  }

  return { token: 'local-demo-token', user: { id: 'demo', name: 'Demo User', email } };
}
