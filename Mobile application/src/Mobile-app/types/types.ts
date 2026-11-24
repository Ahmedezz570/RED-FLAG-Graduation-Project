import type { ReactNode } from 'react';
import type { TextInputProps } from 'react-native';

export type ScreenName = 'splash' | 'login' | 'register';

export interface LoginValues {
  email: string;
  password: string;
}

export interface RegisterValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export type ButtonVariant = 'primary' | 'link';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
}

export interface InputProps extends TextInputProps {
  hasError?: boolean;
}

export interface LogoProps {
  size?: number;
  inverted?: boolean;
}

export interface FormFieldProps extends InputProps {
  label: string;
  error?: string;
}

export interface LoginFormProps {
  onSubmit: (values: LoginValues) => void;
  onGoToRegister: () => void;
}

export interface RegisterFormProps {
  onSubmit: (values: RegisterValues) => void;
  onGoToLogin: () => void;
}

export interface AuthTemplateProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export interface SplashPageProps {
  onFinish: () => void;
  durationMs?: number;
}

export interface AuthPageProps {
  onNavigate: (screen: ScreenName) => void;
}