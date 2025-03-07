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
      
          <NavLink to="/" end>            
            <div className='btn bg-dark text-white mt-1 mb-1'>
              Home Page
            </div>
          </NavLink>
          
          <NavLink to="/register" end>
            <div className='btn bg-dark text-white mt-1 mb-1'>
              Register
            </div>
          </NavLink>

          
          {isLoggedIn ? (
            <>
            <NavLink to="/gameboard" end>
              <div className='btn bg-dark text-white mt-1 mb-1'>
                Gameboard
              </div>
            </NavLink>

            <NavLink to="/account" end>
              <div className='btn bg-dark text-white mt-1 mb-1'>
                Account
              </div>
            </NavLink>
            <><button className='btn bg-dark mt-1 mb-1' onClick={LogoutButton}>
                <div className='text-white'>
                    Log Out
                </div>
              </button>
            </>
          </>
          ) : (
            <NavLink to="/login" end>           
              <div className='btn bg-dark text-white mt-1 mb-1'>
                Login
              </div>
            </NavLink>
        )}
          
    
    </aside>
  );
};
export default Sidenav;
