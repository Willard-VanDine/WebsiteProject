import { SetStateAction } from 'react';
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
    <div className="Content pt-1 pb-1" >
      <div className='container'>
        <div className="row">
          <div className="col-2">
            <Sidenav isLoggedIn={isLoggedIn} setIsLoggedIn={
              (loginstatus : SetStateAction<boolean | null>) => {setIsLoggedIn(loginstatus)}}/>
          </div>
          <div className='col-10'>
          <Container>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/gameboard" element={<Gameboard isLoggedIn={isLoggedIn}  />} />
              <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={
                  (loginstatus : SetStateAction<boolean | null>) => {setIsLoggedIn(loginstatus)}
                } />} />
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
