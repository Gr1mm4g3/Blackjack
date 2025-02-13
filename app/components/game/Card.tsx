/**
 * Card component for displaying playing cards
 * Includes animations and proper card styling
 */

import React from 'react';
import { Card as CardType } from '@/app/lib/types/game';

interface CardProps {
  card: CardType;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ card, className = '' }) => {
  const { suit, rank, isFaceUp } = card;

  // Determine card color based on suit
  const isRed = suit === 'hearts' || suit === 'diamonds';
  const textColor = isRed ? 'text-red-600' : 'text-black';

  // Get suit symbol
  const suitSymbol = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠',
  }[suit];

  if (!isFaceUp) {
    return (
      <div 
        className={`
          relative w-24 h-36 
          bg-blue-800 
          rounded-lg 
          shadow-lg 
          border-2 border-white
          transform transition-transform duration-200 hover:scale-105
          ${className}
        `}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-24 border-4 border-white rounded-lg opacity-20" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`
        relative w-24 h-36 
        bg-white 
        rounded-lg 
        shadow-lg 
        border-2 border-gray-200
        transform transition-transform duration-200 hover:scale-105
        ${className}
      `}
    >
      {/* Top left rank and suit */}
      <div className={`absolute top-2 left-2 ${textColor}`}>
        <div className="text-xl font-bold">{rank}</div>
        <div className="text-xl">{suitSymbol}</div>
      </div>

      {/* Center suit */}
      <div className={`absolute inset-0 flex items-center justify-center ${textColor}`}>
        <span className="text-4xl">{suitSymbol}</span>
      </div>

      {/* Bottom right rank and suit (inverted) */}
      <div className={`absolute bottom-2 right-2 ${textColor} rotate-180`}>
        <div className="text-xl font-bold">{rank}</div>
        <div className="text-xl">{suitSymbol}</div>
      </div>
    </div>
  );
};

export default Card;
