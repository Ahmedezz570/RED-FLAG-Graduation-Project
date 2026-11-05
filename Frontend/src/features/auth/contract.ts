export type Credentials = {
  email: string;
  password: string;
};

export type Session = {
  token: string;
  user: { id: string; name: string; email: string };
};

export class SignInError extends Error {}
