import React from 'react';
import { Image as ImageIcon, Check } from 'lucide-react';
import { CardItem } from '../types/game';
import { IEEEDiamond } from './IEEELogo';

interface CardComponentProps {
  card: CardItem;
  onClick: (card: CardItem) => void;
  disabled: boolean;
  gridSize: number;
}

export const CardComponent: React.FC<CardComponentProps> = ({
  card,
  onClick,
  disabled,
  gridSize,
}) => {
  const isClickable = !disabled && !card.isFlipped && !card.isMatched && !card.isSpecialCenter;

  const handleClick = () => {
    if (isClickable) {
      onClick(card);
    }
  };

  // Dynamic card aspect ratio and sizing based on grid dimensions (3x3, 4x4, 5x5)
  const sizeClasses =
    gridSize === 3
      ? 'w-24 h-28 sm:w-32 sm:h-36 md:w-36 md:h-44'
      : gridSize === 4
      ? 'w-18 h-22 sm:w-24 sm:h-30 md:w-28 md:h-34'
      : 'w-14 h-18 sm:w-20 sm:h-24 md:w-24 md:h-28';

  return (
    <div
      className={`relative select-none perspective-800 ${sizeClasses} transition-transform ${
        isClickable ? 'cursor-pointer hover:scale-[1.03] active:scale-[0.97]' : 'cursor-default'
      }`}
      onClick={handleClick}
      role="button"
      tabIndex={isClickable ? 0 : -1}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && isClickable) {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={
        card.isSpecialCenter
          ? 'Special Center IEEE Card'
          : card.isFlipped
          ? card.label
          : 'Face down card'
      }
    >
      <div
        className={`w-full h-full duration-500 transform-style-3d transition-transform relative rounded-xl shadow-xs ${
          card.isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* ================= CARD BACK (Official IEEE Identity) ================= */}
        <div
          className="absolute inset-0 w-full h-full rounded-xl backface-hidden flex items-center justify-center p-2 sm:p-2.5 
                     bg-gradient-to-br from-[#0a2184] via-[#071860] to-[#05113d] text-white border-2 border-[#4d6dd4]/40 shadow-sm
                     dark:from-[#0a2184] dark:to-[#040e30] dark:border-[#4d6dd4]/60"
        >
          {/* Subtle IEEE geometric pattern */}
          <div className="w-full h-full rounded-lg border border-[#98abe6]/30 flex flex-col items-center justify-center relative overflow-hidden bg-[#071860]/40">
            {/* Subtle corner marks */}
            <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-[#98abe6]/50" />
            <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-[#98abe6]/50" />
            <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-[#98abe6]/50" />
            <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-[#98abe6]/50" />

            {/* Center IEEE Diamond Emblem */}
            <div className="flex flex-col items-center justify-center text-[#98abe6] group-hover:text-white transition-colors">
              <IEEEDiamond size={gridSize === 5 ? 20 : 26} className="text-[#98abe6] drop-shadow-xs" />
              <span className="text-[8px] sm:text-[9px] font-black tracking-widest text-[#98abe6]/80 mt-1 uppercase">
                IEEE
              </span>
            </div>
          </div>
        </div>

        {/* ================= CARD FRONT ================= */}
        <div
          className={`absolute inset-0 w-full h-full rounded-xl backface-hidden rotate-y-180 flex flex-col items-center justify-center p-1.5 sm:p-2
            ${
              card.isSpecialCenter
                ? 'bg-gradient-to-br from-[#0a2184] to-[#071860] text-white border-2 border-[#012dc1] shadow-md dark:border-[#4d6dd4]'
                : 'bg-white dark:bg-[#071860] text-[#071860] dark:text-[#e7eaf9] border-2 border-[#e7eaf9] dark:border-[#0a2184] shadow-xs'
            }
            ${card.isMatched && !card.isSpecialCenter ? 'ring-2 ring-[#012dc1] dark:ring-[#9cffc9]' : ''}
          `}
        >
          {card.isSpecialCenter ? (
            /* Special Center IEEE Card (Official IEEE Identity) */
            <div className="w-full h-full rounded-lg flex flex-col items-center justify-center border border-[#98abe6]/40 bg-[#071860]/70 p-2 text-center relative overflow-hidden">
              <div className="mb-1 text-white">
                <IEEEDiamond size={gridSize === 5 ? 22 : 30} className="text-[#9cffc9] drop-shadow-sm" />
              </div>
              <span className="text-sm sm:text-lg font-black tracking-wider text-white leading-tight">
                IEEE
              </span>
              <span className="text-[8px] sm:text-[9px] text-[#98abe6] font-medium tracking-tight whitespace-nowrap mt-0.5">
                KAU Branch
              </span>
            </div>
          ) : card.src ? (
            /* Custom / Provided Meme Image */
            <div className="w-full h-full relative rounded-lg overflow-hidden flex items-center justify-center bg-[#e7eaf9]/40 dark:bg-[#05113d]">
              <img
                src={card.src}
                alt={card.label}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none"
                loading="eager"
              />
              {card.isMatched && (
                <div className="absolute top-1.5 right-1.5 bg-[#012dc1] dark:bg-[#9cffc9] text-white dark:text-[#071860] rounded-full p-1 shadow-md">
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                </div>
              )}
            </div>
          ) : (
            /* Clean Formal Image Placeholder */
            <div className="w-full h-full rounded-lg border-2 border-dashed border-[#98abe6]/60 dark:border-[#4d6dd4]/40 flex flex-col items-center justify-center p-1.5 text-center bg-[#e7eaf9]/20 dark:bg-[#0a2184]/30">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-md bg-[#e7eaf9] dark:bg-[#0a2184] flex items-center justify-center text-[#012dc1] dark:text-[#98abe6] mb-1">
                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-[#071860] dark:text-white truncate max-w-full px-1">
                {card.label}
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#4d6dd4] dark:text-[#98abe6] font-mono tracking-tight">
                Placeholder
              </span>

              {card.isMatched && (
                <div className="absolute top-1 right-1 bg-[#012dc1] text-white rounded-full p-0.5 shadow-xs">
                  <Check className="w-2.5 h-2.5" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
