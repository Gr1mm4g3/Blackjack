'use client';

import { useState } from 'react';
import { GameProvider } from './lib/context/GameContext';
import GameBoard from './components/game/GameBoard';
import GameTable from './components/game/GameTable';
import { GameState, GameAction } from './lib/types/game';

export default function Home() {
  // Initialize with a basic game state
  const [gameState, setGameState] = useState<GameState>({
    deck: [],
    players: [
      {
        hands: [{ cards: [], bet: 0, isDoubledDown: false, isSplit: false, isComplete: false }],
        chips: 1000,
        isDealer: true,
      },
      {
        hands: [{ cards: [], bet: 0, isDoubledDown: false, isSplit: false, isComplete: false }],
        chips: 1000,
        isDealer: false,
      },
    ],
    currentPlayerIndex: 1,
    currentHandIndex: 0,
    phase: 'betting',
    minimumBet: 5,
    runningCount: 0,
    trueCount: 0,
    showCount: true,
  });

  const handlePlaceBet = (amount: number) => {
    // Placeholder for bet handling
    console.log('Placing bet:', amount);
  };

  const handleAction = (action: GameAction) => {
    // Placeholder for action handling
    console.log('Player action:', action);
  };

  const handleDeal = () => {
    // Placeholder for deal handling
    console.log('Dealing cards...');
  };

  const handleNewGame = () => {
    // Reset game state
    setGameState(prevState => ({
      ...prevState,
      deck: [],
      players: [
        {
          hands: [{ cards: [], bet: 0, isDoubledDown: false, isSplit: false, isComplete: false }],
          chips: 1000,
          isDealer: true,
        },
        {
          hands: [{ cards: [], bet: 0, isDoubledDown: false, isSplit: false, isComplete: false }],
          chips: 1000,
          isDealer: false,
        },
      ],
      currentPlayerIndex: 1,
      currentHandIndex: 0,
      phase: 'betting',
      runningCount: 0,
      trueCount: 0,
    }));
    console.log('Starting new game...');
  };

  const handleToggleCount = () => {
    // Toggle count display
    setGameState(prevState => ({
      ...prevState,
      showCount: !prevState.showCount,
    }));
  };

  return (
    <GameProvider>
      <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-green-800">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
          <GameBoard 
            gameState={gameState}
            onPlaceBet={handlePlaceBet}
            onAction={handleAction}
            onDeal={handleDeal}
            onNewGame={handleNewGame}
            onToggleCount={handleToggleCount}
          />
        </div>
      </main>
    </GameProvider>
  );
}
