import express, { Request, Response, Router } from "express";
import { AccountService } from "../service/account.service";
import { Account } from "../model/account.interface";

export function accountRouter(accountService: AccountService): Router {
    const accountRouter = express.Router();

    interface AccountRequest extends Request {
        body: { username: string, password: string },
        session: any
    }

    accountRouter.post("/", async (req: AccountRequest, res: Response) => {
        await accountService.registerAccount(req.body.username, req.body.password);
        res.status(201).send({username: req.body.username});
    })

    accountRouter.post("/login", async (req: AccountRequest, res: Response) => {
        const user: Account | undefined = await accountService.findAccount(req.body.username, req.body.password);
        if (user === undefined) {
            res.status(401).send("No such username or password");
            console.log("No such User exist")
            return;
        }
        
        req.session.username = req.body.username; // Login
        console.log("Logged in!")
        res.status(200).send("Logged in");
    })

    return accountRouter;
}