// src/components/AuthView.tsx
import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

function AuthView() {
  const [isLogin, setIsLogin] = useState(true);

  return isLogin ? (
    <LoginForm switchToRegister={() => setIsLogin(false)} />
  ) : (
    <RegisterForm switchToLogin={() => setIsLogin(true)} />
  );
}

export default AuthView;
