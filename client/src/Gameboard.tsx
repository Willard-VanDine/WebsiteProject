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

              {/* Rock Button */}
              <button type="button" className="btn btn-primary btn-lg col-2" onClick={async () => {
                const rock: Choice = Choice.Rock;
                const result: Result | undefined = await makeMove(rock);
                if (result === undefined) {
                  console.log("Result undefined after choosing Rock");
                  return;
                }

                const gameroundResultText = document.getElementById("GameroundResultText");
                const playerVisual = document.getElementById("PlayerVisual");
                const opponentVisual = document.getElementById("OpponentVisual");
                if (gameroundResultText !== null && playerVisual !== null && opponentVisual !== null) {
                  if (result.result === 1) {
                    gameroundResultText.innerHTML = "You Win!";
                    playerVisual.innerHTML = "Rock";
                    opponentVisual.innerHTML = "Scissor";
                  }
                  else if (result.result === 0) {
                    gameroundResultText.innerHTML = "Draw!";
                    playerVisual.innerHTML = "Rock";
                    opponentVisual.innerHTML = "Rock";
                  }
                  else if (result.result === -1) {
                    gameroundResultText.innerHTML = "You Lose!";
                    playerVisual.innerHTML = "Rock";
                    opponentVisual.innerHTML = "Paper";
                  }
                }

                const newScores: Gamestate | undefined = await getGameScore();
                if (newScores === undefined) {
                  console.log("Gamestate is undefined when getting score");
                  return;
                }
                const playerScore: HTMLElement | null = document.getElementById("PlayerScore");
                const opponentScore: HTMLElement | null = document.getElementById("OpponentScore");
                if (playerScore !== null && opponentScore !== null) {
                  playerScore.innerHTML = `Player score: ${newScores.playerScore}`;
                  opponentScore.innerHTML = `Opponent score: ${newScores.opponentScore}`;
                }
              }}>Rock</button>
              <div className="col-2"></div>

              {/* Paper Button */}
              <button type="button" className="btn btn-primary btn-lg col-2" onClick={async () => {
                const paper: Choice = Choice.Paper;
                const result: Result | undefined = await makeMove(paper);
                if (result === undefined) {
                  console.log("Result undefined after choosing Paper");
                  return;
                }

                const gameroundResultText = document.getElementById("GameroundResultText");
                const playerVisual = document.getElementById("PlayerVisual");
                const opponentVisual = document.getElementById("OpponentVisual");
                if (gameroundResultText !== null && playerVisual !== null && opponentVisual !== null) {
                  if (result.result === 1) {
                    gameroundResultText.innerHTML = "You Win!";
                    playerVisual.innerHTML = "Paper";
                    opponentVisual.innerHTML = "Rock";
                  }
                  else if (result.result === 0) {
                    gameroundResultText.innerHTML = "Draw!";
                    playerVisual.innerHTML = "Paper";
                    opponentVisual.innerHTML = "Paper";
                  }
                  else if (result.result === -1) {
                    gameroundResultText.innerHTML = "You Lose!";
                    playerVisual.innerHTML = "Paper";
                    opponentVisual.innerHTML = "Scissor";
                  }
                }

                const newScores: Gamestate | undefined = await getGameScore();
                if (newScores === undefined) {
                  console.log("Gamestate is undefined when getting score");
                  return;
                }
                const playerScore: HTMLElement | null = document.getElementById("PlayerScore");
                const opponentScore: HTMLElement | null = document.getElementById("OpponentScore");
                if (playerScore !== null && opponentScore !== null) {
                  playerScore.innerHTML = `Player score: ${newScores.playerScore}`;
                  opponentScore.innerHTML = `Opponent score: ${newScores.opponentScore}`;
                }
              }}>Paper</button>
              <div className="col-2"></div>

              {/* Scissor Button */}
              <button type="button" className="btn btn-primary btn-lg col-2" onClick={async () => {
                const scissor: Choice = Choice.Scissors;
                const result: Result | undefined = await makeMove(scissor);
                if (result === undefined) {
                  console.log("Result undefined after choosing Scissor");
                  return;
                }

                const gameroundResultText = document.getElementById("GameroundResultText");
                const playerVisual = document.getElementById("PlayerVisual");
                const opponentVisual = document.getElementById("OpponentVisual");
                if (gameroundResultText !== null && playerVisual !== null && opponentVisual !== null) {
                  if (result.result === 1) {
                    gameroundResultText.innerHTML = "You Win!";
                    playerVisual.innerHTML = "Scissor";
                    opponentVisual.innerHTML = "Paper";
                  }
                  else if (result.result === 0) {
                    gameroundResultText.innerHTML = "Draw!";
                    playerVisual.innerHTML = "Scissor";
                    opponentVisual.innerHTML = "Scissor";
                  }
                  else if (result.result === -1) {
                    gameroundResultText.innerHTML = "You Lose!";
                    playerVisual.innerHTML = "Scissor";
                    opponentVisual.innerHTML = "Rock";
                  }
                }

                const newScores: Gamestate | undefined = await getGameScore();
                if (newScores === undefined) {
                  console.log("Gamestate is undefined when getting score");
                  return;
                }
                const playerScore: HTMLElement | null = document.getElementById("PlayerScore");
                const opponentScore: HTMLElement | null = document.getElementById("OpponentScore");
                if (playerScore !== null && opponentScore !== null) {
                  playerScore.innerHTML = `Player score: ${newScores.playerScore}`;
                  opponentScore.innerHTML = `Opponent score: ${newScores.opponentScore}`;
                }
              }}>Scissor</button>
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
