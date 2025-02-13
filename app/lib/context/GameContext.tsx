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
  dispatch: React.Dispatch<GameActionType>;
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
      
      // Reset hands but keep bets
      const newHands: Hand[] = state.players.map(p => ({
        cards: [],
        bet: p.hands[0].bet,
        isDoubledDown: false,
        isSplit: false,
        isComplete: false,
      }));

      // Deal initial cards
      for (let i = 0; i < 2; i++) {
        newHands.forEach((hand, playerIndex) => {
          if (deck.length === 0) {
            deck = shuffle(createDeck()); // Reshuffle if needed
          }
          const card = deck[0];
          deck = deck.slice(1);
          hand.cards.push({
            ...card,
            // Dealer's second card is face down
            isFaceUp: !(playerIndex === 0 && i === 1),
          });
        });
      }

      // Calculate initial running count
      const runningCount = newHands
        .flatMap(h => h.cards)
        .filter(c => c.isFaceUp)
        .reduce((count, card) => count + getCountValue(card), state.runningCount);

      // Calculate true count (approximate decks remaining)
      const decksRemaining = Math.max(1, deck.length / 52);
      const trueCount = runningCount / decksRemaining;

      return {
        ...state,
        deck,
        players: state.players.map((player, index) => ({
          ...player,
          hands: [newHands[index]],
        })),
        phase: 'playerAction',
        runningCount,
        trueCount,
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
          // Don't allow hitting on completed or busted hands
          const currentValue = calculateHandValue(newHand);
          if (newHand.isComplete || currentValue.hard > 21) break;

          if (newDeck.length === 0) {
            newDeck = shuffle(createDeck());
          }

          // Draw new card
          const card = { ...newDeck[0], isFaceUp: true };
          newDeck = newDeck.slice(1);
          newHand.cards.push(card);
          newRunningCount += getCountValue(card);

          // Check for bust after adding new card
          const { hard } = calculateHandValue(newHand);
          if (hard > 21) {
            newHand.isComplete = true;
            newHand.winAmount = -newHand.bet; // Immediate loss on bust
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
          
          if (newDeck.length === 0) {
            newDeck = shuffle(createDeck());
          }
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
      }

      // Calculate true count
      const decksRemaining = Math.max(1, newDeck.length / 52);
      const newTrueCount = newRunningCount / decksRemaining;

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
        trueCount: newTrueCount,
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

      // First, reveal the hole card by making a copy with isFaceUp set to true
      newHand = {
        ...newHand,
        cards: newHand.cards.map(card => ({
          ...card,
          isFaceUp: true
        }))
      };

      // Update running count for the revealed hole card
      const holeCard = dealer.hands[0].cards[1];
      if (!holeCard.isFaceUp) {
        newRunningCount += getCountValue(holeCard);
      }

      // Calculate initial hand value
      let handValue = calculateHandValue(newHand);

      // Dealer must hit on soft 17
      while (
        handValue.hard < 17 || 
        (handValue.hard === 17 && handValue.soft !== 17)
      ) {
        // Check if we need to reshuffle
        if (newDeck.length === 0) {
          newDeck = shuffle(createDeck());
        }

        // Draw and add new card
        const newCard = {
          ...newDeck[0],
          isFaceUp: true,
        };
        newDeck = newDeck.slice(1);
        newHand.cards.push(newCard);

        // Update running count
        newRunningCount += getCountValue(newCard);

        // Recalculate hand value
        handValue = calculateHandValue(newHand);
      }

      // Calculate true count
      const decksRemaining = Math.max(1, newDeck.length / 52);
      const newTrueCount = newRunningCount / decksRemaining;

      // Update player hands with win/loss status
      const player = state.players[1];
      const updatedPlayer = { ...player };
      
      updatedPlayer.hands = player.hands.map(playerHand => {
        const playerValue = calculateHandValue(playerHand);
        let winAmount = 0;

        // Skip already busted hands
        if (playerValue.hard > 21) {
          return { ...playerHand, isComplete: true, winAmount: -playerHand.bet };
        }

        // Check for blackjacks
        const playerBlackjack = playerHand.cards.length === 2 && playerValue.soft === 21;
        const dealerBlackjack = newHand.cards.length === 2 && handValue.soft === 21;

        if (playerBlackjack) {
          if (!dealerBlackjack) {
            // Player blackjack pays 3:2
            winAmount = Math.floor(playerHand.bet * 1.5);
          }
          // Push on matching blackjacks
        } else if (dealerBlackjack) {
          winAmount = -playerHand.bet;
        } else if (handValue.hard > 21) {
          // Dealer busts
          winAmount = playerHand.bet;
        } else {
          // Compare hand values
          const playerBest = playerValue.soft <= 21 ? playerValue.soft : playerValue.hard;
          const dealerBest = handValue.soft <= 21 ? handValue.soft : handValue.hard;

          if (playerBest > dealerBest) {
            winAmount = playerHand.bet;
          } else if (playerBest < dealerBest) {
            winAmount = -playerHand.bet;
          }
          // Push results in winAmount staying 0
        }

        return {
          ...playerHand,
          isComplete: true,
          winAmount,
        };
      });

      // Update player chips based on wins/losses
      updatedPlayer.chips += updatedPlayer.hands.reduce(
        (total, hand) => total + (hand.winAmount || 0), 
        0
      );

      return {
        ...state,
        deck: newDeck,
        players: [
          { ...dealer, hands: [newHand] },
          updatedPlayer,
        ],
        phase: 'payout',
        runningCount: newRunningCount,
        trueCount: newTrueCount,
      };
    }

    default:
      return state;
  }
}

// Provider component
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, {
    ...initialState,
    deck: shuffle(createDeck()),
  });

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

// Custom hook for using the game context
export function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}

export default GameContext;
