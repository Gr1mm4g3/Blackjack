/**
 * Core game types for the Blackjack application
 */

/**
 * Card suit type
 * Using Unicode symbols for suits
 */
export type Suit = '♥' | '♦' | '♣' | '♠';

/**
 * Card rank type
 */
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

/**
 * Card type
 */
export interface Card {
  suit: Suit;
  rank: Rank;
  isFaceUp: boolean;
}

/**
 * Hand type
 */
export interface Hand {
  cards: Card[];
  bet: number;
  isDoubledDown: boolean;
  isSplit: boolean;
  isComplete: boolean;
}

/**
 * Player type
 */
export interface Player {
  hands: Hand[];
  chips: number;
  isDealer: boolean;
}

/**
 * Game phase type
 */
export type GamePhase = 'betting' | 'dealing' | 'playerAction' | 'dealerAction' | 'payout';

/**
 * Game action type
 */
export type GameAction = 'hit' | 'stand' | 'double' | 'split' | 'surrender' | 'insurance';

/**
 * Game state type
 */
export interface GameState {
  deck: Card[];
  players: Player[];
  currentPlayerIndex: number;
  currentHandIndex: number;
  phase: GamePhase;
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
