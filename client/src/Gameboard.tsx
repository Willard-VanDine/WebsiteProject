import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/esm/Stack';
import {Choice} from "../../server/src/model/choices.enum";
import { makeMove, startGame } from './api';
import { Result } from '../../server/src/model/result.interface';
//import Container from 'react-bootstrap/Container';
//import Row from 'react-bootstrap/Row';
//import Col from 'react-bootstrap/Col';

const GameBoard = () => {
  return (
    // container class ensures consistency between pages 
    <div className="container" style={{height: "calc(100vh - 4rem - 8px)"}}>
      <div className=" d-flex flex-column justify-content-between" style={{ height: "100%" }}>
        <div className="gameboard rounder"></div>

        <div className="container h-25" >
          <div className="row rounder buttoncontainer d-flex justify-content-around align-items-center">
            <div className="col-1"></div> 

            <button type="button" className="btn btn-primary btn-lg col-2" onClick={async () => {
              await startGame();
              const rock : Choice = Choice.Rock;
              const result : Result | undefined = await makeMove(rock);
              if (result === undefined){
                console.log("Result undefined after choosing Rock");
                return;
              }
              console.log(result.result); // TODO: Actual logic

            }}>Rock</button>
            <div className="col-2"></div>

            <button type="button" className="btn btn-primary btn-lg col-2" onClick={async () => {

              const paper : Choice = Choice.Paper;
              const result : Result | undefined = await makeMove(paper);
              if (result === undefined){
                console.log("Result undefined after choosing Paper");
                return;
              }
              console.log(result.result); // TODO: Actual logic

            }}>Paper</button>
            <div className="col-2"></div>

            <button type="button" className="btn btn-primary btn-lg col-2" onClick={async () => {

              const scissor : Choice = Choice.Scissors;
              const result : Result | undefined = await makeMove(scissor);
              if (result === undefined){
                console.log("Result undefined after choosing Scissor");
                return;
              }
              console.log(result.result); // TODO: Actual logic

            }}>Scissor</button>
            <div className="col-1"></div>

          </div>

        </div>

      </div>
    </div>
  );
};
export default GameBoard;
