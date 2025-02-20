import React from 'react';
import Button from 'react-bootstrap/Button';


interface SidenavProps {
  onPageChange: (page: 'game' | 'home') => void;
}


// style={{height: "calc(100vh - 4rem - 8px)"}}
const Sidenav: React.FC<SidenavProps> = ({ onPageChange }) => {
  return (
    // container class ensures consistency between pages 
    <aside className ="container rounder " style={{height: "calc(100vh - 4rem - 8px)"}} >
          <Button className="btn btn-primary btn-sm w-100 mb-1 mt-1" onClick={() => onPageChange('game')}>Game Board</Button>
          <Button className="btn btn-primary btn-sm w-100 mb-1" onClick={() => onPageChange('home')}>Home Page</Button>
    </aside>
  );
};
export default Sidenav;
