import React from 'react';
import { CardItem } from '../types/game';
import { CardComponent } from './CardComponent';

interface GameBoardProps {
  cards: CardItem[];
  gridSize: number;
  onCardClick: (card: CardItem) => void;
  disabled: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  cards,
  gridSize,
  onCardClick,
  disabled,
}) => {
  const gridColsClass =
    gridSize === 3
      ? 'grid-cols-3'
      : gridSize === 4
      ? 'grid-cols-4'
      : 'grid-cols-5';

  return (
    <div className="w-full flex items-center justify-center py-2 px-2">
      <div
        className={`grid ${gridColsClass} gap-2 sm:gap-3 md:gap-3.5 max-w-full place-items-center`}
      >
        {cards.map((card) => (
          <CardComponent
            key={card.id}
            card={card}
            onClick={onCardClick}
            disabled={disabled}
            gridSize={gridSize}
          />
        ))}
      </div>
    </div>
  );
};
