/**
 * GameBoard component
 * Represents the main playing area of the blackjack game
 * Includes the felt table, betting areas, and card positions
 */

import React from 'react';
import { GameState, Player, GameAction } from '@/app/lib/types/game';
import DealerHand from './DealerHand';
import PlayerHand from './PlayerHand';

interface GameBoardProps {
  gameState: GameState;
  onPlaceBet?: (amount: number) => void;
  onAction?: (action: GameAction) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  onPlaceBet,
  onAction,
}) => {
  const dealer = gameState.players.find(p => p.isDealer);
  const player = gameState.players.find(p => !p.isDealer);

  if (!dealer || !player) return null;

  const currentHand = player.hands[gameState.currentHandIndex];
  const canSplit = currentHand?.cards.length === 2 && 
    currentHand.cards[0].rank === currentHand.cards[1].rank &&
    player.chips >= currentHand.bet;
  const canDoubleDown = currentHand?.cards.length === 2 && 
    player.chips >= currentHand.bet;
  const canSurrender = currentHand?.cards.length === 2 && 
    gameState.phase === 'playerAction';

  return (
    <div className="relative w-full max-w-6xl mx-auto h-[800px] rounded-[100px] bg-green-800 shadow-2xl border-8 border-brown-900">
      {/* Count Display (if enabled) */}
      {gameState.showCount && (
        <div className="absolute top-6 right-8 bg-black/50 text-white px-4 py-2 rounded-full">
          <span className="mr-4">Running Count: {gameState.runningCount}</span>
          <span>True Count: {gameState.trueCount}</span>
        </div>
      )}

      {/* Dealer Area */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full max-w-md">
        <DealerHand
          hand={dealer.hands[0]}
          isDealing={gameState.phase === 'dealing'}
          showHoleCard={gameState.phase === 'dealerAction' || gameState.phase === 'payout'}
        />
      </div>

      {/* Player Area */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-full max-w-md">
        <PlayerHand
          hand={currentHand}
          isActive={gameState.phase === 'playerAction'}
          canSplit={canSplit}
          canDoubleDown={canDoubleDown}
          canSurrender={canSurrender}
          suggestedAction={gameState.phase === 'playerAction' ? 'hit' : undefined}
          onAction={onAction}
        />

        {/* Betting Area */}
        {gameState.phase === 'betting' && (
          <div className="mt-16">
            <div className="flex justify-center gap-4">
              {[5, 25, 100, 500].map((amount) => (
                <button
                  key={amount}
                  onClick={() => onPlaceBet?.(amount)}
                  className={`
                    w-20 h-20 rounded-full 
                    ${getChipStyle(amount)}
                    transform hover:scale-110 transition-transform
                    flex items-center justify-center
                    text-white font-bold shadow-lg
                    border-4 border-white/20
                  `}
                >
                  ${amount}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Player Info */}
        <div className="absolute bottom-0 right-4 bg-black/50 text-white px-4 py-2 rounded-full">
          Chips: ${player.chips}
        </div>
      </div>
    </div>
  );
};

// Helper function to get chip styling based on amount
const getChipStyle = (amount: number): string => {
  switch (amount) {
    case 5:
      return 'bg-red-600';
    case 25:
      return 'bg-green-600';
    case 100:
      return 'bg-blue-600';
    case 500:
      return 'bg-purple-600';
    default:
      return 'bg-gray-600';
  }
};

export default GameBoard;
