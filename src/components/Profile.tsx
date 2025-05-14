// Profile.tsx
const Profile = () => {
  // Aquí puedes obtener la información del usuario desde el contexto o el almacenamiento local
  const username = localStorage.getItem('username') || 'Santi'; // Ejemplo de nombre de usuario
  const balance = 1000; // Ejemplo de saldo disponible

  return (
    <div className="h-screen bg-green-100 flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600">Perfil de {username}</h1>
        <p className="mt-4 text-lg text-gray-700">Saldo disponible: ${balance}</p>
        <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg">Recargar saldo</button>
      </div>
    </div>
  );
};

export default Profile;
