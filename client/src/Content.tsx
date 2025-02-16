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
    <div className="Content">
      {/* Sidenav component now takes handlePageChange as a prop */}
      <Sidenav onPageChange={handlePageChange} />
      
      {/* Container only handles displaying the selected page */}
      <Container currentPage={currentPage} />
    </div>
  );
};

export default Content;
