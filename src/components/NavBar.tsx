// src/components/Navbar.tsx
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { user, logout } = useAuth(); // Usamos el hook para obtener la información del usuario
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate('/complete-profile');
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-gray-800 text-white">
      <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate('/')}>
        🃏 Vale Cuatro
      </h1>
      {user && (
        <div className="flex items-center gap-4">
          {/* Clickeable */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={goToProfile}>
            {user.avatar && <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />}
            <span>{user.username}</span>
          </div>
          <button onClick={logout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">
            Salir
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
