'use client';

import { useState } from 'react';
import GameBoard from './components/game/GameBoard';
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

  return (
    <main className="min-h-screen bg-gray-900 p-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Blackjack Trainer
        </h1>
        
        <GameBoard
          gameState={gameState}
          onPlaceBet={handlePlaceBet}
          onAction={handleAction}
        />
        
        <div className="mt-8 text-center text-white">
          <p className="text-sm opacity-70">
            Learn perfect basic strategy and card counting
          </p>
        </div>
      </div>
    </main>
  );
}
