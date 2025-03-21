import express, { Request, Response, Router } from "express";
import { Gamestate } from "../model/gamestate.interface";
import { Choice } from "../model/choices.enum";
import { IGamestateService } from "../service/gamestate.service.interface";

// Initialize router paths:
export function gamestateRouter(gamestateService: IGamestateService<Choice>): Router {
    // Initialize gamestate service and router
    const gamestateRouter = express.Router();

    interface GamestateRequest {
        session: any
    }
    interface CreateGamestateRequest extends Request {
        body: { playerChoice: Choice },
        session: any

    }

    // ===== GET REQUEST ===== //
    //TODO fix all the res send messages.
    gamestateRouter.get("/", async (req: GamestateRequest, res: Response<Gamestate | String>) => {
        try {
            if (!req.session.username) {
                res.status(401).send("Not logged in");
                return;
            }
            const gamestate: Gamestate | undefined = await gamestateService.getGameScore(req.session.username);
            if (!gamestate) {
                res.status(400).send("You are not subscribed to game");
                return;
            }
            res.status(200).send(gamestate);
        }
        catch (e: any) {
            res.status(500).send(e.message);
        }
    })
    
    // ===== PATCH REQUEST ===== //

    gamestateRouter.patch("/", async (
        req: CreateGamestateRequest,
        res: Response<Gamestate | String>
    ) => {
        try {
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
            const result: Gamestate | undefined = await gamestateService.makeMove(req.session.username, choiceFromPlayer);
            if (result === undefined) {
                res.status(401).send("You are not subsribed to the game!");
                return;
            }
            // TODO: Make sure the player gets an accountwin/loss if score reaches 5.;
            res.status(201).send(result);
        }
        catch (e: any) {
            res.status(500).send(e.message);
        }
    })

    // ===== POST REQUEST ===== //
    gamestateRouter.post("/subscribeToGame", async (
        req: GamestateRequest,
        res: Response<void|string>
    ) => {
        try {
            if (!req.session.username) {
                res.status(401).send("You are not logged in!");
                return;
            }
           
            const isSubscribed: boolean|undefined = await gamestateService.subscribeToGame(req.session.username);
            if(isSubscribed === true){
                res.status(201).send("You subscribed succesfully");
                return;
            }
            if(isSubscribed === false){
                res.status(200).send("User is already subscribed");
                return;
            }else{
                res.status(401).send("Such a user does not exist!");
            }
            
        }
        catch (e: any) {
            res.status(500).send(e.message);
        }
    });


    return gamestateRouter;
}