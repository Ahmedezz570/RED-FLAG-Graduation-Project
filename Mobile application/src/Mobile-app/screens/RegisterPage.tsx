import { AuthTemplate } from '../components/templates';
import { RegisterForm } from '../components/organisms';
import type { AuthPageProps, RegisterValues } from '../types/types';

export const RegisterPage = ({ onNavigate }: AuthPageProps) => {
  const handleSubmit = (values: RegisterValues) => console.log('register', values);

  return (
    <AuthTemplate title="Create your account" subtitle="It only takes a minute.">
      <RegisterForm onSubmit={handleSubmit} onGoToLogin={() => onNavigate('login')} />
    </AuthTemplate>
  );
};