import React, { useState } from 'react';
import Sidenav from './Sidenav';  // Import the Sidenav component
import Container from './Container';  // Import the Container which holds the content logic
import { Routes, Route } from 'react-router-dom'
import Homepage from './Homepage';
import Gameboard from './Gameboard';
import Login from './Login';
import Register from './Register';
import { useAuth } from './useAuth';
import AccountPage from './AccountPage';




const Content = () => {

  const {isLoggedIn, setIsLoggedIn} = useAuth();


  return (
    <div className="Content mt-1 mb-1" >
      <div className='container'>
        <div className="row">
          <div className="col-2">
            <Sidenav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          </div>
          <div className='col-10'>
          <Container>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/gameboard" element={<Gameboard isLoggedIn={isLoggedIn}  />} />
              <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/account" element={<AccountPage isLoggedIn={isLoggedIn} /> } />
            </Routes>
          </Container>
          </div>
        </div>
      </div>
    </div>
  );  
};

export default Content;
