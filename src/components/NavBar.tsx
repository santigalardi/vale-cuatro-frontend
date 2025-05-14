// src/components/Navbar.tsx
import { useAuth } from '../context/useAuth';

function Navbar() {
  const { user, logout } = useAuth(); // Usamos el hook para obtener la información del usuario

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-gray-800 text-white">
      <h1 className="text-xl font-bold">🃏 Vale Cuatro</h1>
      {user && (
        <div className="flex items-center gap-4">
          {user.avatar && <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />}
          <span>{user.username}</span>
          <button onClick={logout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">
            Salir
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
