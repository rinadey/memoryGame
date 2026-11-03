import React from 'react';
import { RotateCcw, Layers } from 'lucide-react';
import { formatTime } from '../utils/gameLogic';
import { LevelId, LevelRecord } from '../types/game';
import { IEEELogo } from './IEEELogo';

interface GrandVictoryModalProps {
  moves: number;
  timeSeconds: number;
  records: Record<LevelId, LevelRecord>;
  onReplayLevel3: () => void;
  onRestartAll: () => void;
  onLevelSelect: () => void;
}

export const GrandVictoryModal: React.FC<GrandVictoryModalProps> = ({
  moves,
  timeSeconds,
  records,
  onReplayLevel3,
  onRestartAll,
  onLevelSelect,
}) => {
  // Aggregate stats across all 3 levels
  const totalMoves = (records[1].bestMoves || 0) + (records[2].bestMoves || 0) + moves;
  const totalTime = (records[1].bestTimeSeconds || 0) + (records[2].bestTimeSeconds || 0) + timeSeconds;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071860]/80 dark:bg-black/90 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-[#071860] rounded-2xl border-2 border-[#4d6dd4] dark:border-[#4d6dd4]/60 p-6 sm:p-8 shadow-2xl text-center transform transition-all animate-in fade-in zoom-in-95 duration-300 my-auto">
        {/* BIG STAR WITH 'YOU WON!' INSIDE */}
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto mb-4 flex items-center justify-center">
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-lg"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Elegant Star Path in IEEE Cobalt */}
            <polygon
              points="100,10 126,68 189,75 142,118 155,181 100,149 45,181 58,118 11,75 74,68"
              fill="#012dc1"
              stroke="#9cffc9"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            {/* Inner subtle star hairline */}
            <polygon
              points="100,28 121,75 171,81 134,115 144,166 100,140 56,166 66,115 29,81 79,75"
              fill="none"
              stroke="#98abe6"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>

          {/* Centered Inscription */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl sm:text-2xl font-black tracking-widest text-white drop-shadow-sm uppercase">
              YOU WON!
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-wider text-[#9cffc9] uppercase mt-0.5">
              IEEE Champion
            </span>
          </div>
        </div>

        {/* IEEE Logo lockup */}
        <div className="flex justify-center mb-3">
          <IEEELogo variant="full" />
        </div>

        <h2 className="text-2xl font-black text-[#071860] dark:text-white mb-1 tracking-tight">
          Congratulations, Master!
        </h2>
        <p className="text-xs sm:text-sm text-[#4d6dd4] dark:text-[#98abe6] mb-6 max-w-sm mx-auto font-medium">
          You have conquered all 3 levels of the IEEE Student Branch Memory Challenge.
        </p>

        {/* Level Performance Summary Breakdown */}
        <div className="mb-6 bg-[#e7eaf9]/60 dark:bg-[#0a2184]/50 rounded-xl border border-[#98abe6]/50 dark:border-[#4d6dd4]/40 p-4 text-left">
          <div className="text-xs font-bold uppercase tracking-wider text-[#071860] dark:text-[#98abe6] mb-3 border-b border-[#98abe6]/40 dark:border-[#4d6dd4]/30 pb-2 flex items-center justify-between">
            <span>Level Breakdown</span>
            <span>Moves / Time</span>
          </div>

          <div className="space-y-2 text-xs sm:text-sm font-medium">
            <div className="flex items-center justify-between text-[#071860] dark:text-[#e7eaf9]">
              <span>Level 1 (3 × 3)</span>
              <span className="tabular-nums font-mono text-[#012dc1] dark:text-[#9cffc9] font-bold">
                {records[1].bestMoves ?? '—'} moves · {records[1].bestTimeSeconds ? formatTime(records[1].bestTimeSeconds) : '—'}
              </span>
            </div>

            <div className="flex items-center justify-between text-[#071860] dark:text-[#e7eaf9]">
              <span>Level 2 (4 × 4)</span>
              <span className="tabular-nums font-mono text-[#012dc1] dark:text-[#9cffc9] font-bold">
                {records[2].bestMoves ?? '—'} moves · {records[2].bestTimeSeconds ? formatTime(records[2].bestTimeSeconds) : '—'}
              </span>
            </div>

            <div className="flex items-center justify-between text-[#071860] dark:text-[#e7eaf9]">
              <span>Level 3 (5 × 5)</span>
              <span className="tabular-nums font-mono text-[#012dc1] dark:text-[#9cffc9] font-bold">
                {moves} moves · {formatTime(timeSeconds)}
              </span>
            </div>

            <div className="pt-2 border-t border-[#98abe6]/40 dark:border-[#4d6dd4]/30 flex items-center justify-between font-black text-[#071860] dark:text-white">
              <span>Overall Total</span>
              <span className="tabular-nums font-mono text-[#012dc1] dark:text-[#9cffc9]">
                {totalMoves} moves · {formatTime(totalTime)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onRestartAll}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#012dc1] hover:bg-[#0a2184] dark:bg-white dark:text-[#071860] dark:hover:bg-[#e7eaf9] transition-colors shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again From Level 1</span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={onReplayLevel3}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold text-[#071860] dark:text-[#e7eaf9] bg-[#e7eaf9] hover:bg-[#98abe6]/50 dark:bg-[#0a2184] dark:hover:bg-[#4d6dd4]/40 border border-[#98abe6]/50 dark:border-[#4d6dd4]/30 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay Level 3</span>
            </button>

            <button
              onClick={onLevelSelect}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold text-[#071860] dark:text-[#e7eaf9] bg-[#e7eaf9] hover:bg-[#98abe6]/50 dark:bg-[#0a2184] dark:hover:bg-[#4d6dd4]/40 border border-[#98abe6]/50 dark:border-[#4d6dd4]/30 transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Select Level</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
