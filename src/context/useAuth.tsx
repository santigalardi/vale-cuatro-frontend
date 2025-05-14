// src/context/useAuth.tsx
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    context.logout(); // llama al logout del contexto
    navigate('/'); // redirige al home
  };

  return { ...context, logout };
};
