import React from 'react';
import GameBoard from './Gameboard';
import HomePage from './Homepage';





const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div >
      {children}
    </div>
  );
}




export default Container;
