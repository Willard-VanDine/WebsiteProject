import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { useAuth } from './useAuth';





// style={{height: "calc(100vh - 4rem - 8px)"}}
const Sidenav  = () => {
  const { isLoggedIn, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>; // Show loading until session check is done
  }
  return (
    // container class ensures consistency between pages 
    <aside className ="container rounder " style={{height: "calc(100vh - 4rem - 8px)", display: "inline-flex", 
      flexDirection: "column"} } >
      
          <NavLink to="/" end>Homepage</NavLink>
          
          <NavLink to="/register" end>Register new user</NavLink>
          {isLoggedIn ? (
            <>
            <NavLink to="/gameboard" end>Gameboard</NavLink>
            <NavLink to="/Account" end>Account</NavLink>
            </>
          ) : (
            <NavLink to="/login" end>Log in</NavLink>
        )}
          
                  
          
    
    </aside>
  );
};
export default Sidenav;
