// src/components/CompleteProfileForm.tsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { completeProfile } from '../api/auth';
import { useAuth } from '../context/useAuth';

import avatar1 from '../assets/avatars/bigpoppa.jpeg';
import avatar2 from '../assets/avatars/diego.jpeg';
import avatar3 from '../assets/avatars/leo.jpeg';
import avatar4 from '../assets/avatars/man.jpeg';
// import avatar5 from '../assets/avatars/man2.jpeg';
import avatar6 from '../assets/avatars/woman.jpeg';
// import avatar7 from '../assets/avatars/woman2.jpeg';

const avatars = [avatar4, avatar1, avatar3, avatar2, avatar6];

const CompleteProfileForm = () => {
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const validateUsername = (value: string) => {
    return /^[a-zA-Z0-9_]{3,15}$/.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateUsername(username)) {
      return setError('El nombre de usuario es inválido');
    }

    if (!selectedAvatar) {
      return setError('Debes seleccionar un avatar');
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const data = await completeProfile(token, username, selectedAvatar);
      authLogin({ username: data.user.username, avatar: data.user.avatar }, token);

      navigate('/');
    } catch (error) {
      console.error('Error al completar perfil:', error);
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('No se pudo completar el perfil');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F4D59D] flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white/90 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#3C2F2F]">Completa tu perfil</h2>

        <input
          type="text"
          placeholder="Nombre de usuario"
          className="mb-4 w-full p-3 rounded bg-[#FFF5E1] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <p className="mb-2 text-[#3C2F2F] font-semibold">Elegí un avatar:</p>
        <div className="flex gap-4 mb-4">
          {avatars.map((avatar, idx) => (
            <img
              key={idx}
              src={avatar}
              alt={`Avatar ${idx + 1}`}
              className={`w-16 h-16 rounded-full cursor-pointer border-4 ${
                selectedAvatar === avatar ? 'border-[#6C4A3F]' : 'border-transparent'
              }`}
              onClick={() => setSelectedAvatar(avatar)}
            />
          ))}
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <button className="w-full bg-[#6C4A3F] text-white py-2 rounded hover:bg-[#8B5E3C] transition">Confirmar</button>
      </form>
    </div>
  );
};

export default CompleteProfileForm;
