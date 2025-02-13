/**
 * GameBoard component
 * Represents the main playing area of the blackjack game
 * Includes the felt table, betting areas, and card positions
 */

import React, { useState } from 'react';
import { GameAction } from '@/app/lib/types/game';
import DealerHand from './DealerHand';
import PlayerHand from './PlayerHand';
import GameControls from './GameControls';
import { calculateHandValue } from '@/app/lib/utils/gameUtils';
import { useGameContext } from '@/app/lib/context/GameContext';

export const GameBoard: React.FC = () => {
  const { state: gameState, dispatch } = useGameContext();
  const [isDealing, setIsDealing] = useState(false);

  // Get player and dealer from game state
  const dealer = gameState.players.find(p => p.isDealer);
  const player = gameState.players.find(p => !p.isDealer);
  const currentHand = player.hands[gameState.currentHandIndex];

  // Handle dealer's turn
  React.useEffect(() => {
    if (gameState.phase === 'dealerAction') {
      // Add a small delay before dealer plays
      const timer = setTimeout(() => {
        dispatch({ type: 'DEALER_PLAY' });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState.phase, dispatch]);

  if (!dealer || !player) return null;

  // Action handlers
  const handleDeal = () => {
    setIsDealing(true);
    dispatch({ type: 'DEAL_CARDS' });
    // Reset dealing state after animation completes
    setTimeout(() => setIsDealing(false), 1000);
  };

  const handleNewGame = () => {
    dispatch({ type: 'NEW_GAME' });
  };

  const handleToggleCount = () => {
    dispatch({ type: 'TOGGLE_COUNT' });
  };

  const handlePlaceBet = (amount: number) => {
    dispatch({ type: 'PLACE_BET', amount });
  };

  const handleAction = (action: GameAction) => {
    if (action === 'hit') {
      setIsDealing(true);
      setTimeout(() => setIsDealing(false), 500);
    }
    dispatch({ type: 'PLAYER_ACTION', action });
  };

  // Game state checks
  const canDeal = gameState.phase === 'betting' && currentHand.bet >= gameState.minimumBet;
  const canSplit = currentHand?.cards.length === 2 && 
    currentHand.cards[0].rank === currentHand.cards[1].rank &&
    player.chips >= currentHand.bet;
  const canDoubleDown = currentHand?.cards.length === 2 && 
    player.chips >= currentHand.bet;
  const canSurrender = currentHand?.cards.length === 2 && 
    gameState.phase === 'playerAction';

  // Helper function to get chip styling based on amount
  const getChipStyle = (amount: number): string => {
    switch (amount) {
      case 5:
        return 'bg-red-600 ring-red-300';
      case 25:
        return 'bg-emerald-600 ring-emerald-300';
      case 100:
        return 'bg-blue-600 ring-blue-300';
      case 500:
        return 'bg-purple-600 ring-purple-300';
      default:
        return 'bg-gray-600 ring-gray-300';
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto h-[800px] rounded-[100px] bg-green-800 shadow-2xl border-8 border-brown-900">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-24 flex items-center justify-between px-8">
        {/* Count Display */}
        {gameState.showCount && (
          <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full z-20">
            <span className="mr-4">Running Count: {gameState.runningCount}</span>
            <span>True Count: {gameState.trueCount.toFixed(1)}</span>
          </div>
        )}

        {/* Game Controls */}
        <div className="flex gap-4 z-20">
          <button
            onClick={handleDeal}
            disabled={!canDeal}
            className={`
              px-6 py-2 rounded-full font-semibold
              transition-all duration-300
              ${canDeal 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                : 'bg-gray-600 cursor-not-allowed opacity-50'
              }
            `}
          >
            Deal
          </button>
          <button
            onClick={handleNewGame}
            className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-300"
          >
            New Game
          </button>
          <button
            onClick={handleToggleCount}
            className="px-6 py-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-all duration-300"
          >
            {gameState.showCount ? 'Hide Count' : 'Show Count'}
          </button>
        </div>
      </div>

      {/* Game Status */}
      <div className="absolute top-28 left-1/2 -translate-x-1/2 text-white text-lg font-semibold z-10">
        {gameState.phase === 'betting' && 'Place Your Bet'}
        {gameState.phase === 'playerAction' && 'Your Turn'}
        {gameState.phase === 'dealerAction' && 'Dealer\'s Turn'}
        {gameState.phase === 'payout' && (
          <div className="text-yellow-400 font-bold text-2xl animate-bounce">
            {currentHand.winAmount > 0 ? 'Winner!' : 
             currentHand.winAmount < 0 ? 'Dealer Wins' : 'Push'}
            {currentHand.winAmount !== 0 && 
              ` $${Math.abs(currentHand.winAmount)}`}
          </div>
        )}
      </div>

      {/* Dealer Area */}
      <div className="absolute top-48 left-1/2 -translate-x-1/2 w-full max-w-md">
        <div className="text-white/60 text-sm text-center mb-2">
          Dealer Must Hit on Soft 17
        </div>
        <DealerHand
          hand={dealer.hands[0]}
          isDealing={isDealing}
          showHoleCard={gameState.phase === 'dealerAction' || gameState.phase === 'payout'}
        />
      </div>

      {/* Player Area */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md">
        <PlayerHand
          hand={currentHand}
          isActive={gameState.phase === 'playerAction'}
          isDealing={isDealing}
          canSplit={canSplit}
          canDoubleDown={canDoubleDown}
          canSurrender={canSurrender}
          onAction={handleAction}
        />

        {/* Betting Area */}
        {gameState.phase === 'betting' && (
          <div className="mt-8">
            {/* Chips Row */}
            <div className="flex justify-center items-center gap-4">
              {[5, 25, 100, 500].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handlePlaceBet(amount)}
                  disabled={player.chips < amount}
                  className={`
                    relative group 
                    transition-all duration-300
                    hover:scale-110 active:scale-95
                    disabled:opacity-50 disabled:cursor-not-allowed
                    disabled:hover:scale-100
                  `}
                >
                  <div className={`
                    relative
                    w-16 h-16 rounded-full 
                    ring-[3px] ring-inset
                    shadow-lg
                    transition-colors duration-300
                    ${getChipStyle(amount)}
                    before:absolute before:inset-[3px]
                    before:rounded-full before:border-[3px]
                    before:border-dashed before:border-white/30
                    after:absolute after:inset-[6px]
                    after:rounded-full after:border-[2px]
                    after:border-solid after:border-white/20
                  `}>
                    {/* Chip Value */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="
                        w-10 h-10 rounded-full
                        bg-white/10 backdrop-blur-sm
                        flex items-center justify-center
                        text-white font-bold text-sm
                        border border-white/20
                      ">
                        ${amount}
                      </div>
                    </div>
                    {/* Decorative Dots */}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1.5 h-1.5 bg-white/30 rounded-full"
                        style={{
                          top: '50%',
                          left: '50%',
                          transform: `rotate(${i * 45}deg) translate(22px, -50%)`,
                        }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {/* Current Bet and Chips */}
            <div className="mt-4 flex justify-between items-center px-4">
              <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                Bet: ${currentHand.bet}
              </div>
              <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                Chips: ${player.chips}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameBoard;
