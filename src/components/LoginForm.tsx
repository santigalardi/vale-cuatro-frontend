// src/components/LoginForm.tsx
import { useState } from 'react';
import { login } from '../api/auth';
import GoogleLoginButton from './GoogleLoginButton';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Usamos useNavigate para redirigir
  const { login: authLogin } = useAuth(); // Obtener la función de login desde el contexto

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      // Almacenar datos del usuario en el contexto
      authLogin({ username: data.username }, data.token);
      // Redirigir al home después de login exitoso
      navigate('/');
    } catch (error) {
      console.error(error);
      setError('Login inválido');
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4 w-80 mx-auto mt-10">
      <input
        type="email"
        placeholder="Email"
        className="p-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        className="p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-500">{error}</p>}
      <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Iniciar sesión</button>
      <GoogleLoginButton />
    </form>
  );
}

export default LoginForm;
