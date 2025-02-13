/**
 * Game Utilities
 * Helper functions for managing cards, deck, and game calculations
 */

import { Card, Hand } from '../types/game';

// Card suits and ranks
const SUITS = ['♥', '♦', '♣', '♠'] as const;
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;

/**
 * Creates a new deck of 52 cards
 */
export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        suit,
        rank,
        isFaceUp: true,
      });
    }
  }
  return deck;
}

/**
 * Shuffles an array using the Fisher-Yates algorithm
 */
export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Gets the numerical value of a card
 */
export function getCardValue(rank: Card['rank']): number[] {
  switch (rank) {
    case 'A':
      return [1, 11];
    case 'K':
    case 'Q':
    case 'J':
      return [10];
    default:
      return [parseInt(rank)];
  }
}

/**
 * Calculates the value of a hand, considering aces
 */
export function calculateHandValue(hand: Hand): { soft: number; hard: number } {
  const cards = hand.cards.filter(card => card.isFaceUp);
  let hasAce = false;
  let total = 0;

  for (const card of cards) {
    const values = getCardValue(card.rank);
    if (card.rank === 'A') {
      hasAce = true;
    }
    total += values[0];
  }

  // Calculate soft total if we have an ace
  const soft = hasAce && total + 10 <= 21 ? total + 10 : total;

  return {
    soft,
    hard: total,
  };
}

/**
 * Gets the Hi-Lo count value of a card
 */
export function getCountValue(card: Card): number {
  if (!card.isFaceUp) return 0;

  const value = getCardValue(card.rank)[0];
  if (value >= 2 && value <= 6) return 1;
  if (value >= 10 || card.rank === 'A') return -1;
  return 0;
}

/**
 * Determines if a hand can be split
 */
export function canSplit(hand: Hand): boolean {
  return (
    hand.cards.length === 2 &&
    getCardValue(hand.cards[0].rank)[0] === getCardValue(hand.cards[1].rank)[0]
  );
}

/**
 * Determines if a hand is a blackjack
 */
export function isBlackjack(hand: Hand): boolean {
  return (
    hand.cards.length === 2 &&
    calculateHandValue(hand).soft === 21
  );
}

/**
 * Determines the winner between two hands
 * Returns: 1 if hand1 wins, -1 if hand2 wins, 0 if push
 */
export function determineWinner(hand1: Hand, hand2: Hand): number {
  const value1 = calculateHandValue(hand1);
  const value2 = calculateHandValue(hand2);

  const total1 = value1.soft <= 21 ? value1.soft : value1.hard;
  const total2 = value2.soft <= 21 ? value2.soft : value2.hard;

  if (total1 > 21) return -1;
  if (total2 > 21) return 1;
  if (total1 === total2) return 0;
  return total1 > total2 ? 1 : -1;
}

/**
 * Calculates the payout for a winning hand
 */
export function calculatePayout(hand: Hand, isBlackjack: boolean): number {
  if (isBlackjack) {
    return hand.bet * 1.5; // Blackjack pays 3:2
  }
  return hand.bet; // Normal win pays 1:1
}
