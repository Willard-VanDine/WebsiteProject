import express, { Request, Response } from "express";
import { GamestateService } from "../service/gamestate.service";
import { Gamestate } from "../model/gamestate.interface";
import { Choice } from "../model/choices.enum";

// Initialize gamestate service and router
const gamestateService = new GamestateService();
export const gamestateRouter = express.Router();

// Initialize router paths:

// ===== GET REQUEST ===== //

gamestateRouter.get("/gameboard", async (
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

gamestateRouter.post("/gameboard", async (
    req: Request<{}, {}, { playerChoice: Choice }>,
    res: Response<number | String>
) => {
    try {
        const choiceFromPlayer = req.body.playerChoice;

        // Handle if input is of wrong type.
        if (choiceFromPlayer !== (Choice.Paper || Choice.Rock || Choice.Scissors)) {
            res.status(400).send(`Bad POST call to ${req.originalUrl} --- choiceFromPlayer has type ${typeof (choiceFromPlayer)}`);
            return;
        }

        // Handle input of correct type, execute action.
        const result = await gamestateService.makeMove(choiceFromPlayer);        
        res.status(201).send(result);
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