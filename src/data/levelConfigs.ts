import { LevelConfig, LevelId } from '../types/game';

export const LEVEL_CONFIGS: Record<LevelId, LevelConfig> = {
  1: {
    level: 1,
    name: 'Level 1: Novice',
    gridSize: 3,
    totalCards: 9,
    pairsCount: 4,
    hasSpecialCenter: true,
    specialCenterIndex: 4, // Row 1, Col 1 in 3x3 grid
    specialCenterText: 'IEEE',
    memorizationSeconds: 3,
  },
  2: {
    level: 2,
    name: 'Level 2: Intermediate',
    gridSize: 4,
    totalCards: 16,
    pairsCount: 8,
    hasSpecialCenter: false,
    specialCenterIndex: -1,
    specialCenterText: '',
    memorizationSeconds: 5,
  },
  3: {
    level: 3,
    name: 'Level 3: Master',
    gridSize: 5,
    totalCards: 25,
    pairsCount: 12,
    hasSpecialCenter: true,
    specialCenterIndex: 12, // Row 2, Col 2 in 5x5 grid
    specialCenterText: 'IEEE',
    memorizationSeconds: 7,
  },
};
