import express, { Request, Response } from "express";
import { AccountService } from "../service/account.service";
import { Account } from "../model/account.interface";

// Initialize gamestate service and router
const accountService = new AccountService();
export const accountRouter = express.Router();

// Initialize router paths:

// ===== GET REQUEST ===== //

accountRouter.get("/account", async (
    req: Request<{}, {}, {}>,
    res: Response<Account | String>
) => {
    try{
        const result : Account = await accountService.getAccount();
        res.status(200).send(result);
    }
    catch(e : any){
        res.status(500).send(e.message);
    }
});

// ===== POST REQUEST ===== //

accountRouter.post("/account", async (
    req: Request<{}, {}, {username : string}>,
    res: Response<String>
) => {
    try{
        const username = req.body.username;

        if(typeof(username) !== "string"){
            res.status(400).send(`Bad POST call to ${req.originalUrl} --- username has type ${typeof (username)}`);
            return;
        }

        await accountService.registerAccount(username);
        res.status(200).send(`{"success" : true}`);
    }
    catch(e : any){
        res.status(500).send(e.message);
    }
});
