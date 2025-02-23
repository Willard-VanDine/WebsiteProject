import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Button from 'react-bootstrap/Button';


interface SidenavProps {
  onPageChange: (page: 'game' | 'home') => void;
}


// style={{height: "calc(100vh - 4rem - 8px)"}}
const Sidenav  = () => {
  return (
    // container class ensures consistency between pages 
    <aside className ="container rounder " style={{height: "calc(100vh - 4rem - 8px)", display: "inline-flex", 
      flexDirection: "column"} } >
      
          <NavLink to="/" end>Homepage</NavLink>
          <NavLink to="/gameboard" end>Gameboard</NavLink>
          <NavLink to="/login" end>Log in</NavLink>        
          <NavLink to="/register" end>Register new user</NavLink>
    
    </aside>
  );
};
export default Sidenav;
