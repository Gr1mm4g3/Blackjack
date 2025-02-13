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
  isDealing: boolean;
  showHoleCard: boolean;
  className?: string;
}

export const DealerHand: React.FC<DealerHandProps> = ({
  hand,
  isDealing,
  showHoleCard,
  className = '',
}) => {
  // In Blackjack, dealer's hand value is only shown when hole card is revealed
  const showValue = showHoleCard;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="text-white text-xl mb-4">Dealer</div>
      <div className={`
        transform transition-all duration-500
        ${isDealing ? 'scale-105' : 'scale-100'}
      `}>
        <Hand 
          hand={hand}
          showValue={showValue}
          isActive={isDealing}
        />
      </div>
    </div>
  );
};

export default DealerHand;
