import { subscribeToGame } from './api';


// style={{height: "calc(100vh - 4rem - 8px)"}}
const HomePage = () => {
  return (
    // container class ensures consistency between pages 
    <div className="container d-flex flex-column justify-content-between" style={{height: "calc(100vh - 4rem - 8px)"}}>
        
        <article className="homepage-article rounder">
            <p className = "text-center">
                This is the homepage for the first lab assigment
            </p>
        </article>
      
        <section className="homepage-section rounder d-flex flex-column justify-content-between align-items-center">
      
            <div className="homepage-half-section d-flex align-items-center justify-content-center">
                <h6 className="text-center">Rules of the game:</h6>
                <p className="text-center">...</p>
            </div>
            <div className="homepage-half-section d-flex align-items-center justify-content-center">
            

                    {/* Start Playing button */}
                    <button type="button" className="btn btn-primary btn-lg" onClick={ async () => {
                        await subscribeToGame();
                        //alert("test");
                    }}>Start playing!</button>

            
            </div>
        </section>
    </div>
  );
};

export default HomePage;