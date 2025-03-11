// Session supertesting for the start.ts file

import { winnerOfGame } from "./model/winnerOfGame.enum";

var session = require('supertest-session');
var myApp = require('./start');

var testSession: any = null;

beforeEach(function () {
    testSession = session(myApp.app);
});

test("Trying to fetch data when gameboard not initilized", async () => {
    const res2 = await testSession.get("/gameboard");
    console.log(res2.statusCode);
    expect(res2.statusCode).toEqual(401);

});


test("Initializing gameboard", async () => {

    await testSession.post("/account").send({
        username: "MrDragon2112",
        password: "12345"
    });

    const res1 = await testSession.post("/account/login").send(
        {
            username: "MrDragon2112",
            password: "12345"
        }
    );

    await testSession.post("/gameboard/subscribeToGame").send(
        {
            session: testSession
        }
    );

    expect(res1.status).toStrictEqual(200);
    const res2 = await testSession.get("/gameboard");
    expect(res2.statusCode).toStrictEqual(200);
    expect(res2.body).toEqual({
        gameName: "Rock paper scissors",
        gameThreshold: 4,
        playerScore: 0,
        opponentScore: 0,
        winnerOfGame: winnerOfGame.noWinner
    });

});


