import React from 'react';

interface SidenavProps {
  onPageChange: (page: 'game' | 'home') => void;
}

const Sidenav: React.FC<SidenavProps> = ({ onPageChange }) => {
  return (
    <aside>
      <ul>
        <li>
          <button onClick={() => onPageChange('game')}>Game Board</button>
        </li>
        <li>
          <button onClick={() => onPageChange('home')}>Home Page</button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidenav;
