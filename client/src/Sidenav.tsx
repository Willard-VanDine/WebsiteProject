import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';


interface SidenavProps {
  onPageChange: (page: 'game' | 'home') => void;
}


// style={{height: "calc(100vh - 4rem - 8px)"}}
const Sidenav  = () => {
  return (
    // container class ensures consistency between pages 
    <aside className ="container rounder " style={{height: "calc(100vh - 4rem - 8px)"}} >
      <ul>
        <li>
          <Link to="/">Homepage</Link>
        </li>
        <li>
          <Link to="/gameboard">Gameboard</Link>
        </li>
        <li>
          <Link to="/login">Log in</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
      </ul>
    </aside>
  );
};
export default Sidenav;
