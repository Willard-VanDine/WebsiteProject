import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { useAuth } from './useAuth';
import { login, logOut } from './api';



interface SidenavProps {
  isLoggedIn: boolean | null;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean|null>>;
  }


        
    
// style={{height: "calc(100vh - 4rem - 8px)"}}
const Sidenav = ({isLoggedIn, setIsLoggedIn} : SidenavProps) => {
  const LogoutButton = async () => {
    await logOut();
    setIsLoggedIn(false);
    alert("Logged Out");
  };
  return (
    // container class ensures consistency between pages 
    <aside className ="container rounder " style={{height: "calc(100vh - 4rem - 8px)", display: "inline-flex", 
      flexDirection: "column"} } >
      
          <NavLink to="/" end>Homepage</NavLink>
          
          <NavLink to="/register" end>Register new user</NavLink>
          {isLoggedIn ? (
            <>
            <NavLink to="/gameboard" end>Gameboard</NavLink>
            <NavLink to="/account" end>Account</NavLink>
            <p><button onClick={LogoutButton}>Log Out</button></p>
            </>
          ) : (
            <NavLink to="/login" end>Log in</NavLink>
        )}
          
                  
          
    
    </aside>
  );
};
export default Sidenav;
