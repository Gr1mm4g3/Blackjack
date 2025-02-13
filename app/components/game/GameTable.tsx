/**
 * GameTable component
 * Main game component that uses GameContext to manage game state
 */

import React from 'react';
import { useGame } from '@/app/lib/context/GameContext';
import GameBoard from './GameBoard';

const GameTable: React.FC = () => {
  const {
    state,
    placeBet,
    dealCards,
    handlePlayerAction,
    startNewGame,
    toggleCount,
  } = useGame();

  return (
    <GameBoard
      gameState={state}
      onPlaceBet={placeBet}
      onAction={handlePlayerAction}
      onDeal={dealCards}
      onNewGame={startNewGame}
      onToggleCount={toggleCount}
    />
  );
};

export default GameTable;
