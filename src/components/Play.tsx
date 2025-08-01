// Play.tsx

import { useEffect, useState } from 'react';
import socket from '../socket';
import GameTable from './GameTable';
import CallPanel from './CallPanel';

type TrucoState = {
  calledBy: string;
  retruco?: boolean;
} | null;

const Play = () => {
  const [mySocketId, setMySocketId] = useState<string | null>(null);
  const [rooms, setRooms] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null);
  const [, setRoomReady] = useState(false);
  const [currentTurn, setCurrentTurn] = useState<string | null>(null);
  const [hand, setHand] = useState<string[]>([]);
  const [playedCards, setPlayedCards] = useState<Record<string, string>>({});
  const [gameStarted, setGameStarted] = useState(false);
  const [canPlay, setCanPlay] = useState(true);
  const [trucoAccepted, setTrucoAccepted] = useState<boolean>(false);
  const [trucoCalledBy, setTrucoCalledBy] = useState<string | null>(null);
  const [trucoState, setTrucoState] = useState<TrucoState>(null);

  const [scores, setScores] = useState<Record<string, number>>({});
  const [playedRounds, setPlayedRounds] = useState<
    {
      round: number;
      cards: Record<string, string>;
      winner: string;
      leadPlayer: string;
    }[]
  >([]);

  useEffect(() => {
    if (socket.connected) {
      setMySocketId(socket.id ?? null);
    }

    socket.on('connect', () => {
      setMySocketId(socket.id ?? null);
      socket.emit('getRooms', (roomsList: string[]) => setRooms(roomsList));
    });

    socket.on('roomsUpdated', (roomsList: string[]) => setRooms(roomsList));

    socket.on('roomReady', ({ roomId, currentTurn }) => {
      setJoinedRoom(roomId);
      setCurrentTurn(currentTurn);
    });

    socket.on('handDealt', (cards: string[]) => {
      setHand(cards);
      setGameStarted(true);
      setCanPlay(true);
    });

    socket.on('cardPlayed', ({ playerId, card }) => {
      setPlayedCards((prev) => ({ ...prev, [playerId]: card }));
    });

    socket.on('trucoCalled', ({ by, retruco = false }) => {
      setTrucoCalledBy(by);
      setTrucoState({ calledBy: by, retruco });
    });

    socket.on('trucoResult', ({ result, points, winner }) => {
      if (result === 'no_quiero') {
        console.log(`⛔ Truco rechazado. ${winner} gana ${points} punto(s).`);
        setTrucoCalledBy(null);
        setTrucoState(null);
        setTrucoAccepted(false);
        setCanPlay(false);
      }

      if (result === 'quiero') {
        console.log(`💠 Truco aceptado. Se juegan ${points} punto(s).`);
        setTrucoAccepted(true); // ✅ ahora sí activamos el retruco
      }
    });

    socket.on('roundEnded', ({ round, cards, winner, leadPlayer }) => {
      setPlayedRounds((prev) => [...prev, { round, cards, winner, leadPlayer }]);
    });

    socket.on('scoreUpdated', ({ scores }) => {
      setScores(scores);
    });

    socket.on('clearPlayedCards', () => {
      setPlayedCards({});
      setCanPlay(true);
    });

    socket.on('roundReset', () => {
      setPlayedRounds([]);
      setTrucoAccepted(false);
      setTrucoState(null);
      setTrucoCalledBy(null);
    });

    socket.on('turnUpdated', (newTurn: string) => {
      setCurrentTurn(newTurn);
    });

    return () => {
      socket.off('connect');
      socket.off('roomsUpdated');
      socket.off('roomReady');
      socket.off('handDealt');
      socket.off('clearPlayedCards');
      socket.off('turnUpdated');
      socket.off('roundEnded');
      socket.off('scoreUpdated');
      socket.off('roundReset');
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

  useEffect(() => {
    console.log('📦 Historial completo de rondas:', playedRounds);
  }, [playedRounds]);

  if (joinedRoom && gameStarted && currentTurn !== null) {
    return (
      <div className="flex flex-col h-[93vh]">
        <div className="flex-grow overflow-hidden">
          <GameTable
            roomId={joinedRoom}
            hand={hand}
            setHand={setHand}
            currentTurn={currentTurn}
            playedCards={playedCards}
            playedRounds={playedRounds}
            scores={scores}
            canPlay={canPlay}
            setCanPlay={setCanPlay}
          />
        </div>
        <CallPanel
          roomId={joinedRoom}
          currentTurn={currentTurn}
          mySocketId={mySocketId}
          trucoCalledBy={trucoCalledBy}
          setTrucoState={setTrucoState}
          trucoAccepted={trucoAccepted}
          trucoState={trucoState}
        />
      </div>
    );
  }

  if (joinedRoom && !gameStarted) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-[#F4D59D] gap-4">
        <h1 className="text-3xl font-bold text-[#3C2F2F]">Sala: {joinedRoom}</h1>
        <p>Esperando otro jugador...</p>
      </div>
    );
  }

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
