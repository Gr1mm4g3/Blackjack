/**
 * GameBoard component
 * Represents the main playing area of the blackjack game
 * Includes the felt table, betting areas, and card positions
 */

import React from 'react';
import { GameState, Player, GameAction } from '@/app/lib/types/game';
import DealerHand from './DealerHand';
import PlayerHand from './PlayerHand';
import GameControls from './GameControls';

interface GameBoardProps {
  gameState: GameState;
  onPlaceBet?: (amount: number) => void;
  onAction?: (action: GameAction) => void;
  onDeal?: () => void;
  onNewGame?: () => void;
  onToggleCount?: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  onPlaceBet,
  onAction,
  onDeal,
  onNewGame,
  onToggleCount,
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
  
  // Can only deal when in betting phase and a bet has been placed
  const canDeal = gameState.phase === 'betting' && 
    player.hands.some(hand => hand.bet > 0);

  return (
    <div className="relative w-full max-w-6xl mx-auto h-[800px] rounded-[100px] bg-green-800 shadow-2xl border-8 border-brown-900">
      {/* Count Display (if enabled) */}
      {gameState.showCount && (
        <div className="absolute top-6 right-8 bg-black/50 text-white px-4 py-2 rounded-full">
          <span className="mr-4">Running Count: {gameState.runningCount}</span>
          <span>True Count: {gameState.trueCount}</span>
        </div>
      )}

      {/* Game Controls */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2">
        <GameControls
          onDeal={onDeal || (() => {})}
          onNewGame={onNewGame || (() => {})}
          onToggleCount={onToggleCount || (() => {})}
          canDeal={canDeal}
          isShowingCount={gameState.showCount}
        />
      </div>

      {/* Dealer Area */}
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-full max-w-md">
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
          <div className="mt-16 relative">
            {/* Chips Row */}
            <div className="flex justify-center items-center gap-8">
              {[5, 25, 100, 500].map((amount) => (
                <div key={amount} className="relative group">
                  <button
                    onClick={() => onPlaceBet?.(amount)}
                    className={`
                      w-20 h-20 rounded-full 
                      ${getChipStyle(amount)}
                      transform transition-all duration-300
                      group-hover:scale-110 group-active:scale-95
                      flex items-center justify-center
                      text-xl font-bold text-white
                      shadow-lg hover:shadow-xl
                      border-4 border-white/20
                      backdrop-blur-sm
                      relative z-10
                    `}
                  >
                    ${amount}
                  </button>
                  {/* Chip Stack Effect */}
                  <div className={`
                    absolute -bottom-1 left-1/2 -translate-x-1/2
                    w-[90%] h-2 rounded-full
                    ${getChipStackStyle(amount)}
                    -z-10 opacity-50
                  `} />
                </div>
              ))}
            </div>

            {/* Current Chips Display */}
            <div className="absolute -bottom-20 right-0 flex items-center gap-2">
              <div className="bg-black/60 backdrop-blur-sm text-white px-6 py-3 rounded-full 
                            text-lg font-semibold shadow-lg border border-white/10
                            transition-all duration-300 hover:bg-black/70">
                Chips: ${player.chips}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get chip styling based on amount
const getChipStyle = (amount: number): string => {
  switch (amount) {
    case 5:
      return 'bg-gradient-to-br from-red-500 to-red-700';
    case 25:
      return 'bg-gradient-to-br from-green-500 to-green-700';
    case 100:
      return 'bg-gradient-to-br from-blue-500 to-blue-700';
    case 500:
      return 'bg-gradient-to-br from-purple-500 to-purple-700';
    default:
      return 'bg-gradient-to-br from-gray-500 to-gray-700';
  }
};

// Helper function to get chip stack effect styling
const getChipStackStyle = (amount: number): string => {
  switch (amount) {
    case 5:
      return 'bg-red-900';
    case 25:
      return 'bg-green-900';
    case 100:
      return 'bg-blue-900';
    case 500:
      return 'bg-purple-900';
    default:
      return 'bg-gray-900';
  }
};

export default GameBoard;
