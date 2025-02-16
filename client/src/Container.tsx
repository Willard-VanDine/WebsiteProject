import React from 'react';
import GameBoard from './Gameboard';
import HomePage from './Homepage';

interface ContainerProps {
  currentPage: 'game' | 'home';  // Takes the currentPage from Content to decide what to show
}

const Container: React.FC<ContainerProps> = ({ currentPage }) => {
  return (
    <div className="Container">
      {/* Render the selected page */}
      {currentPage === 'game' ? <GameBoard /> : <HomePage />}
    </div>
  );
};

export default Container;
