// src/components/Home.tsx

import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/vale-cuatro-logo.png'; // Asegúrate de tener el logo

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-gradient-to-r from-[#F4D59D] to-[#6C4A3F] flex justify-center items-center">
      <div className="text-center p-8 bg-opacity-80 rounded-xl w-full max-w-2xl">
        {/* Logo en la parte superior */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo Vale Cuatro" className="h-20" />
        </div>

        {/* Título y mensaje de bienvenida */}
        <h1 className="text-5xl font-bold text-white mb-4">¡Bienvenido a Vale Cuatro!</h1>
        <p className="text-lg text-white mb-6">Prepárate para disfrutar del Truco y ganar dinero mientras juegas.</p>

        {/* Sección con imágenes de ejemplo o íconos */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div
            className="bg-white rounded-lg p-6 shadow-lg cursor-pointer hover:bg-gray-100 transition"
            onClick={() => navigate('/play')}
          >
            <h3 className="text-xl font-semibold mb-2">Juega con amigos</h3>
            <p className="text-gray-600">Invita a tus amigos y compite por el primer lugar.</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Apuestas en vivo</h3>
            <p className="text-gray-600">Juega en partidas con apuestas reales y gana dinero.</p>
          </div>
        </div>

        {/* Botón de navegación al perfil */}
        <Link to="/profile">
          <button className="px-6 py-3 bg-[#8B5E3C] text-white rounded-lg shadow-md hover:bg-[#6C4A3F] transition-all ease-in-out duration-200">
            Ver mi perfil
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
