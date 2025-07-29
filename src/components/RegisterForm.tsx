import { useState } from 'react';
import logo from '../assets/vale-cuatro-logo.png';
import GoogleLoginButton from './GoogleLoginButton';
import { register } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import axios from 'axios';

function RegisterForm({ switchToLogin }: { switchToLogin: () => void }) {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const data = await register(email, password);
      localStorage.setItem('token', data.token);
      authLogin({ username: data.username }, data.token);
      if (!data.username || !data.avatar) {
        navigate('/complete-profile');
      } else {
        navigate('/');
      }
    } catch (err: unknown) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Error al registrarse');
      }
    }
  };

  const handleVisibilityToggle = (field: 'password' | 'confirmPassword', e: React.MouseEvent) => {
    e.preventDefault();
    const input = document.getElementById(field) as HTMLInputElement;
    const cursorPosition = input.selectionStart; // Guardamos la posición del cursor

    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));

    setTimeout(() => {
      input.focus();
      input.selectionStart = cursorPosition;
      input.selectionEnd = cursorPosition;
    }, 0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4D59D]">
      <div className="bg-white/90 p-8 rounded-2xl shadow-lg w-full max-w-sm text-[#3C2F2F]">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo Vale Cuatro" className="h-16" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-4">Crear cuenta</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="p-3 bg-[#FFF5E1] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative">
            <input
              id="password"
              type={passwordVisibility.password ? 'text' : 'password'}
              placeholder="Contraseña"
              className="p-3 pr-20 bg-[#FFF5E1] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={(e) => handleVisibilityToggle('password', e)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8B5E3C] focus:outline-none"
            >
              {passwordVisibility.password ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          <div className="relative">
            <input
              id="confirmPassword"
              type={passwordVisibility.confirmPassword ? 'text' : 'password'}
              placeholder="Confirmar contraseña"
              className="p-3 pr-20 bg-[#FFF5E1] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] w-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={(e) => handleVisibilityToggle('confirmPassword', e)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8B5E3C] focus:outline-none"
            >
              {passwordVisibility.confirmPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button className="bg-[#6C4A3F] text-white py-2 rounded hover:bg-[#8B5E3C] transition">Registrarse</button>
        </form>
        <div className="mt-4">
          <GoogleLoginButton />
        </div>
        <p className="mt-4 text-center text-sm text-[#3C2F2F]">
          ¿Ya tienes una cuenta?{' '}
          <button onClick={switchToLogin} className="text-[#6C4A3F] font-semibold hover:underline hover:cursor-pointer">
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;
