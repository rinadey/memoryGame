import React from 'react';
import { ArrowRight, RotateCcw, Clock, Hash } from 'lucide-react';
import { formatTime } from '../utils/gameLogic';
import { LevelId } from '../types/game';
import { IEEEDiamond } from './IEEELogo';

interface LevelCompleteModalProps {
  level: LevelId;
  moves: number;
  timeSeconds: number;
  isNewBest: boolean;
  onNextLevel: () => void;
  onReplayLevel: () => void;
  onLevelSelect: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  level,
  moves,
  timeSeconds,
  onNextLevel,
  onReplayLevel,
  onLevelSelect,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071860]/85 backdrop-blur-xs">
      <div className="w-full max-w-md bg-[#071860] rounded-2xl border-2 border-[#4d6dd4]/60 p-6 sm:p-8 shadow-2xl text-center transform transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* IEEE Diamond Emblem */}
        <div className="w-16 h-16 mx-auto rounded-full bg-[#0a2184] border-2 border-[#4d6dd4] text-[#9cffc9] flex items-center justify-center mb-4 shadow-sm">
          <IEEEDiamond size={32} />
        </div>

        <h2 className="text-2xl font-black text-white mb-6 tracking-tight">
          Level {level} Completed
        </h2>

        {/* Stats card */}
        <div className="grid grid-cols-2 gap-3 mb-6 bg-[#0a2184]/70 p-4 rounded-xl border border-[#4d6dd4]/40">
          <div className="flex flex-col items-center">
            <span className="flex items-center gap-1 text-xs text-[#98abe6] mb-1 font-bold">
              <Hash className="w-3.5 h-3.5 text-[#9cffc9]" /> Total Moves
            </span>
            <span className="text-xl font-black text-white tabular-nums">
              {moves}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="flex items-center gap-1 text-xs text-[#98abe6] mb-1 font-bold">
              <Clock className="w-3.5 h-3.5 text-[#9cffc9]" /> Time Elapsed
            </span>
            <span className="text-xl font-black text-white tabular-nums">
              {formatTime(timeSeconds)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onNextLevel}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#012dc1] hover:bg-[#0a2184] transition-colors shadow-md"
          >
            <span>Proceed to Level {level + 1}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={onReplayLevel}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold text-[#e7eaf9] bg-[#0a2184] hover:bg-[#4d6dd4]/40 border border-[#4d6dd4]/40 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay Level</span>
            </button>

            <button
              onClick={onLevelSelect}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold text-[#e7eaf9] bg-[#0a2184] hover:bg-[#4d6dd4]/40 border border-[#4d6dd4]/40 transition-colors"
            >
              <span>Level Select</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
