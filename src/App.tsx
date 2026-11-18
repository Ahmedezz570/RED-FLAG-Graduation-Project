import { useCallback, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SplashPage } from './Mobile-app/screens/SplashPage';
import { LoginPage } from './Mobile-app/screens/LoginPage';
import { RegisterPage } from './Mobile-app/screens/RegisterPage';
import type { ScreenName } from './Mobile-app/types/types';

export default function App() {
  const [screen, setScreen] = useState<ScreenName>('splash');
  const goToLogin = useCallback(() => setScreen('login'), []);

  return (
    <>
      <StatusBar style={screen === 'splash' ? 'light' : 'dark'} />
      {screen === 'splash' && <SplashPage onFinish={goToLogin} />}
      {screen === 'login' && <LoginPage onNavigate={setScreen} />}
      {screen === 'register' && <RegisterPage onNavigate={setScreen} />}
    </>
  );
}