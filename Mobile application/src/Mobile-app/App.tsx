import { useCallback, useState } from 'react';
import { SplashPage } from './screens/SplashPage';
import { LoginPage } from './screens/LoginPage';
import { RegisterPage } from './screens/RegisterPage';
import type { ScreenName } from './types/types';

export default function App() {
  const [screen, setScreen] = useState<ScreenName>('splash');
  const goToLogin = useCallback(() => setScreen('login'), []);

  if (screen === 'splash') return <SplashPage onFinish={goToLogin} />;
  if (screen === 'register') return <RegisterPage onNavigate={setScreen} />;
  return <LoginPage onNavigate={setScreen} />;
}