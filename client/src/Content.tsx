import React, { useState } from 'react';
import Sidenav from './Sidenav';  // Import the Sidenav component
import Container from './Container';  // Import the Container which holds the content logic




const Content = () => {
  // State to track which page is currently selected
  const [currentPage, setCurrentPage] = useState<'game' | 'home'>('game');

  // Function to handle page switching
  const handlePageChange = (page: 'game' | 'home') => {
    setCurrentPage(page);
  };

  return (
    <div className="Content mt-1 mb-1" >
      <div className='container'>
        <div className="row">
          <div className="col-2">
            {/* Sidenav component now takes handlePageChange as a prop */}
            <Sidenav onPageChange={handlePageChange} />
          </div>
          <div className='col-10'>
              {/* Container only handles displaying the selected page */}
            <Container currentPage={currentPage} />
          </div>
        </div>
      </div>
    </div>
  );  
};

export default Content;
