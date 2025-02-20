import express, { Request, Response } from "express";
import { GamestateService } from "../service/gamestate.service";
import { Gamestate } from "../model/gamestate.interface";
import { Choice } from "../model/choices.enum";
import { Result } from "../model/result.interface";
// Initialize gamestate service and router
const gamestateService = new GamestateService();
export const gamestateRouter = express.Router();

// Initialize router paths:

// ===== GET REQUEST ===== //
//TODO fix all the res send messages.
gamestateRouter.get("/", async (
    req: Request<{}, {}, {}>,
    res: Response<Gamestate | String> // Return gamestate or error string
) => {
    try {
        const result : Gamestate = await gamestateService.getGameScore();
        res.status(200).send(result);
    }
    catch (e : any) {
        res.status(500).send(e.message);
    }
});

// ===== POST REQUEST ===== //

gamestateRouter.post("/", async (
    req: Request<{}, {}, { playerChoice: Choice }>,
    res: Response<Result | String>
) => {
    try {
        const choiceFromPlayer = req.body.playerChoice;

        // Handle if input is of wrong type.
        if (![Choice.Paper, Choice.Rock, Choice.Scissors].includes(choiceFromPlayer)) {
            res.status(400).send(`Bad POST call to ${req.originalUrl} --- choiceFromPlayer has value ${choiceFromPlayer}`);
            return;
        }

        // Handle input of correct type, execute action.
        const result = await gamestateService.makeMove(choiceFromPlayer);        
        // TODO: Make sure the player gets an accountwin/loss if score reaches 5.
        const r : Result = {result: result};
        res.status(201).send(r);
    } 
    catch (e : any) {
        res.status(500).send(e.message);
    }
});

gamestateRouter.post("/startgame", async (
    req: Request<{}, {}, {}>,
    res: Response<string>
) => {
    try {
        await gamestateService.startGame();
        res.status(201).send(`{"success" : true}`);
    } 
    catch (e : any) {
        res.status(500).send(e.message);
    }
});