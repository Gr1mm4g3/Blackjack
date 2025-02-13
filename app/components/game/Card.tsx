/**
 * Card component for displaying playing cards
 * Includes animations and proper card styling
 */

import React from 'react';
import { Card as CardType } from '@/app/lib/types/game';

interface CardProps {
  card: CardType;
  index?: number;
  isDealing?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  card,
  index = 0,
  isDealing = false,
  className = '',
}) => {
  const { suit, rank, isFaceUp } = card;
  const [wasEverFaceUp, setWasEverFaceUp] = React.useState(isFaceUp);
  const [isFlipping, setIsFlipping] = React.useState(false);

  React.useEffect(() => {
    if (isFaceUp && !wasEverFaceUp) {
      setIsFlipping(true);
      setWasEverFaceUp(true);
      const timer = setTimeout(() => setIsFlipping(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isFaceUp, wasEverFaceUp]);

  // Get card color based on suit
  const isRed = suit === '♥' || suit === '♦';
  
  return (
    <div 
      className={`
        relative
        w-24 h-36
        rounded-xl
        shadow-xl
        preserve-3d
        transition-all duration-500
        ${isDealing ? `
          opacity-0 translate-y-[400px] rotate-180
          animate-deal-in
        ` : ''}
        ${isFlipping ? 'animate-flip' : ''}
        ${className}
      `}
      style={{
        // Delay each card's animation based on its index
        animationDelay: isDealing ? `${index * 200}ms` : '0ms'
      }}
    >
      {/* Card Face */}
      <div className={`
        absolute inset-0
        bg-white
        rounded-xl
        shadow-md
        flex flex-col justify-between
        p-2
        backface-hidden
        transition-transform duration-500
        ${isFaceUp ? 'rotate-y-0' : 'rotate-y-180'}
        before:absolute before:inset-[3px]
        before:border before:border-gray-200
        before:rounded-lg
        before:opacity-50
      `}>
        {/* Top Left */}
        <div className={`
          relative z-10
          flex flex-col items-center
          ${isRed ? 'text-red-600' : 'text-gray-800'}
          w-6
        `}>
          <span className="font-bold text-xl leading-tight">{rank}</span>
          <span className="text-2xl leading-none -mt-1">{suit}</span>
        </div>
        
        {/* Center */}
        <div className={`
          absolute inset-0
          flex items-center justify-center
          text-7xl
          ${isRed ? 'text-red-600' : 'text-gray-800'}
          opacity-90
          select-none
        `}>
          {suit}
        </div>
        
        {/* Bottom Right */}
        <div className={`
          relative z-10
          flex flex-col items-center
          ${isRed ? 'text-red-600' : 'text-gray-800'}
          w-6
          rotate-180
          self-end
        `}>
          <span className="font-bold text-xl leading-tight">{rank}</span>
          <span className="text-2xl leading-none -mt-1">{suit}</span>
        </div>
      </div>

      {/* Card Back */}
      <div className={`
        absolute inset-0
        bg-gradient-to-br from-blue-600 to-blue-700
        rounded-xl
        shadow-md
        backface-hidden
        transition-transform duration-500
        overflow-hidden
        ${isFaceUp ? 'rotate-y-180' : 'rotate-y-0'}
      `}>
        {/* Card Back Pattern */}
        <div className="absolute inset-2 rounded-lg bg-blue-500/20" />
        <div className="
          absolute inset-4
          rounded-lg
          bg-blue-500/20
          grid grid-cols-5 gap-1 p-1
        ">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className="
                aspect-square
                rounded-sm
                bg-gradient-to-br
                from-blue-400/30
                to-blue-300/30
                border border-blue-400/20
              "
            />
          ))}
        </div>

        {/* Ornate Border */}
        <div className="
          absolute inset-[6px]
          border-2 border-blue-400/30
          rounded-lg
        "/>
      </div>
    </div>
  );
};

export default Card;
