// CallPanel.tsx

import { useEffect } from 'react';
import socket from '../socket';

type TrucoState = {
  calledBy: string;
  retruco?: boolean;
} | null;

interface CallPanelProps {
  roomId: string;
  currentTurn: string | null;
  mySocketId: string | null;
  trucoCalledBy: string | null;
  trucoAccepted: boolean;
  trucoState: TrucoState;
  setTrucoState: React.Dispatch<React.SetStateAction<TrucoState>>;
}

const CallPanel = ({
  roomId,
  currentTurn,
  mySocketId,
  trucoCalledBy,
  trucoState,
  setTrucoState,
  trucoAccepted,
}: CallPanelProps) => {
  const isMyTurn = currentTurn === mySocketId;
  const isMyTruco = trucoCalledBy === mySocketId;
  const shouldRespondToTruco = trucoCalledBy !== null && !isMyTruco && !trucoAccepted;

  const handleTruco = () => {
    if (!isMyTurn) return;
    socket.emit('callTruco', { roomId });
  };

  const handleTrucoResponse = (response: 'quiero' | 'no_quiero' | 'retruco') => {
    socket.emit('respondTruco', { roomId, response });
    if (response === 'retruco') {
      setTrucoState((prev) => prev && { ...prev, retruco: true });
    }
  };

  useEffect(() => {
    console.log('✅ trucoAccepted cambiado a:', trucoAccepted);
  }, [trucoAccepted]);

  console.log({
    trucoAccepted,
    isMyTurn,
    isMyTruco,
    mySocketId,
    trucoCalledBy,
    trucoState,
    shouldRespondToTruco,
  });

  return (
    <div className="bg-[#6C4A3F] text-white px-6 py-3 shadow-inner flex justify-center gap-4">
      {shouldRespondToTruco ? (
        <>
          <button
            onClick={() => handleTrucoResponse('no_quiero')}
            className="bg-gray-600 hover:bg-gray-700 font-bold px-4 py-2 rounded"
          >
            No quiero
          </button>
          <button
            onClick={() => handleTrucoResponse('quiero')}
            className="bg-green-500 hover:bg-green-600 font-bold px-4 py-2 rounded"
          >
            Quiero
          </button>
        </>
      ) : trucoAccepted ? (
        <span className="text-xl italic text-green-300">✔️ Truco aceptado</span>
      ) : trucoState?.calledBy === mySocketId ? (
        <span className="text-xl italic text-yellow-300">Esperando respuesta...</span>
      ) : (
        <>
          <button
            onClick={handleTruco}
            className={`font-bold px-4 py-2 rounded ${
              isMyTurn ? 'bg-[#F4D59D] text-[#3C2F2F] hover:bg-yellow-300' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Truco
          </button>

          {/* Mostrar botón de retruco si ya se aceptó y es mi turno */}
          {/* {trucoAccepted && trucoState && trucoState.calledBy !== mySocketId && (
            <button
              onClick={() => handleTrucoResponse('retruco')}
              className="bg-yellow-500 hover:bg-yellow-600 font-bold px-4 py-2 rounded"
            >
              Retruco
            </button>
          )} */}

          <button className="bg-red-500 hover:bg-red-600 font-bold px-4 py-2 rounded">Irse al mazo</button>
        </>
      )}
    </div>
  );
};

export default CallPanel;
