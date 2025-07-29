// src/components/LoginForm.tsx
import { useState } from 'react';
import { login } from '../api/auth';
import GoogleLoginButton from './GoogleLoginButton';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import logo from '../assets/vale-cuatro-logo.png'; // Asegurate de tener tu logo en assets

function LoginForm({ switchToRegister }: { switchToRegister: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      authLogin({ username: data.username }, data.token);
      if (!data.username || !data.avatar) {
        navigate('/complete-profile');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      setError('Login inválido');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4D59D]">
      <div className="bg-white/90 p-8 rounded-2xl shadow-lg w-full max-w-sm text-[#3C2F2F]">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo Vale Cuatro" className="h-16" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-4">Iniciar sesión</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="p-3 bg-[#FFF5E1] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="p-3 bg-[#FFF5E1] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button className="bg-[#6C4A3F] text-white py-2 rounded hover:bg-[#8B5E3C] transition">Iniciar sesión</button>
        </form>
        <div className="mt-4">
          <GoogleLoginButton />
        </div>
        <p className="mt-4 text-center text-sm text-[#3C2F2F]">
          ¿No tienes una cuenta?{' '}
          <button onClick={switchToRegister} className="text-[#6C4A3F] font-semibold hover:underline">
            Regístrate
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
