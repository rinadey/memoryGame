import { LEVEL_CONFIGS } from '../data/levelConfigs';
import { CardItem, CustomImageSlot, LevelId } from '../types/game';

// Fisher-Yates array shuffle
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function generateBoardCards(
  levelId: LevelId,
  imageSlots: CustomImageSlot[]
): CardItem[] {
  const config = LEVEL_CONFIGS[levelId];

  // For Level 1 (4 pairs) and Level 2 (8 pairs), randomly pick pairs from the pool of 12.
  // For Level 3 (12 pairs), use all 12 pairs.
  const activeSlots =
    levelId === 3
      ? imageSlots.slice(0, 12)
      : shuffleArray(imageSlots).slice(0, config.pairsCount);

  // Create pairs
  const pairCards: Array<Omit<CardItem, 'id' | 'gridIndex'>> = [];
  activeSlots.forEach((slot) => {
    // Exactly 2 cards per slot/image
    for (let i = 0; i < 2; i++) {
      pairCards.push({
        pairId: slot.id,
        label: slot.name,
        src: slot.src,
        isSpecialCenter: false,
        isFlipped: true, // Face up for memorization phase
        isMatched: false,
      });
    }
  });

  // Shuffle pair cards
  const shuffledPairs = shuffleArray(pairCards);

  // If level has a special center card (Level 1 & Level 3)
  const fullBoard: CardItem[] = [];
  let pairCardIndex = 0;

  for (let i = 0; i < config.totalCards; i++) {
    if (config.hasSpecialCenter && i === config.specialCenterIndex) {
      // Special center card (IEEE)
      fullBoard.push({
        id: `lvl-${levelId}-center-ieee`,
        pairId: 'special-center-ieee',
        label: config.specialCenterText,
        isSpecialCenter: true,
        specialLabel: config.specialCenterText,
        isFlipped: true, // Always flipped/revealed
        isMatched: true, // Not part of matching pairs
        gridIndex: i,
      });
    } else {
      const cardData = shuffledPairs[pairCardIndex++];
      fullBoard.push({
        ...cardData,
        id: `lvl-${levelId}-card-${i}-${cardData.pairId}`,
        gridIndex: i,
      });
    }
  }

  return fullBoard;
}
