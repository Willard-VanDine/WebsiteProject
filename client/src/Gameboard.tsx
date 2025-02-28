import 'bootstrap/dist/css/bootstrap.min.css';
import { Choice } from "../../server/src/model/choices.enum";
import { Gamestate } from "../../server/src/model/gamestate.interface";
import { getGameScore, makeMove } from './api';
import { Result } from '../../server/src/model/result.interface';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface GameBoardProps {
  isLoggedIn: boolean | null;
}

const GameBoard = ({ isLoggedIn }: GameBoardProps) => {
  const navigate = useNavigate();

  // Redirect immediately if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");  // Redirect to login if not logged in
    }
  }, [isLoggedIn, navigate]);
  //If user is logged in the component will not load
  return (
    isLoggedIn === true ? (
      <div className="container" style={{ height: "calc(100vh - 4rem - 8px)" }}>
        <div className="d-flex flex-column justify-content-between" style={{ height: "100%" }}>
          {/* Gameboard content */}
          <div className="gameboard rounder">
            {/* Score area */}
            <div className="scorecontainer">
              <p id="PlayerScore">Player score: 0</p>
              <p id="GameroundResultText" data-testid="GameroundResultText">Make a choice to play!</p>
              <p id="OpponentScore"> Opponent score: 0</p>
            </div>

            {/* Choice visual area */}
            <div className="choicecontainer">
              <p id="PlayerVisual" data-testid="PlayerVisual">Player</p>
              <p id="OpponentVisual" data-testid="OpponentVisual">Opponent</p>
            </div>
          </div>

          <div className="container h-25">
            <div className="row rounder buttoncontainer d-flex justify-content-around align-items-center">
              <div className="col-1"></div>

              {/* 
              Rock, Paper, Scissor Buttons: 
              Object.values(Choice) returns an array of the values of the enum Choice.
              for each, a button is created with the value as text and the handleChoice function as onClick.
              */}
              
              {Object.values(Choice).map(choice => (
                <button 
                  key={choice} 
                  type="button" 
                  className="btn btn-primary btn-lg col-2" 
                  onClick={() => handleChoice(choice)}>
                  {choice}
                </button>
              ))}

              <div className="col-1"></div>
            </div>
          </div>

        </div>
      </div>
    ) : <div>
      <p>Redirecting to login...</p>
    </div> // div that will replace the component if not logged in, will be redirected anyway.
  );
};

export default GameBoard;

// Helper fucntion to handle game logic
const handleChoice = async (playerChoice: Choice) => {
  const result: Result | undefined = await makeMove(playerChoice);
  if (!result) {
    console.log(`Result undefined after choosing ${playerChoice}`);
    return;
  }

  const gameroundResultText = document.getElementById("GameroundResultText");
  const playerVisual = document.getElementById("PlayerVisual");
  const opponentVisual = document.getElementById("OpponentVisual");

  if (gameroundResultText && playerVisual && opponentVisual) {
    const opponentChoice = result.result === 1 ? 
      (playerChoice === Choice.Rock ? "Scissor" : playerChoice === Choice.Paper ? "Rock" : "Paper") :
      result.result === 0 ? playerChoice : 
      (playerChoice === Choice.Rock ? "Paper" : playerChoice === Choice.Paper ? "Scissor" : "Rock");

    gameroundResultText.innerHTML = result.result === 1 ? "You Win!" : result.result === 0 ? "Draw!" : "You Lose!";
    playerVisual.innerHTML = playerChoice;
    opponentVisual.innerHTML = opponentChoice;
  }

  const newScores: Gamestate | undefined = await getGameScore();
  if (!newScores) {
    console.log("Gamestate is undefined when getting score");
    return;
  }

  const playerScore = document.getElementById("PlayerScore");
  const opponentScore = document.getElementById("OpponentScore");

  if (playerScore && opponentScore) {
    playerScore.innerHTML = `Player score: ${newScores.playerScore}`;
    opponentScore.innerHTML = `Opponent score: ${newScores.opponentScore}`;
  }
};