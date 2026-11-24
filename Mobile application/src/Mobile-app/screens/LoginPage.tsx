import { AuthTemplate } from '../components/templates';
import { LoginForm } from '../components/organisms';
import type { AuthPageProps, LoginValues } from '../types/types';

export const LoginPage = ({ onNavigate }: AuthPageProps) => {
  const handleSubmit = (values: LoginValues) => console.log('login', values);

  return (
    <AuthTemplate title="Welcome back" subtitle="Log in to continue.">
      <LoginForm onSubmit={handleSubmit} onGoToRegister={() => onNavigate('register')} />
    </AuthTemplate>
  );
};