import React from 'react';
import { startGame } from './api';


// style={{height: "calc(100vh - 4rem - 8px)"}}
const Register = () => {
  return (
    // container class ensures consistency between pages 
    <div className="container d-flex flex-column justify-content-between" style={{height: "calc(100vh - 4rem - 8px)"}}>
        
        <article className="homepage-article rounder">
            <p className = "text-center">
                This is test to test router, so Register page in page here
            </p>
        </article>
      
        <section className="homepage-section rounder d-flex flex-column justify-content-between align-items-center">
      
            <div className="homepage-half-section d-flex align-items-center justify-content-center">
                <h6 className="text-center">Register</h6>
                <p className="text-center">...</p>
            </div>
            <div className="homepage-half-section d-flex align-items-center justify-content-center">
                <a href="gameboard.html">

                    {/* Start Playing button */}
                    <button type="button" className="btn btn-primary btn-lg" onClick={ async () => {
                        await startGame();
                    }}>Start playing!</button>

                </a>
            </div>
        </section>
    </div>
  );
};

export default Register;