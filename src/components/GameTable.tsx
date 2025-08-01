// GameTable.tsx

import mesaImg from '../assets/paño.webp';
import { useMemo } from 'react';
import PlayerScore from './PlayerScore';
import socket from '../socket';

interface GameTableProps {
  roomId: string;
  hand: string[];
  setHand: React.Dispatch<React.SetStateAction<string[]>>;
  currentTurn: string | null;
  playedCards: Record<string, string>;
  playedRounds: {
    round: number;
    cards: Record<string, string>;
    winner: string;
    leadPlayer: string;
  }[];
  scores: Record<string, number>;
  canPlay: boolean;
  setCanPlay: React.Dispatch<React.SetStateAction<boolean>>;
}

const GameTable = ({
  roomId,
  hand,
  setHand,
  currentTurn,
  playedCards,
  playedRounds,
  scores,
  canPlay,
  setCanPlay,
}: GameTableProps) => {
  const isMyTurn = socket.id === currentTurn;
  const mySocketId = socket.id ?? '';
  const myScore = scores[mySocketId] ?? 0;

  const opponentId = Object.keys(scores).find((id) => id !== mySocketId);
  const opponentScore = opponentId ? (scores[opponentId] ?? 0) : 0;

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
  const handleCardClick = (card: string) => {
    console.log('💠 click en carta:', card);
    if (!isMyTurn) {
      console.log('⛔ No es tu turno');
      return;
    }
    if (!canPlay) {
      console.log('⛔ No puedes jugar aún');
      return;
    }

    socket.emit('playCard', { roomId, card });
    setHand((prev) => prev.filter((c) => c !== card));
    setCanPlay(false); // Bloquear jugadas hasta que se limpien cartas
  };

  return (
    <div className="h-screen flex flex-col items-center bg-[#F4D59D]">
      <PlayerScore playerName="Yo" score={myScore} position="right" isCurrentPlayer={true} />
      <PlayerScore playerName="Él" score={opponentScore} position="left" />
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
                    draggable={true}
                    onClick={() => handleCardClick(card)}
                  />
                </div>
              );
            })}
          </div>
        </div>
        {playedRounds.map((roundData) => {
          const leftPercent = 33 + (roundData.round - 1) * 22;
          const { winner, cards } = roundData;

          // Orden correcto: si hay ganador, su carta va última
          const entries = Object.entries(cards);
          const orderedEntries =
            winner === 'tie'
              ? entries.sort(([idA], [idB]) =>
                  idA === roundData.leadPlayer ? 1 : idB === roundData.leadPlayer ? -1 : 0
                )
              : entries.sort(([idA], [idB]) => (idA === winner ? 1 : idB === winner ? -1 : 0));

          return orderedEntries.map(([playerId, card], index) => {
            const isMe = playerId === socket.id;
            const verticalOffset = isMe ? 'top-[65%]' : 'top-[40%]';

            // zIndex más alto para el último renderizado
            const zIndex = 10 + index * 5;

            return (
              <div
                key={`round-${roundData.round}-${playerId}`}
                className={`absolute ${verticalOffset} -translate-y-1/2`}
                style={{
                  left: `calc(${leftPercent}% - 48px)`,
                  zIndex,
                }}
              >
                <img src={getCardImage(card)} alt={card} className="w-24 h-auto drop-shadow-2xl" draggable={false} />
              </div>
            );
          });
        })}
        {Object.entries(playedCards)
          .filter(([playerId, card]) => {
            // Mostrar solo si esta carta no fue registrada aún en playedRounds
            return !playedRounds.some((round) => round.cards[playerId] === card);
          })
          .map(([playerId, card]) => {
            const isMe = playerId === socket.id;
            const verticalOffset = isMe ? 'top-[65%]' : 'top-[40%]';

            const currentRound = playedRounds.length + 1;
            const baseLeft = 33;
            const offsetPerRound = 22;
            const leftPercent = baseLeft + (currentRound - 1) * offsetPerRound;

            return (
              <div
                key={`current-${playerId}`}
                className={`absolute ${verticalOffset} transform -translate-x-1/2 -translate-y-1/2`}
                style={{ left: `${leftPercent}%` }}
              >
                <img src={getCardImage(card)} alt={card} className="w-24 h-auto drop-shadow-2xl" draggable={false} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default GameTable;
