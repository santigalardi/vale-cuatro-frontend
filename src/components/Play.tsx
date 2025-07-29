import { useEffect, useState } from 'react';
import socket from '../socket';
import GameTable from './GameTable';

const Play = () => {
  const [rooms, setRooms] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null);
  const [, setRoomReady] = useState(false);
  const [currentTurn, setCurrentTurn] = useState<string | null>(null);
  const [hand, setHand] = useState<string[]>([]);

  useEffect(() => {
    // Al conectar, pedir lista de salas
    socket.on('connect', () => {
      console.log('🔌 Conectado al socket con ID:', socket.id);
      socket.emit('getRooms', (roomsList: string[]) => setRooms(roomsList));
    });

    // Actualizar listado de salas cuando cambie
    socket.on('roomsUpdated', (roomsList: string[]) => setRooms(roomsList));

    // Sala lista: guardar roomId y marcar como lista
    socket.on('roomReady', ({ roomId, players, currentTurn }) => {
      console.log(`🟢 Sala ${roomId} lista para jugar con:`, players);
      console.log('🔁 Turno inicial:', currentTurn);
      setJoinedRoom(roomId);
      setCurrentTurn(currentTurn);
    });

    // Recibir mano repartida
    socket.on('handDealt', (cards: string[]) => {
      console.log('🃏 Mano recibida:', cards);
      setHand(cards);
    });

    // Cleanup al desmontar componente
    return () => {
      socket.off('connect');
      socket.off('roomsUpdated');
      socket.off('roomReady');
      socket.off('handDealt');
    };
  }, []);

  const handleCreateRoom = () => {
    setError('');
    socket.emit('createRoom', null, ({ roomId }: { roomId: string }) => {
      setJoinedRoom(roomId);
      setRoomReady(false);
      setHand([]);
    });
  };

  const handleJoinRoom = (roomId: string) => {
    setError('');
    socket.emit('joinRoom', { roomId }, (response: { error?: string; success?: boolean }) => {
      if (response.error) {
        setError(response.error);
      } else {
        setJoinedRoom(roomId);
        setRoomReady(false);
        setHand([]);
      }
    });
  };

  console.log('🆔 Mi socket ID:', socket.id);
  console.log('🔁 Turno actual:', currentTurn);
  console.log('🟢 ¿Es mi turno?', socket.id === currentTurn);

  // Mostrar la mesa con cartas cuando la sala está lista y ya tenemos la mano
  if (joinedRoom && hand.length === 3 && currentTurn !== null) {
    return <GameTable roomId={joinedRoom} hand={hand} currentTurn={currentTurn} />;
  }

  if (joinedRoom && hand.length === 0) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-[#F4D59D] gap-4">
        <h1 className="text-3xl font-bold text-[#3C2F2F]">Sala: {joinedRoom}</h1>
        <p>Esperando otro jugador...</p>
      </div>
    );
  }

  // Vista inicial con listado de salas
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-[#F4D59D] gap-4 p-4">
      <h1 className="text-3xl font-bold text-[#3C2F2F]">Salas disponibles</h1>
      {error && <p className="text-red-600">{error}</p>}

      <ul className="mb-4 space-y-2">
        {rooms.length === 0 && <li className="text-[#3C2F2F]">No hay salas activas</li>}
        {rooms.map((roomId) => (
          <li key={roomId}>
            <button
              onClick={() => handleJoinRoom(roomId)}
              className="px-4 py-2 bg-[#6C4A3F] text-white rounded hover:bg-[#8B5E3C]"
            >
              Unirse a {roomId}
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={handleCreateRoom}
        className="px-6 py-3 bg-[#8B5E3C] text-white rounded-lg shadow-md hover:bg-[#6C4A3F]"
      >
        Crear nueva sala
      </button>
    </div>
  );
};

export default Play;
