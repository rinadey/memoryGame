import React from 'react';
import { Clock, CheckCircle2, Hash, Sparkles, Eye } from 'lucide-react';
import { formatTime } from '../utils/gameLogic';
import { GamePhase, LevelConfig } from '../types/game';

interface GameHUDProps {
  config: LevelConfig;
  moves: number;
  matchedPairs: number;
  elapsedSeconds: number;
  phase: GamePhase;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  config,
  moves,
  matchedPairs,
  elapsedSeconds,
  phase,
}) => {
  const totalPairs = config.pairsCount;
  const remainingPairs = totalPairs - matchedPairs;

  return (
    <div className="w-full max-w-2xl mx-auto mb-4 sm:mb-6 px-3">
      {/* Memorization Phase Notice - Styled with IEEE brand accents */}
      {phase === 'MEMORIZING' && (
        <div className="mb-3 sm:mb-4 py-2 px-4 rounded-xl bg-[#e7eaf9] dark:bg-[#0a2184]/60 border-2 border-[#98abe6] dark:border-[#4d6dd4] text-center flex items-center justify-center gap-2 text-[#071860] dark:text-[#e7eaf9] shadow-xs">
          <Eye className="w-4 h-4 text-[#012dc1] dark:text-[#9cffc9] shrink-0" />
          <span className="text-xs sm:text-sm font-bold tracking-tight">
            Memorization Phase — Study the card positions before they flip
          </span>
        </div>
      )}

      {/* Primary Metrics Grid in IEEE Palette */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Metric 1: Moves */}
        <div className="p-3 rounded-xl bg-white dark:bg-[#071860] border border-[#98abe6]/50 dark:border-[#4d6dd4]/30 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#e7eaf9] dark:bg-[#0a2184] flex items-center justify-center text-[#012dc1] dark:text-[#98abe6] shrink-0">
            <Hash className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#4d6dd4] dark:text-[#98abe6]">
              Moves
            </div>
            <div className="text-base sm:text-lg font-black tabular-nums text-[#071860] dark:text-white">
              {moves}
            </div>
          </div>
        </div>

        {/* Metric 2: Matched Pairs */}
        <div className="p-3 rounded-xl bg-white dark:bg-[#071860] border border-[#98abe6]/50 dark:border-[#4d6dd4]/30 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#e7eaf9] dark:bg-[#0a2184] flex items-center justify-center text-[#012dc1] dark:text-[#9cffc9] shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#4d6dd4] dark:text-[#98abe6]">
              Matched
            </div>
            <div className="text-base sm:text-lg font-black tabular-nums text-[#071860] dark:text-white">
              {matchedPairs} <span className="text-xs font-semibold text-[#98abe6]">/ {totalPairs}</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Remaining */}
        <div className="p-3 rounded-xl bg-white dark:bg-[#071860] border border-[#98abe6]/50 dark:border-[#4d6dd4]/30 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#e7eaf9] dark:bg-[#0a2184] flex items-center justify-center text-[#012dc1] dark:text-[#98abe6] shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#4d6dd4] dark:text-[#98abe6]">
              Remaining
            </div>
            <div className="text-base sm:text-lg font-black tabular-nums text-[#071860] dark:text-white">
              {remainingPairs}
            </div>
          </div>
        </div>

        {/* Metric 4: Elapsed Time */}
        <div className="p-3 rounded-xl bg-white dark:bg-[#071860] border border-[#98abe6]/50 dark:border-[#4d6dd4]/30 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#e7eaf9] dark:bg-[#0a2184] flex items-center justify-center text-[#012dc1] dark:text-[#98abe6] shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#4d6dd4] dark:text-[#98abe6]">
              Time
            </div>
            <div className="text-base sm:text-lg font-black tabular-nums text-[#071860] dark:text-white">
              {formatTime(elapsedSeconds)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
