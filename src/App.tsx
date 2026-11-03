/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { RotateCcw, Layers } from 'lucide-react';
import { CardItem, CustomImageSlot, GamePhase, LevelId, LevelRecord } from './types/game';
import { LEVEL_CONFIGS } from './data/levelConfigs';
import { getCustomImageSlots, saveCustomImageSlots, resetCustomImageSlots } from './data/cardImages';
import { generateBoardCards } from './utils/gameLogic';
import { soundManager } from './utils/sound';
import { Header } from './components/Header';
import { GameHUD } from './components/GameHUD';
import { GameBoard } from './components/GameBoard';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { GrandVictoryModal } from './components/GrandVictoryModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { ImageManagerModal } from './components/ImageManagerModal';

const INITIAL_RECORDS: Record<LevelId, LevelRecord> = {
  1: { unlocked: true, completed: false, bestMoves: null, bestTimeSeconds: null },
  2: { unlocked: false, completed: false, bestMoves: null, bestTimeSeconds: null },
  3: { unlocked: false, completed: false, bestMoves: null, bestTimeSeconds: null },
};

export default function App() {
  // Ensure permanent dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
    try {
      localStorage.setItem('memory_game_theme', 'dark');
    } catch {
      // ignore
    }
  }, []);

  // Sound state
  const [muted, setMuted] = useState<boolean>(() => soundManager.initMuteState());

  // Game configuration & progression state
  const [currentLevel, setCurrentLevel] = useState<LevelId>(1);
  const [records, setRecords] = useState<Record<LevelId, LevelRecord>>(() => {
    try {
      const saved = localStorage.getItem('memory_game_records');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_RECORDS;
  });

  // Image slots state
  const [imageSlots, setImageSlots] = useState<CustomImageSlot[]>(() => getCustomImageSlots());

  // Active game runtime state
  const [phase, setPhase] = useState<GamePhase>('MEMORIZING');
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<CardItem[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(true);
  const [moves, setMoves] = useState<number>(0);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isNewBest, setIsNewBest] = useState<boolean>(false);

  // Modals state
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState<boolean>(false);
  const [isImageManagerOpen, setIsImageManagerOpen] = useState<boolean>(false);

  // Timers refs
  const memorizationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const playingTimerRef = useRef<NodeJS.Timeout | null>(null);


  // Persist records
  const updateRecords = useCallback((newRecords: Record<LevelId, LevelRecord>) => {
    setRecords(newRecords);
    try {
      localStorage.setItem('memory_game_records', JSON.stringify(newRecords));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Clear all running timers
  const clearTimers = useCallback(() => {
    if (memorizationTimerRef.current) {
      clearTimeout(memorizationTimerRef.current);
      memorizationTimerRef.current = null;
    }
    if (playingTimerRef.current) {
      clearInterval(playingTimerRef.current);
      playingTimerRef.current = null;
    }
  }, []);

  // Start or restart a level
  const startLevel = useCallback(
    (levelId: LevelId, customSlots: CustomImageSlot[] = imageSlots) => {
      clearTimers();

      setCurrentLevel(levelId);
      setPhase('MEMORIZING');
      setIsProcessing(true); // Locked during memorization
      setMoves(0);
      setMatchedPairs(0);
      setElapsedSeconds(0);
      setFlippedCards([]);
      setIsNewBest(false);

      // Generate randomized cards (all cards face-up for memorization)
      const newCards = generateBoardCards(levelId, customSlots);
      setCards(newCards);

      // Memorization phase (3s for L1, 5s for L2, 7s for L3; no visible numerical countdown as requested)
      const config = LEVEL_CONFIGS[levelId];
      const durationMs = config.memorizationSeconds * 1000;

      memorizationTimerRef.current = setTimeout(() => {
        // Automatically flip all pair cards face down
        setCards((prev) =>
          prev.map((card) => {
            if (card.isSpecialCenter) {
              return { ...card, isFlipped: true };
            }
            return { ...card, isFlipped: false };
          })
        );

        setPhase('PLAYING');
        setIsProcessing(false);

        // Start elapsed playing time stopwatch
        playingTimerRef.current = setInterval(() => {
          setElapsedSeconds((prev) => prev + 1);
        }, 1000);
      }, durationMs);
    },
    [clearTimers, imageSlots]
  );

  // Initial mount: start level 1
  useEffect(() => {
    startLevel(1);
    return () => clearTimers();
  }, [clearTimers, startLevel]);

  // Handle Card Click during Play
  const handleCardClick = (clickedCard: CardItem) => {
    // Guards
    if (phase !== 'PLAYING' || isProcessing) return;
    if (clickedCard.isFlipped || clickedCard.isMatched || clickedCard.isSpecialCenter) return;
    if (flippedCards.length >= 2) return;

    soundManager.playFlip();

    // Reveal this card
    const updatedCards = cards.map((c) =>
      c.id === clickedCard.id ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);

    const newFlipped = [...flippedCards, clickedCard];
    setFlippedCards(newFlipped);

    // If 2 cards are flipped, evaluate match
    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      const nextMoves = moves + 1;
      setMoves(nextMoves);

      if (first.pairId === second.pairId) {
        // MATCH!
        soundManager.playMatch();
        const nextMatched = matchedPairs + 1;
        setMatchedPairs(nextMatched);

        // Mark both cards as matched
        setCards((prev) =>
          prev.map((c) =>
            c.id === first.id || c.id === second.id
              ? { ...c, isMatched: true, isFlipped: true }
              : c
          )
        );
        setFlippedCards([]);

        // Check if level completed
        const config = LEVEL_CONFIGS[currentLevel];
        if (nextMatched === config.pairsCount) {
          // WIN CONDITION MET!
          clearTimers();
          soundManager.playVictory();

          // Calculate personal best records
          const currentRec = records[currentLevel];
          const hasBetterMoves =
            currentRec.bestMoves === null || nextMoves < currentRec.bestMoves;
          const hasBetterTime =
            currentRec.bestTimeSeconds === null || elapsedSeconds < currentRec.bestTimeSeconds;
          const newRecordEarned = hasBetterMoves || hasBetterTime;
          setIsNewBest(newRecordEarned);

          const updatedRecs: Record<LevelId, LevelRecord> = {
            ...records,
            [currentLevel]: {
              unlocked: true,
              completed: true,
              bestMoves:
                currentRec.bestMoves === null
                  ? nextMoves
                  : Math.min(currentRec.bestMoves, nextMoves),
              bestTimeSeconds:
                currentRec.bestTimeSeconds === null
                  ? elapsedSeconds
                  : Math.min(currentRec.bestTimeSeconds, elapsedSeconds),
            },
          };

          // Unlock next level if Level 1 or Level 2
          if (currentLevel < 3) {
            const nextLvl = (currentLevel + 1) as LevelId;
            updatedRecs[nextLvl] = {
              ...updatedRecs[nextLvl],
              unlocked: true,
            };
          }

          updateRecords(updatedRecs);

          // Transition to appropriate win phase
          setTimeout(() => {
            if (currentLevel === 3) {
              setPhase('GRAND_VICTORY');
            } else {
              setPhase('LEVEL_COMPLETED');
            }
          }, 400);
        }
      } else {
        // MISMATCH!
        soundManager.playMismatch();
        setIsProcessing(true);

        // Display both briefly (~1 second), then flip them back
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first.id || c.id === second.id
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  };

  // Header Handlers
  const handleToggleMute = () => setMuted(soundManager.toggleMute());

  // Modal Handlers
  const handleNextLevel = () => {
    if (currentLevel < 3) {
      startLevel((currentLevel + 1) as LevelId);
    }
  };

  const handleReplayCurrentLevel = () => {
    startLevel(currentLevel);
  };

  const handleSelectLevel = (lvl: LevelId) => {
    startLevel(lvl);
  };

  const handleRestartAll = () => {
    startLevel(1);
  };

  const handleSaveCustomSlots = (newSlots: CustomImageSlot[]) => {
    setImageSlots(newSlots);
    saveCustomImageSlots(newSlots);
    // Restart current level to apply updated images immediately
    startLevel(currentLevel, newSlots);
  };

  const handleResetCustomSlots = () => {
    resetCustomImageSlots();
    const defaults = getCustomImageSlots();
    setImageSlots(defaults);
    startLevel(currentLevel, defaults);
  };

  const activeConfig = LEVEL_CONFIGS[currentLevel];

  return (
    <div className="min-h-screen flex flex-col bg-[#071860] text-[#e7eaf9] selection:bg-[#012dc1] selection:text-white font-sans">
      {/* Top Navigation Header */}
      <Header
        currentLevel={currentLevel}
        muted={muted}
        onToggleMute={handleToggleMute}
        onOpenLevelSelect={() => setIsLevelSelectOpen(true)}
        onOpenImageManager={() => setIsImageManagerOpen(true)}
      />

      {/* Main Game Arena */}
      <main className="flex-1 flex flex-col items-center justify-between py-4 sm:py-6 px-3 sm:px-4 max-w-5xl mx-auto w-full">
        {/* Subtle IEEE Sub-header */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e7eaf9] dark:bg-[#0a2184]/70 border border-[#98abe6]/60 dark:border-[#4d6dd4]/40 text-[#071860] dark:text-[#9cffc9] text-xs font-bold tracking-tight">
            <span>IEEE Student Branch [Female]</span>
            <span>·</span>
            <span>Memory Challenge</span>
          </div>
        </div>

        {/* HUD Statistics */}
        <GameHUD
          config={activeConfig}
          moves={moves}
          matchedPairs={matchedPairs}
          elapsedSeconds={elapsedSeconds}
          phase={phase}
        />

        {/* Card Grid Area */}
        <div className="my-auto w-full flex items-center justify-center">
          <GameBoard
            cards={cards}
            gridSize={activeConfig.gridSize}
            onCardClick={handleCardClick}
            disabled={isProcessing || phase !== 'PLAYING'}
          />
        </div>

        {/* Footer Controls & Socials */}
        <footer className="w-full max-w-lg mx-auto mt-6 pt-4 border-t border-[#98abe6]/40 dark:border-[#4d6dd4]/30 flex flex-col items-center gap-3">
          <div className="flex items-center justify-center gap-3 w-full">
            <button
              onClick={handleReplayCurrentLevel}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl text-white bg-[#012dc1] hover:bg-[#0a2184] transition-colors shadow-sm"
              title="Restart current level with fresh shuffle"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart Level</span>
            </button>

            <button
              onClick={() => setIsLevelSelectOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl text-[#071860] dark:text-white bg-[#e7eaf9] dark:bg-[#0a2184] hover:bg-[#98abe6]/40 dark:hover:bg-[#4d6dd4]/40 border border-[#98abe6]/50 dark:border-[#4d6dd4]/30 transition-colors"
              title="Choose another level"
            >
              <Layers className="w-4 h-4 text-[#012dc1] dark:text-[#9cffc9]" />
              <span>Select Level</span>
            </button>
          </div>

          {/* Official IEEE KAU Social Handles (From page 2 of Guidelines) */}
          <div className="flex items-center gap-3 pt-2 text-[#4d6dd4] dark:text-[#98abe6] text-xs font-semibold">
            <div className="flex items-center gap-2">
              {/* X icon */}
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              {/* Instagram icon */}
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              {/* LinkedIn icon */}
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </div>
            <span>@ieee_kau_sb</span>
          </div>
        </footer>
      </main>

      {/* Level 1 & 2 Completion Modal */}
      {phase === 'LEVEL_COMPLETED' && (
        <LevelCompleteModal
          level={currentLevel}
          moves={moves}
          timeSeconds={elapsedSeconds}
          isNewBest={isNewBest}
          onNextLevel={handleNextLevel}
          onReplayLevel={handleReplayCurrentLevel}
          onLevelSelect={() => {
            setPhase('PLAYING');
            setIsLevelSelectOpen(true);
          }}
        />
      )}

      {/* Level 3 Final Completion Modal (Big Star with "YOU WON!") */}
      {phase === 'GRAND_VICTORY' && (
        <GrandVictoryModal
          moves={moves}
          timeSeconds={elapsedSeconds}
          records={records}
          onReplayLevel3={handleReplayCurrentLevel}
          onRestartAll={handleRestartAll}
          onLevelSelect={() => {
            setPhase('PLAYING');
            setIsLevelSelectOpen(true);
          }}
        />
      )}

      {/* Level Selector Modal */}
      {isLevelSelectOpen && (
        <LevelSelectModal
          currentLevel={currentLevel}
          records={records}
          onSelectLevel={handleSelectLevel}
          onClose={() => setIsLevelSelectOpen(false)}
        />
      )}

      {/* Custom Images Manager Modal */}
      {isImageManagerOpen && (
        <ImageManagerModal
          slots={imageSlots}
          onSaveSlots={handleSaveCustomSlots}
          onResetSlots={handleResetCustomSlots}
          onClose={() => setIsImageManagerOpen(false)}
        />
      )}
    </div>
  );
}
