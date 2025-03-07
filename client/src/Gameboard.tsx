import 'bootstrap/dist/css/bootstrap.min.css';
import { Choice } from "../../server/src/model/choices.enum";
import { Gamestate } from "../../server/src/model/gamestate.interface";
import { getGameScore, makeMove, accountScore,} from './api';
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
    } else {
      updateScore();

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
            <div className='choicecontainer'>
              <img
                id="PlayerVisual"
                data-testid="PlayerVisual"
                alt="Player"
                style={{ width: "15rem", height: "10rem" }}
                src='src/assets/react.svg'
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'src/assets/react.svg';
                }}
              />
              <img
                id="OpponentVisual"
                data-testid="OpponentVisual"
                alt="Opponent"
                style={{ width: "15rem", height: "10rem" }}
                src='src/assets/react.svg'
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'src/assets/react.svg';
                }}
              />
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
                  className="btn gameboard-btn btn-lg col-2"
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
  // await updateView(playerChoice);
  const result: Gamestate | undefined = await makeMove(playerChoice);
  if (result === undefined) {
    console.log(`Result undefined after choosing ${playerChoice}`);
    return;
  }
  alert(result);
  await updateScore();
  
};
/*
const updateView = async (playerChoice: Choice) =>{
  const result: Result | undefined = await makeMove(playerChoice);
  if (result === undefined) {
    console.log(`Result undefined after choosing ${playerChoice}`);
    return;
  }

  const gameroundResultText = document.getElementById("GameroundResultText");
  const playerVisual = document.getElementById("PlayerVisual");
  const opponentVisual = document.getElementById("OpponentVisual");

  if (gameroundResultText && playerVisual && opponentVisual) {
    const opponentChoice = result.result === 1 ?
      (playerChoice === Choice.Rock ? "Scissors" : playerChoice === Choice.Paper ? "Rock" : "Paper") :
      result.result === 0 ? playerChoice :
        (playerChoice === Choice.Rock ? "Paper" : playerChoice === Choice.Paper ? "Scissors" : "Rock");

    gameroundResultText.innerHTML = result.result === 1 ? "You Win!" : result.result === 0 ? "Draw!" : "You Lose!";

    // If the elements are images, update their src and alt attributes.
    if (playerVisual instanceof HTMLImageElement && opponentVisual instanceof HTMLImageElement) {
      playerVisual.src = `src/assets/Player${playerChoice}.png`;
      playerVisual.alt = `Player chose ${playerChoice}`;
      opponentVisual.src = `src/assets/Opponent${opponentChoice}.png`;
      opponentVisual.alt = `Opponent chose ${opponentChoice}`;
    } else {
      // If something goes wrong with images, update innerHTML as text fallback values.
      playerVisual.innerHTML = playerChoice;
      opponentVisual.innerHTML = opponentChoice;
    }
  }
}
*/
//Updates the score, and increase the wins and losses.
//TODO: might have to be separated.
const updateScore = async () => {
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
