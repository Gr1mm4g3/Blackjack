/**
 * Base Hand component
 * Displays a hand of cards with proper spacing and animations
 * Used by both dealer and player hand components
 */

import React from 'react';
import { Hand as HandType } from '@/app/lib/types/game';
import { calculateHandValue } from '@/app/lib/utils/gameUtils';
import Card from './Card';

interface HandProps {
  hand: HandType;
  isActive?: boolean;
  showValue?: boolean;
  isDealing?: boolean;
  className?: string;
}

export const Hand: React.FC<HandProps> = ({
  hand,
  isActive = false,
  showValue = true,
  isDealing = false,
  className = '',
}) => {
  const { soft, hard } = calculateHandValue(hand);
  const displayValue = soft !== hard ? `${hard}/${soft}` : hard.toString();
  const isBusted = hard > 21;

  return (
    <div className={`relative ${className}`}>
      {/* Cards */}
      <div className="flex justify-center items-center">
        {hand.cards.map((card, index) => (
          <div
            key={`${card.suit}-${card.rank}-${index}`}
            className={`
              transform 
              ${index > 0 ? '-ml-16' : ''} 
              ${isActive ? 'hover:-translate-y-2' : ''}
              transition-transform duration-200
            `}
            style={{ zIndex: index }}
          >
            <Card 
              card={card}
              index={index}
              isDealing={isDealing}
            />
          </div>
        ))}
      </div>

      {/* Hand Value */}
      {showValue && hand.cards.length > 0 && (
        <div 
          className={`
            absolute -bottom-8 left-1/2 transform -translate-x-1/2
            px-3 py-1 rounded-full text-sm font-bold
            ${isBusted ? 'bg-red-600' : 'bg-black/50'} 
            text-white
            transition-opacity duration-500
            ${isDealing ? 'opacity-0' : 'opacity-100'}
          `}
        >
          {displayValue}
          {isBusted && <span className="ml-2">(Bust!)</span>}
        </div>
      )}

      {/* Split/Double Indicators */}
      {hand.isDoubledDown && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-yellow-400 font-bold">
          Double Down
        </div>
      )}
      {hand.isSplit && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-blue-400 font-bold">
          Split Hand
        </div>
      )}
    </div>
  );
};

export default Hand;
