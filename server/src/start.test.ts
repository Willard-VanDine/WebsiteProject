import * as SuperTest from "supertest";
//import { app } from "./start";
import { Gamestate } from "./model/gamestate.interface";


//TODO: Check why the tests are not independent, this is an attempt to solve but it does not help.
// REMEMBER THAT THE ORDER MATTERS! the test cases' order needs to be considered.
 let request: SuperTest.Agent;
 let app = require("./start");
 beforeEach(() => {
    app = require("./start");
    request = SuperTest.default(app.app);
  });

  test("Trying to fetch data when gameboard not initilized", async () => {
    const res2 = await request.get("/gameboard");
    console.log(res2.statusCode);
    expect(res2.statusCode).toEqual(500);

});
 
 

test("Initializing gameboard", async () => {

    const res1 = await request.post("/gameboard/startgame").send();
    expect(res1.status).toStrictEqual(201);
    const res2 = await request.get("/gameboard");
    expect(res2.statusCode).toEqual(200);
    expect(res2.body).toEqual({
        playerScore: 0,
        opponentScore: 0
    });

});


