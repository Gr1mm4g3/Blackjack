/**
 * PlayerHand component
 * Specialized version of Hand component for the player
 * Includes betting controls and action indicators
 */

import React from 'react';
import { Hand as HandType, GameAction } from '@/app/lib/types/game';
import { calculateHandValue } from '@/app/lib/utils/gameUtils';
import Hand from './Hand';

interface PlayerHandProps {
  hand: HandType;
  isActive: boolean;
  canSplit: boolean;
  canDoubleDown: boolean;
  canSurrender: boolean;
  suggestedAction?: GameAction;
  onAction?: (action: GameAction) => void;
  className?: string;
}

export const PlayerHand: React.FC<PlayerHandProps> = ({
  hand,
  isActive,
  canSplit,
  canDoubleDown,
  canSurrender,
  suggestedAction,
  onAction,
  className = '',
}) => {
  // Calculate hand value and bust status
  const { hard } = calculateHandValue(hand);
  const isBusted = hard > 21;

  // Determine if actions should be allowed
  const canAct = isActive && !isBusted && !hand.isComplete;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Hand Display */}
      <div className={`
        transform transition-all duration-500
        ${isActive ? 'scale-105' : 'scale-100'}
      `}>
        <Hand 
          hand={hand}
          isActive={isActive && !isBusted}
          showValue={true}
        />
      </div>

      {/* Action Buttons - Only show if player can act */}
      {canAct && (
        <div className="mt-8 flex gap-2">
          <ActionButton
            action="hit"
            onClick={() => onAction?.('hit')}
            isRecommended={suggestedAction === 'hit'}
            disabled={isBusted}
          />
          <ActionButton
            action="stand"
            onClick={() => onAction?.('stand')}
            isRecommended={suggestedAction === 'stand'}
          />
          {canDoubleDown && (
            <ActionButton
              action="double"
              onClick={() => onAction?.('double')}
              isRecommended={suggestedAction === 'double'}
            />
          )}
          {canSplit && (
            <ActionButton
              action="split"
              onClick={() => onAction?.('split')}
              isRecommended={suggestedAction === 'split'}
            />
          )}
          {canSurrender && (
            <ActionButton
              action="surrender"
              onClick={() => onAction?.('surrender')}
              isRecommended={suggestedAction === 'surrender'}
            />
          )}
        </div>
      )}

      {/* Game Outcome Indicators */}
      {isBusted && (
        <div className="mt-4 text-2xl font-bold text-red-500 animate-bounce">
          Bust!
        </div>
      )}
      {hand.isComplete && !isBusted && hand.winAmount && hand.winAmount > 0 && (
        <div className="mt-4 text-2xl font-bold text-yellow-400 animate-bounce">
          Winner!
        </div>
      )}
    </div>
  );
};

// Helper component for action buttons
const ActionButton: React.FC<{
  action: GameAction;
  onClick: () => void;
  isRecommended?: boolean;
  disabled?: boolean;
}> = ({ action, onClick, isRecommended, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-lg
        font-semibold text-sm
        transition-all duration-300
        ${isRecommended ? 'ring-2 ring-yellow-400 animate-pulse' : ''}
        ${disabled
          ? 'bg-gray-600 cursor-not-allowed opacity-50'
          : 'bg-blue-600 hover:bg-blue-500 active:scale-95'
        }
      `}
    >
      {action.charAt(0).toUpperCase() + action.slice(1)}
    </button>
  );
};

export default PlayerHand;
