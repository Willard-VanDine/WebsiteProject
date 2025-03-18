// Session supertesting for the start.ts file

import exp from "constants";
import { winnerOfGame } from "./model/winnerOfGame.enum";

var session = require('supertest-session');
var myApp = require('./start');

var testSession: any = null;

beforeEach(function () {
    testSession = session(myApp.app);
});


/// --- ** accout router ** --- // 



test("Trying to fetch data when account is not registered", async () => {
    const res1 = await testSession.get("account/getAccount");
    expect(res1.statusCode).toEqual(401);

});


test("Trying to fetch data when account is registered", async () => {
    const res1 = await testSession.post("/account").send({
        username: "test",
        password: "123",
    });

    const res2 = await testSession.get("account/getAccount");

    expect(res1.statusCode).toStrictEqual(200);
    expect(res2.body).toEqual({
        username: "test",
        accountWins: 0,
        accountLosses: 0,
    });

});


test("Trying to login with an unregistered", async () => {
    const res1 = await testSession.post("account/login");
    expect(res1.statusCode).toEqual(401);

});

test("Trying to login with a registered", async () => {
    const res1 = await testSession.post("/account").send({
        username: "test",
        password: "123",
    });


    const res2 = await testSession.post("account/login");

    expect(res1.statusCode).toEqual(200);
    expect(res2.statusCode).toEqual(200);

});


test("Trying to log out with an unregistered", async () => {
    const res1 = await testSession.get("account/logOut");
    expect(res1.statusCode).toEqual(401);

});

test("Trying to log out with a registered", async () => {
    const res1 = await testSession.post("/account").send({
        username: "test",
        password: "123",
    });

    const res2 = await testSession.get("account/logOut");

    expect(res1.statusCode).toEqual(200);
    expect(res2.statusCode).toEqual(204);

});

test("Trying to check whether an unregisterd account is logged in ", async () => {
    const res1 = await testSession.get("account/check-session");
    expect(res1.body).toEqual({
        loggedIn: false
    });

});

test("Trying to check whether a register account is logged in", async () => {
    const res1 = await testSession.post("/account").send({
        username: "test",
        password: "123",
    });

    const res2 = await testSession.post("/account/login").send(
        {
            username: "test",
            password: "123"
        }
    );

    const res3 = await testSession.get("account/check-session");

    expect(res1.statusCode).toEqual(200);
    expect(res2.statusCode).toEqual(204);
    expect(res3.body).toEqual({
        loggedIn: true
    });

});







// --- ** gamestate router ** --- // 

// Sad path
test("Trying to fetch data when gameboard not initilized", async () => {
    const res2 = await testSession.get("/gameboard");
    console.log(res2.statusCode);
    expect(res2.statusCode).toEqual(401);

});

// Happy path
test("Initializing gameboard", async () => {

    await testSession.post("/account").send({
        username: "test",
        password: "123"
    });

    const res1 = await testSession.post("/account/login").send(
        {
            username: "test",
            password: "123"
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

// Sad path
test("Trying to make move with an unregistered account ", async () => {
    const res2 = await testSession.post("/gameboard");
    expect(res2.statusCode).toEqual(401);

});

// Happy path
test("Trying to make move with a registered account", async () => {

    await testSession.post("/account").send({
        username: "test",
        password: "123"
    });

    await testSession.post("/account/login").send(
        {
            username: "test",
            password: "123"
        }
    );

    await testSession.post("/gameboard/subscribeToGame").send(
        {
            session: testSession
        }
    );

    const res1 = await testSession.post("/gameboard").send(
        {
            playerChoice: "Rock"
        }
    );




    expect(res1.status).toStrictEqual(201);
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


