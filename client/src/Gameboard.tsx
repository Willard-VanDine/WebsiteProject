import 'bootstrap/dist/css/bootstrap.min.css';
import { Choice } from "../../server/src/model/choices.enum";
import { Gamestate } from "../../server/src/model/gamestate.interface";
import { getGameScore, makeMove } from './api';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { winnerOfGame } from '../../server/src/model/winnerOfGame.enum';

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
  const currentScores: Gamestate | undefined = await getGameScore();
  if (currentScores === undefined) {
    //console.log("Unable to retrieve game score.");
    alert("Please Subscribe to rock, paper and scissors before you try to play!")
    return;
  }
  await updateView(playerChoice, currentScores);
  await updateScore();
};

const updateView = async (playerChoice: Choice, gamestateBefore: Gamestate) => {
  const result: Gamestate | undefined = await makeMove(playerChoice);
  if (result === undefined) {
    //console.log(`Result undefined after choosing ${playerChoice}`);
    return;
  }

  const gameroundResultText = document.getElementById("GameroundResultText");
  const playerVisual = document.getElementById("PlayerVisual");
  const opponentVisual = document.getElementById("OpponentVisual");

  if (gameroundResultText && playerVisual && opponentVisual) {
    let opponentChoice: Choice;

    // Determine the outcome based on score difference
    if (result.playerScore > gamestateBefore.playerScore || result.winnerOfGame === winnerOfGame.playerWins) {
      // Player wins as player's score increased
      gameroundResultText.innerHTML = "You Win!";
      opponentChoice = (playerChoice === Choice.Rock) ? Choice.Scissors :
                       (playerChoice === Choice.Paper) ? Choice.Rock : Choice.Paper;
    } else if (result.opponentScore > gamestateBefore.opponentScore || result.winnerOfGame === winnerOfGame.opponentWins) {
      // Opponent wins as opponent's score increased
      gameroundResultText.innerHTML = "You Lose!";
      opponentChoice = (playerChoice === Choice.Rock) ? Choice.Paper :
                       (playerChoice === Choice.Paper) ? Choice.Scissors : Choice.Rock;
    } else {
      // Draw as score did not change.
      gameroundResultText.innerHTML = "Draw!";
      opponentChoice = playerChoice;  // Opponent made the same choice
    }

    // If the elements are images, update their src and alt attributes.
    if (playerVisual instanceof HTMLImageElement && opponentVisual instanceof HTMLImageElement
      && result.winnerOfGame === winnerOfGame.noWinner) {
      playerVisual.src = `src/assets/Player${playerChoice}.png`;
      playerVisual.alt = `Player chose ${playerChoice}`;
      opponentVisual.src = `src/assets/Opponent${opponentChoice}.png`;
      opponentVisual.alt = `Opponent chose ${opponentChoice}`;
    } else if (playerVisual instanceof HTMLImageElement && opponentVisual instanceof HTMLImageElement
      && result.winnerOfGame !== winnerOfGame.noWinner) {
      playerVisual.src = `src/assets/react.svg`;
      playerVisual.alt = `Default icon for player`;
      opponentVisual.src = `src/assets/react.svg`;
      opponentVisual.alt = `Default icon for opponent`;
      gameroundResultText.innerHTML = "Make a choice to play!";
    } else {
      // If something goes wrong with images, update innerHTML as text fallback values.
      playerVisual.innerHTML = playerChoice;
      opponentVisual.innerHTML = opponentChoice;
    }
  }

  if(result.winnerOfGame === winnerOfGame.playerWins){
    alert("You won the game!");
  } 
  else if(result.winnerOfGame === winnerOfGame.opponentWins){
    alert("You lost the game!");
  }
}

//Updates the score, and increase the wins and losses.
//TODO: might have to be separated.
const updateScore = async () => {
  const newScores: Gamestate | undefined = await getGameScore();
  if (!newScores) {
    //console.log("Gamestate is undefined when getting score");
    return;
  }
  

  const playerScore = document.getElementById("PlayerScore");
  const opponentScore = document.getElementById("OpponentScore");

  if (playerScore && opponentScore) {
    playerScore.innerHTML = `Player score: ${newScores.playerScore}`;
    opponentScore.innerHTML = `Opponent score: ${newScores.opponentScore}`;
  }
};
