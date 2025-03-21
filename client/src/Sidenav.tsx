import React from 'react';
import { NavLink } from 'react-router-dom';
import { logOut } from './api';



interface SidenavProps {
  isLoggedIn: boolean | null;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean|null>>;
  }


        
    
const Sidenav = ({isLoggedIn, setIsLoggedIn} : SidenavProps) => {
  const LogoutButton = async () => {
    await logOut();
    setIsLoggedIn(false);
    alert("Logged Out");
  };
  return (
    // container class ensures consistency between pages 
    <aside className ="container rounder heightFixer" style={{display: "inline-flex", 
      flexDirection: "column", minWidth:"96px" } } >
      
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
