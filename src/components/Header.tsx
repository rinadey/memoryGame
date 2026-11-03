import React from 'react';
import { Volume2, VolumeX, Image as ImageIcon, Layers } from 'lucide-react';
import { LevelId } from '../types/game';
import { IEEELogo } from './IEEELogo';

interface HeaderProps {
  currentLevel: LevelId;
  muted: boolean;
  onToggleMute: () => void;
  onOpenLevelSelect: () => void;
  onOpenImageManager: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLevel,
  muted,
  onToggleMute,
  onOpenLevelSelect,
  onOpenImageManager,
}) => {
  return (
    <header className="w-full border-b border-[#4d6dd4]/25 bg-[#071860]/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-18 flex items-center justify-between gap-3 sm:gap-6">
        {/* Zone 1: IEEE KAU Official Brand Wordmark */}
        <div className="flex items-center shrink-0">
          <IEEELogo
            variant="full"
            textColor="text-white"
            subtextColor="text-[#98abe6]"
          />
        </div>

        {/* Zone 2: Level Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onOpenLevelSelect}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg text-white bg-[#0a2184] hover:bg-[#4d6dd4]/40 border border-[#4d6dd4]/40 transition-colors whitespace-nowrap shadow-xs"
            title="Switch Level"
          >
            <Layers className="w-3.5 h-3.5 text-[#9cffc9]" />
            <span>Level {currentLevel}</span>
          </button>
        </div>

        {/* Zone 3: Actions (Images, Audio) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={onOpenImageManager}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg text-[#e7eaf9] hover:bg-[#0a2184] transition-colors border border-transparent hover:border-[#4d6dd4]/40"
            title="Manage Card Images"
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#98abe6]" />
            <span className="hidden sm:inline">Images</span>
          </button>

          <button
            onClick={onToggleMute}
            className="p-2 rounded-lg text-[#e7eaf9] hover:bg-[#0a2184] transition-colors"
            title={muted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-[#98abe6]" />}
          </button>
        </div>
      </div>
    </header>
  );
};
