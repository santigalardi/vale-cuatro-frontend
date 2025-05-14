// src/components/GoogleLoginButton.tsx
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function GoogleLoginButton() {
  const navigate = useNavigate(); // Usamos useNavigate para redirigir
  const { login: authLogin } = useAuth(); // Obtener la función de login desde el contexto

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/google-login', {
        tokenId: credentialResponse.credential,
      });

      localStorage.setItem('token', res.data.token);
      // Almacenar datos del usuario en el contexto
      authLogin({ username: res.data.username, avatar: res.data.avatar }, res.data.token);
      // Redirigir al home después de login exitoso
      navigate('/');
    } catch (error) {
      console.error('Error con login de Google', error);
    }
  };

  return (
    <div className="mt-4">
      <GoogleLogin onSuccess={handleSuccess} onError={() => console.error('Error al iniciar sesión con Google')} />
    </div>
  );
}

export default GoogleLoginButton;
