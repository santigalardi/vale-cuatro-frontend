interface PlayerScoreProps {
  playerName: string;
  score: number;
  position: 'left' | 'right';
  isCurrentPlayer?: boolean;
}

const PlayerScore = ({ playerName, score, position }: PlayerScoreProps) => {
  return (
    <div
      className={`
      absolute ${position === 'left' ? 'left-4' : 'right-4'} top-20 
      bg-white/90 px-5 p-3 rounded-lg shadow-lg
      border-2 border-[#8B5E3C]
      transition-all duration-200
    `}
    >
      <h3 className="font-bold text-[#3C2F2F] text-center truncate max-w-[120px]">{playerName}</h3>
      <div className="text-3xl font-bold text-[#6C4A3F] text-center mt-1">
        {score}
        <span className="block text-sm font-medium text-[#3C2F2F]">puntos</span>
      </div>
    </div>
  );
};

export default PlayerScore;
