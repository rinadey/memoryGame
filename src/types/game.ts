export type LevelId = 1 | 2 | 3;

export type GamePhase = 'MEMORIZING' | 'PLAYING' | 'LEVEL_COMPLETED' | 'GRAND_VICTORY';

export interface CardItem {
  id: string; // unique card instance id (e.g. 'lvl1-card-3')
  pairId: string; // identifier of the matched pair (e.g. 'slot-2')
  label: string; // e.g. 'Image 01'
  src?: string; // image URL or base64 data string if provided
  isSpecialCenter: boolean; // true for center IEEE card on level 1 & 3
  specialLabel?: string; // 'IEEE'
  isFlipped: boolean;
  isMatched: boolean;
  gridIndex: number;
}

export interface LevelConfig {
  level: LevelId;
  name: string;
  gridSize: number; // 3, 4, 5
  totalCards: number; // 9, 16, 25
  pairsCount: number; // 4, 8, 12
  hasSpecialCenter: boolean;
  specialCenterIndex: number; // 4 for 3x3, 12 for 5x5, -1 if none
  specialCenterText: string;
  memorizationSeconds: number; // 3s for L1, 5s for L2, 7s for L3
}

export interface LevelRecord {
  unlocked: boolean;
  completed: boolean;
  bestMoves: number | null;
  bestTimeSeconds: number | null;
}

export interface CustomImageSlot {
  id: string; // e.g. 'slot-1'
  name: string; // e.g. 'Image 01'
  src: string; // empty string by default, or data URL / web path
}
