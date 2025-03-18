import { subscribeToGame } from './api';


const HomePage = () => {
  return (
    // container class ensures consistency between pages 
    <div className="container d-flex flex-column justify-content-between heightFixer">
        
        <article className="homepage-article rounder">
            <p className = "text-center">
                This is the homepage for the rock, paper and scissor website!
            </p>
        </article>
      
        <section className="homepage-section rounder d-flex flex-column justify-content-between align-items-center">
      
            <div className="homepage-half-section d-flex align-items-center justify-content-center">
                <h2 className="text-center">How to start:</h2>
                <p className="text-center">Log into an account then press the subscribe to game button!</p>
            </div>
            <div className="homepage-half-section d-flex align-items-center justify-content-center">
            

                    {/* Start Playing button */}
                    <button type="button" className="btn btn-primary btn-lg" onClick={ async () => {
                        const isSubscribed: boolean|undefined = await subscribeToGame();
                        if(isSubscribed === undefined)
                            alert("Please log in before you try to subscribe to a game!")
                        else if(isSubscribed === false)
                            alert("You are already subscribed to Rock, paper and scissors!")
                        else
                            alert("You succesfully subscribed to Rock, paper and scissors!")
                    }}>subscribe to Rock, paper and scissors!</button>

            
            </div>
        </section>
    </div>
  );
};

export default HomePage;