/**
 * GameControls component
 * Provides the main game control buttons (Deal, New Game, etc.)
 * and displays current game status
 */

import React from 'react';

interface GameControlsProps {
  onDeal: () => void;
  onNewGame: () => void;
  onToggleCount: () => void;
  canDeal: boolean;
  isShowingCount: boolean;
  className?: string;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onDeal,
  onNewGame,
  onToggleCount,
  canDeal,
  isShowingCount,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Primary Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={onDeal}
          disabled={!canDeal}
          className={`
            px-8 py-3 rounded-lg
            text-lg font-bold
            transition-all duration-300
            shadow-lg
            ${canDeal 
              ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white' 
              : 'bg-gray-600 cursor-not-allowed opacity-50'
            }
            transform hover:scale-105 active:scale-95
            disabled:transform-none
            flex items-center gap-2
          `}
        >
          <span className="material-icons-outlined">casino</span>
          Deal
        </button>

        <button
          onClick={onNewGame}
          className="
            px-8 py-3 rounded-lg
            text-lg font-bold text-white
            bg-gradient-to-r from-blue-500 to-blue-600
            hover:from-blue-400 hover:to-blue-500
            transition-all duration-300
            shadow-lg
            transform hover:scale-105 active:scale-95
            flex items-center gap-2
          "
        >
          <span className="material-icons-outlined">refresh</span>
          New Game
        </button>
      </div>

      {/* Secondary Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={onToggleCount}
          className={`
            px-6 py-2 rounded-lg
            text-sm font-semibold
            transition-all duration-300
            ${isShowingCount 
              ? 'bg-green-600 hover:bg-green-500' 
              : 'bg-gray-600 hover:bg-gray-500'
            }
            text-white
            flex items-center gap-2
          `}
        >
          <span className="material-icons-outlined">
            {isShowingCount ? 'visibility' : 'visibility_off'}
          </span>
          {isShowingCount ? 'Hide Count' : 'Show Count'}
        </button>

        {/* Settings Button - for future use */}
        <button
          className="
            px-6 py-2 rounded-lg
            text-sm font-semibold text-white
            bg-gray-600 hover:bg-gray-500
            transition-all duration-300
            flex items-center gap-2
          "
        >
          <span className="material-icons-outlined">settings</span>
          Settings
        </button>
      </div>
    </div>
  );
};

export default GameControls;
