import React from 'react';
import { X, Lock, CheckCircle2, Trophy, Clock, Hash } from 'lucide-react';
import { LEVEL_CONFIGS } from '../data/levelConfigs';
import { LevelId, LevelRecord } from '../types/game';
import { formatTime } from '../utils/gameLogic';

interface LevelSelectModalProps {
  currentLevel: LevelId;
  records: Record<LevelId, LevelRecord>;
  onSelectLevel: (level: LevelId) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  currentLevel,
  records,
  onSelectLevel,
  onClose,
}) => {
  const levels: LevelId[] = [1, 2, 3];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071860]/75 dark:bg-black/85 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-[#071860] rounded-2xl border-2 border-[#98abe6]/60 dark:border-[#4d6dd4]/50 p-6 shadow-2xl text-left transform transition-all animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#98abe6]/40 dark:border-[#4d6dd4]/30 mb-4">
          <div>
            <h3 className="text-lg font-black text-[#071860] dark:text-white">
              Select Difficulty Level
            </h3>
            <p className="text-xs text-[#4d6dd4] dark:text-[#98abe6] mt-0.5 font-medium">
              Progressive board sizes from 3 × 3 to 5 × 5
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#071860] dark:text-[#98abe6] hover:bg-[#e7eaf9] dark:hover:bg-[#0a2184] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {levels.map((lvl) => {
            const config = LEVEL_CONFIGS[lvl];
            const rec = records[lvl];
            const isUnlocked = rec.unlocked;
            const isCurrent = currentLevel === lvl;

            return (
              <button
                key={lvl}
                disabled={!isUnlocked}
                onClick={() => {
                  onSelectLevel(lvl);
                  onClose();
                }}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                  !isUnlocked
                    ? 'opacity-40 cursor-not-allowed border-[#98abe6]/30 dark:border-[#0a2184] bg-slate-50 dark:bg-[#05113d]'
                    : isCurrent
                    ? 'border-[#012dc1] dark:border-[#9cffc9] bg-[#e7eaf9]/70 dark:bg-[#0a2184]/70 shadow-sm'
                    : 'border-[#98abe6]/40 dark:border-[#4d6dd4]/30 bg-white dark:bg-[#0a2184]/30 hover:border-[#012dc1] dark:hover:border-[#4d6dd4]'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#071860] dark:text-white">
                      Level {lvl}
                    </span>
                    <span className="text-xs text-[#4d6dd4] dark:text-[#98abe6] font-medium">
                      ({config.gridSize} × {config.gridSize} Grid · {config.pairsCount} Pairs · {config.memorizationSeconds}s Preview)
                    </span>
                    {config.hasSpecialCenter && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#012dc1] text-white font-mono font-bold">
                        IEEE Center
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-[#0a2184] dark:text-[#98abe6] flex items-center gap-3 font-medium">
                    {rec.completed ? (
                      <span className="flex items-center gap-1 text-[#012dc1] dark:text-[#9cffc9] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[#012dc1] dark:text-[#98abe6] font-bold">Unlocked</span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-400">
                        <Lock className="w-3 h-3" /> Complete Level {lvl - 1} to unlock
                      </span>
                    )}

                    {rec.bestMoves !== null && (
                      <span className="flex items-center gap-1 tabular-nums font-mono text-[11px] font-bold">
                        <Hash className="w-3 h-3 text-[#012dc1] dark:text-[#9cffc9]" /> {rec.bestMoves} moves · <Clock className="w-3 h-3 ml-1 text-[#012dc1] dark:text-[#9cffc9]" /> {formatTime(rec.bestTimeSeconds || 0)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 pl-3">
                  {!isUnlocked ? (
                    <div className="p-2 rounded-lg bg-slate-200/50 dark:bg-[#05113d] text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                  ) : rec.completed ? (
                    <div className="p-2 rounded-lg bg-[#9cffc9]/25 text-[#071860] dark:text-[#9cffc9]">
                      <Trophy className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#012dc1] text-white shadow-xs">
                      Play
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-[#071860] dark:text-[#e7eaf9] bg-[#e7eaf9] hover:bg-[#98abe6]/50 dark:bg-[#0a2184] dark:hover:bg-[#4d6dd4]/40 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
