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
  const { hard } = calculateHandValue(hand);
  const isBusted = hard > 21;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Hand Display */}
      <div className={`
        transform transition-all duration-500
        ${isActive ? 'scale-105' : 'scale-100'}
      `}>
        <Hand 
          hand={hand}
          isActive={isActive}
          showValue={true}
        />
      </div>

      {/* Action Buttons */}
      {isActive && !isBusted && !hand.isComplete && (
        <div className="mt-8 flex gap-2">
          <ActionButton
            action="hit"
            onClick={() => onAction?.('hit')}
            isRecommended={suggestedAction === 'hit'}
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

      {/* Win/Loss Indicator */}
      {hand.isComplete && !isBusted && (
        <div className="mt-4 text-2xl font-bold text-yellow-400">
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
}> = ({ action, onClick, isRecommended }) => {
  const baseStyles = `
    px-4 py-2 rounded-lg font-bold text-white
    transform transition-all duration-200
    hover:scale-105 active:scale-95
  `;

  const getActionColor = () => {
    if (isRecommended) return 'bg-yellow-500 hover:bg-yellow-600';
    switch (action) {
      case 'hit':
        return 'bg-green-600 hover:bg-green-700';
      case 'stand':
        return 'bg-red-600 hover:bg-red-700';
      case 'double':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'split':
        return 'bg-purple-600 hover:bg-purple-700';
      case 'surrender':
        return 'bg-gray-600 hover:bg-gray-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${baseStyles}
        ${getActionColor()}
        ${isRecommended ? 'ring-4 ring-yellow-300 ring-opacity-50' : ''}
      `}
    >
      {action.charAt(0).toUpperCase() + action.slice(1)}
    </button>
  );
};

export default PlayerHand;
