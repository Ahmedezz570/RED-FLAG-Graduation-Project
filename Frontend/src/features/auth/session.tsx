import { createContext, useContext, useState, type PropsWithChildren } from 'react';

import { requestSignIn } from './api';
import type { Credentials, Session } from './contract';

type SessionContextValue = {
  session: Session | null;
  signIn: (credentials: Credentials) => Promise<void>;
  signOut: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);

  async function signIn(credentials: Credentials) {
    setSession(await requestSignIn(credentials));
  }

  return (
    <SessionContext.Provider value={{ session, signIn, signOut: () => setSession(null) }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession requires a SessionProvider.');
  }

  return context;
}
