/**
 * DealerHand component
 * Specialized version of Hand component for the dealer
 * Includes specific dealer rules and hole card handling
 */

import React from 'react';
import { Hand as HandType } from '@/app/lib/types/game';
import Hand from './Hand';

interface DealerHandProps {
  hand: HandType;
  isDealing?: boolean;
  showHoleCard?: boolean;
  className?: string;
}

export const DealerHand: React.FC<DealerHandProps> = ({
  hand,
  isDealing = false,
  showHoleCard = false,
  className = '',
}) => {
  // Create a copy of the hand with the hole card face down if needed
  const displayHand = {
    ...hand,
    cards: hand.cards.map((card, index) => ({
      ...card,
      isFaceUp: index === 0 || showHoleCard,
    })),
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="text-white text-xl mb-4">Dealer</div>
      <div className={`
        transform transition-all duration-500
        ${isDealing ? 'scale-105' : 'scale-100'}
      `}>
        <Hand 
          hand={displayHand}
          isDealing={isDealing}
          showValue={showHoleCard}
        />
      </div>
    </div>
  );
};

export default DealerHand;
