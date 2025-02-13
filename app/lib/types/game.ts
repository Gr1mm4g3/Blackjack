/**
 * Core game types for the Blackjack application
 */

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
  isFaceUp: boolean;
}

export interface Hand {
  cards: Card[];
  bet: number;
  isDoubledDown: boolean;
  isSplit: boolean;
  isComplete: boolean;
}

export interface Player {
  hands: Hand[];
  chips: number;
  isDealer: boolean;
}

export type GameAction = 'hit' | 'stand' | 'double' | 'split' | 'surrender' | 'insurance';

export interface GameState {
  deck: Card[];
  players: Player[];
  currentPlayerIndex: number;
  currentHandIndex: number;
  phase: 'betting' | 'dealing' | 'playerAction' | 'dealerAction' | 'payout';
  minimumBet: number;
  runningCount: number;
  trueCount: number;
  showCount: boolean;
}

export type BasicStrategyDecision = {
  playerHand: string;  // Total or specific cards (e.g., "16" or "A,7")
  dealerUpCard: Rank;
  recommendation: GameAction;
  explanation: string;
}
