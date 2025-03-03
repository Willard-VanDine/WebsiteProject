import express, { Request, Response, Router } from "express";
import { GamestateService } from "../service/gamestate.service";
import { Gamestate } from "../model/gamestate.interface";
import { Choice } from "../model/choices.enum";
import { Result } from "../model/result.interface";
import { IGamestateService } from "../service/gamestate.service.interface";

// Initialize router paths:
export  function gamestateRouter(gamestateService: IGamestateService): Router {
    // Initialize gamestate service and router
    const gamestateRouter = express.Router();

    interface GamestateRequest {
        session: any
    }
    interface CreateGamestateRequest extends Request{
        body: { playerChoice: Choice },
        session : any

    }
// ===== GET REQUEST ===== //
//TODO fix all the res send messages.
gamestateRouter.get("/", async ( req: GamestateRequest, res: Response<Gamestate | String>)  => {
    try {
        if (!req.session.username) {
            res.status(401).send("Not logged in");
            return;
        }
        const gamestate : Gamestate| undefined = await gamestateService.getGameScore(req.session.username);
        if (!gamestate) {
            delete req.session.username;
            res.status(401).send("Not logged in");
            return;
        }
        res.status(200).send(gamestate);
    }
    catch (e : any) {
        res.status(500).send(e.message);
    }
})

// ===== POST REQUEST ===== //

gamestateRouter.post("/", async (
    req: CreateGamestateRequest,
    res: Response<Result | String>
) => {
    try {
        console.log(req.session.username);
        if (!req.session.username) {
            res.status(401).send("Not logged in");
            return;
        }
        const choiceFromPlayer = req.body.playerChoice;

        // Handle if input is of wrong type.
        if (![Choice.Paper, Choice.Rock, Choice.Scissors].includes(choiceFromPlayer)) {
            res.status(400).send(`Bad POST call to ${req.originalUrl} --- choiceFromPlayer has value ${choiceFromPlayer}`);
            return;
        }
        
        // Handle input of correct type, execute action.
        const result: number | undefined = await gamestateService.makeMove(req.session.username,choiceFromPlayer); 
        if (result === undefined) {
            console.log("User logged in as " + req.session.username + " no longer exists");
            delete req.session.username;
            res.status(401).send("Not logged in");
            return;
        }       
        // TODO: Make sure the player gets an accountwin/loss if score reaches 5.
        const r : Result = {result: result};
        res.status(201).send(r);
    } 
    catch (e : any) {
        res.status(500).send(e.message);
    }
})

gamestateRouter.post("/startgame", async (
    req: GamestateRequest,
    res: Response<string>
) => {
    try {
        if (!req.session.username) {
            res.status(401).send("Not logged in");
            return;
        }
        await gamestateService.startGame(req.session.username);
        res.status(201).send(`{"success" : true}`);
    } 
    catch (e : any) {
        res.status(500).send(e.message);
    }
});
return  gamestateRouter;
}