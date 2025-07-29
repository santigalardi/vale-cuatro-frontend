import mesaImg from '../assets/paño.webp';
import { useMemo } from 'react';
import PlayerScore from './PlayerScore';
import socket from '../socket';

interface GameTableProps {
  roomId: string;
  hand: string[];
  currentTurn: string | null;
}

const GameTable = ({ roomId, hand, currentTurn }: GameTableProps) => {
  const isMyTurn = socket.id === currentTurn;

  const cards = useMemo(() => {
    const modules = import.meta.glob('../assets/cards/*.jpg', { eager: true }) as Record<string, { default: string }>;
    const mapped: Record<string, string> = {};
    for (const path in modules) {
      mapped[path] = modules[path].default;
    }
    return mapped;
  }, []);

  const getCardImage = (cardName: string): string => {
    const key = `../assets/cards/${cardName}.jpg`;
    return cards[key] || '';
  };

  return (
    <div className="h-screen flex flex-col items-center bg-[#F4D59D]">
      <PlayerScore playerName="Yo" score={0} position="right" isCurrentPlayer={true} />
      <PlayerScore playerName="Él" score={0} position="left" />
      <h1 className="text-2xl font-bold text-[#3C2F2F] mt-8 mb-4">Sala: {roomId}</h1>

      {isMyTurn ? (
        <p className="text-green-700 font-semibold mt-2">¡Es tu turno!</p>
      ) : (
        <p className="text-gray-600 mt-2">Esperando al oponente...</p>
      )}

      <div className="w-full max-w-3xl h-[60vh] relative rounded-2xl overflow-hidden border-4 border-[#6C4A3F] shadow-xl">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${mesaImg})` }} />

        {/* Contenedor de cartas con efecto de abanico completo */}
        <div className="absolute inset-0 flex justify-center items-end pb-8">
          <div className="flex items-end">
            {' '}
            {/* Alineamos por la base */}
            {hand.map((card, index) => {
              // Ajustes para el efecto de abanico
              const angle = (index - 1) * 12; // -12°, 0°, +12°
              const yOffset = index === 1 ? 0 : 12; // 12px abajo para laterales
              const scale = index === 1 ? 1.05 : 1; // La central un poco más grande

              return (
                <div
                  key={card}
                  className="transition-all duration-200 hover:scale-110 hover:z-10 hover:-translate-y-2"
                  style={{
                    transform: `rotate(${angle}deg) translateY(${yOffset}px) scale(${scale})`,
                    margin: '0 -10px',
                    zIndex: index,
                  }}
                >
                  <img
                    src={getCardImage(card)}
                    alt={card}
                    className="w-20 h-auto rounded shadow-xl cursor-pointer"
                    draggable={false}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameTable;
