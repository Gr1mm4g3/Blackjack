/**
 * Utility functions for the Blackjack game
 */

import { Card, Rank, Suit, Hand } from '../types/game';

/**
 * Creates a new deck of cards
 * @returns Array of Card objects
 */
export const createDeck = (): Card[] => {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck: Card[] = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank, isFaceUp: false });
    }
  }

  return deck;
};

/**
 * Shuffles an array using the Fisher-Yates algorithm
 * @param array Array to shuffle
 * @returns Shuffled array
 */
export const shuffle = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Calculates the value of a hand
 * @param hand Hand to calculate value for
 * @returns Object containing soft and hard values
 */
export const calculateHandValue = (hand: Hand): { soft: number; hard: number } => {
  let soft = 0;
  let aces = 0;

  for (const card of hand.cards) {
    if (!card.isFaceUp) continue;

    if (card.rank === 'A') {
      aces += 1;
      soft += 11;
    } else if (['K', 'Q', 'J'].includes(card.rank)) {
      soft += 10;
    } else {
      soft += parseInt(card.rank);
    }
  }

  // Convert aces from 11 to 1 as needed
  let hard = soft;
  while (hard > 21 && aces > 0) {
    hard -= 10;
    aces -= 1;
  }

  return { soft, hard };
};

/**
 * Updates the running count based on revealed cards
 * @param card Card to count
 * @returns Count value for the card
 */
export const getCountValue = (card: Card): number => {
  if (!card.isFaceUp) return 0;
  
  const highCards = ['10', 'J', 'Q', 'K', 'A'];
  const lowCards = ['2', '3', '4', '5', '6'];
  
  if (highCards.includes(card.rank)) return -1;
  if (lowCards.includes(card.rank)) return 1;
  return 0;
};

/**
 * Calculates the true count
 * @param runningCount Current running count
 * @param decksRemaining Number of decks remaining
 * @returns True count value
 */
export const calculateTrueCount = (runningCount: number, decksRemaining: number): number => {
  return Math.round((runningCount / decksRemaining) * 2) / 2; // Round to nearest 0.5
};
