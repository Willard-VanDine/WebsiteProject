import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/esm/Stack';
//import Container from 'react-bootstrap/Container';
//import Row from 'react-bootstrap/Row';
//import Col from 'react-bootstrap/Col';
import './main.css';

const GameBoard = () => {
  return (
    // container class ensures consistency between pages 
    <div className="container" style={{height: "calc(100vh - 4rem - 8px)"}}>
      <div className=" d-flex flex-column justify-content-between" style={{ height: "100%" }}>
        <div className="gameboard rounder"></div>

        <div className="container h-25" >
          <div className="row rounder buttoncontainer d-flex justify-content-around align-items-center">
            <div className="col-1"></div> 

            <button type="button" className="btn btn-primarye btn-lg col-2">Rock</button>
            <div className="col-2"></div>

            <button type="button" className="btn btn-primary btn-lg col-2">Paper</button>
            <div className="col-2"></div>

            <button type="button" className="btn btn-primary btn-lg col-2">Scissor</button>
            <div className="col-1"></div>

          </div>

        </div>

      </div>
    </div>
  );
};
export default GameBoard;
