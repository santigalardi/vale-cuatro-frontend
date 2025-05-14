// src/components/Home.tsx (Modificado)

import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="h-screen bg-blue-100 flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600">¡Bienvenido a Vale Cuatro!</h1>
        <p className="mt-4 text-lg text-gray-700">¡Preparate para jugar al Truco y ganar dinero!</p>
        <Link to="/profile">
          <button className="mt-6 px-4 py-2 bg-green-500 text-white rounded-lg">Ver mi perfil</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
