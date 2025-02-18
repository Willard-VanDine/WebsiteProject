import 'bootstrap/dist/css/bootstrap.min.css';
import {Choice} from "../../server/src/model/choices.enum";
import {Gamestate} from "../../server/src/model/gamestate.interface"
import { getGameScore, makeMove, startGame } from './api';
import { Result } from '../../server/src/model/result.interface';
//import Container from 'react-bootstrap/Container';
//import Row from 'react-bootstrap/Row';
//import Col from 'react-bootstrap/Col';

const GameBoard = () => { // TODO: MAKE THIS PAGE SHOW CURRENT GAME SCORE. MAKE "START GAME" BUTTON RESET GAME. 
  return (
    // container class ensures consistency between pages 
    <div className="container" style={{height: "calc(100vh - 4rem - 8px)"}}>
      <div className=" d-flex flex-column justify-content-between" style={{ height: "100%" }}>
        <div className="gameboard rounder">
          <p id="GameroundResultText" data-testid="GameroundResultText">Make a choice to play!</p>
        </div>

        <div className="container h-25" >
          <div className="row rounder buttoncontainer d-flex justify-content-around align-items-center">
            <div className="col-1"></div> 

            <button type="button" className="btn btn-primary btn-lg col-2" onClick={async () => {
              
              const rock : Choice = Choice.Rock;
              const result : Result | undefined = await makeMove(rock);
              if (result === undefined){
                console.log("Result undefined after choosing Rock");
                return;
              }
              
              const gameroundResultText = document.getElementById("GameroundResultText");
              if(gameroundResultText !== null){
                if(result.result === 1)
                  gameroundResultText.innerHTML = "You Win!";
                else if(result.result === 0)
                  gameroundResultText.innerHTML = "Draw!";
                else if(result.result === -1)
                  gameroundResultText.innerHTML = "You Lose!";
              }

            }}>Rock</button>
            <div className="col-2"></div>

            <button type="button" className="btn btn-primary btn-lg col-2" onClick={async () => {
              
              const paper : Choice = Choice.Paper;
              const result : Result | undefined = await makeMove(paper);
              if (result === undefined){
                console.log("Result undefined after choosing Paper");
                return;
              }
              const gameroundResultText = document.getElementById("GameroundResultText");
              if(gameroundResultText !== null){
                if(result.result === 1)
                  gameroundResultText.innerHTML = "You Win!";
                else if(result.result === 0)
                  gameroundResultText.innerHTML = "Draw!";
                else if(result.result === -1)
                  gameroundResultText.innerHTML = "You Lose!";
              }

            }}>Paper</button>
            <div className="col-2"></div>

            <button type="button" className="btn btn-primary btn-lg col-2" onClick={async () => {

              const scissor : Choice = Choice.Scissors;
              const result : Result | undefined = await makeMove(scissor);
              if (result === undefined){
                console.log("Result undefined after choosing Scissor");
                return;
              }
              const gameroundResultText = document.getElementById("GameroundResultText");
              if(gameroundResultText !== null){
                if(result.result === 1)
                  gameroundResultText.innerHTML = "You Win!";
                else if(result.result === 0)
                  gameroundResultText.innerHTML = "Draw!";
                else if(result.result === -1)
                  gameroundResultText.innerHTML = "You Lose!";
              }

            }}>Scissor</button>
            <div className="col-1"></div>

          </div>

        </div>

      </div>
    </div>
  );
};
export default GameBoard;
