/**
 * GameContext and GameProvider
 * Manages the global game state and provides game-related actions
 */

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, GameAction, Card, Hand } from '../types/game';
import { createDeck, shuffle, calculateHandValue, getCountValue } from '../utils/gameUtils';

// Define action types
type GameActionType = 
  | { type: 'PLACE_BET'; amount: number }
  | { type: 'DEAL_CARDS' }
  | { type: 'PLAYER_ACTION'; action: GameAction }
  | { type: 'NEW_GAME' }
  | { type: 'TOGGLE_COUNT' }
  | { type: 'DEALER_PLAY' };

// Define the context type
interface GameContextType {
  state: GameState;
  placeBet: (amount: number) => void;
  dealCards: () => void;
  handlePlayerAction: (action: GameAction) => void;
  startNewGame: () => void;
  toggleCount: () => void;
}

// Create context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Initial game state
const initialState: GameState = {
  deck: [],
  players: [
    {
      hands: [{ cards: [], bet: 0, isDoubledDown: false, isSplit: false, isComplete: false }],
      chips: 1000,
      isDealer: true,
    },
    {
      hands: [{ cards: [], bet: 0, isDoubledDown: false, isSplit: false, isComplete: false }],
      chips: 1000,
      isDealer: false,
    },
  ],
  currentPlayerIndex: 1,
  currentHandIndex: 0,
  phase: 'betting',
  minimumBet: 5,
  runningCount: 0,
  trueCount: 0,
  showCount: true,
};

// Game reducer
function gameReducer(state: GameState, action: GameActionType): GameState {
  switch (action.type) {
    case 'PLACE_BET': {
      const player = state.players[1]; // Non-dealer player
      const currentHand = player.hands[state.currentHandIndex];
      
      // Ensure player has enough chips
      if (player.chips < action.amount) return state;
      
      return {
        ...state,
        players: [
          state.players[0],
          {
            ...player,
            hands: [
              {
                ...currentHand,
                bet: currentHand.bet + action.amount,
              },
            ],
            chips: player.chips - action.amount,
          },
        ],
      };
    }

    case 'DEAL_CARDS': {
      if (state.phase !== 'betting') return state;
      
      // Create and shuffle a new deck
      let deck = shuffle(createDeck());
      const newHands: Hand[] = state.players.map(p => p.hands[0]).map(hand => ({
        ...hand,
        cards: [],
      }));

      // Deal initial cards
      for (let i = 0; i < 2; i++) {
        newHands.forEach((hand, playerIndex) => {
          const card = deck[0];
          deck = deck.slice(1);
          hand.cards.push({
            ...card,
            isFaceUp: !(playerIndex === 0 && i === 1), // Dealer's second card is face down
          });
        });
      }

      // Update running count
      const runningCount = newHands
        .flatMap(h => h.cards)
        .filter(c => c.isFaceUp)
        .reduce((count, card) => count + getCountValue(card), 0);

      return {
        ...state,
        deck,
        players: state.players.map((player, index) => ({
          ...player,
          hands: [newHands[index]],
        })),
        phase: 'playerAction',
        runningCount,
        trueCount: runningCount / (deck.length / 52), // Approximate decks remaining
      };
    }

    case 'PLAYER_ACTION': {
      if (state.phase !== 'playerAction') return state;
      
      const player = state.players[state.currentPlayerIndex];
      const currentHand = player.hands[state.currentHandIndex];
      let newDeck = [...state.deck];
      let newHand = { ...currentHand };
      let newChips = player.chips;
      let newPhase = state.phase;
      let newRunningCount = state.runningCount;

      switch (action.action) {
        case 'hit': {
          const card = { ...newDeck[0], isFaceUp: true };
          newDeck = newDeck.slice(1);
          newHand.cards.push(card);
          newRunningCount += getCountValue(card);

          const { hard } = calculateHandValue(newHand);
          if (hard > 21) {
            newHand.isComplete = true;
            newPhase = 'dealerAction';
          }
          break;
        }

        case 'stand': {
          newHand.isComplete = true;
          newPhase = 'dealerAction';
          break;
        }

        case 'double': {
          if (newHand.cards.length !== 2 || newChips < newHand.bet) break;
          
          const card = { ...newDeck[0], isFaceUp: true };
          newDeck = newDeck.slice(1);
          newHand.cards.push(card);
          newRunningCount += getCountValue(card);
          
          newHand.bet *= 2;
          newChips -= newHand.bet / 2;
          newHand.isDoubledDown = true;
          newHand.isComplete = true;
          newPhase = 'dealerAction';
          break;
        }

        // Additional actions (split, surrender) will be implemented later
      }

      return {
        ...state,
        deck: newDeck,
        players: state.players.map((p, i) => 
          i === state.currentPlayerIndex
            ? {
                ...p,
                chips: newChips,
                hands: [newHand],
              }
            : p
        ),
        phase: newPhase,
        runningCount: newRunningCount,
        trueCount: newRunningCount / (newDeck.length / 52),
      };
    }

    case 'NEW_GAME':
      return {
        ...initialState,
        players: initialState.players.map(p => ({
          ...p,
          chips: state.players.find(sp => sp.isDealer === p.isDealer)?.chips || 1000,
        })),
      };

    case 'TOGGLE_COUNT':
      return {
        ...state,
        showCount: !state.showCount,
      };

    case 'DEALER_PLAY': {
      if (state.phase !== 'dealerAction') return state;

      const dealer = state.players[0];
      let newDeck = [...state.deck];
      let newHand = { ...dealer.hands[0] };
      let newRunningCount = state.runningCount;

      // Reveal hole card
      newHand.cards = newHand.cards.map(card => ({ ...card, isFaceUp: true }));
      newRunningCount += getCountValue(newHand.cards[1]); // Count the revealed hole card

      // Dealer must hit on soft 17
      while (true) {
        const { soft, hard } = calculateHandValue(newHand);
        if (hard > 21 || (hard >= 17 && soft >= 17)) break;
        
        const card = { ...newDeck[0], isFaceUp: true };
        newDeck = newDeck.slice(1);
        newHand.cards.push(card);
        newRunningCount += getCountValue(card);
      }

      return {
        ...state,
        deck: newDeck,
        players: state.players.map((p, i) => 
          i === 0
            ? { ...p, hands: [newHand] }
            : p
        ),
        phase: 'payout',
        runningCount: newRunningCount,
        trueCount: newRunningCount / (newDeck.length / 52),
      };
    }

    default:
      return state;
  }
}

// Provider component
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const placeBet = (amount: number) => {
    dispatch({ type: 'PLACE_BET', amount });
  };

  const dealCards = () => {
    dispatch({ type: 'DEAL_CARDS' });
  };

  const handlePlayerAction = (action: GameAction) => {
    dispatch({ type: 'PLAYER_ACTION', action });
  };

  const startNewGame = () => {
    dispatch({ type: 'NEW_GAME' });
  };

  const toggleCount = () => {
    dispatch({ type: 'TOGGLE_COUNT' });
  };

  const value = {
    state,
    placeBet,
    dealCards,
    handlePlayerAction,
    startNewGame,
    toggleCount,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// Custom hook for using the game context
export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export default GameContext;
