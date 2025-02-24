import express, { Request, Response, Router } from "express";
import { AccountService } from "../service/account.service";
import { Account } from "../model/account.interface";

export function accountRouter(accountService: AccountService): Router {
    const accountRouter = express.Router();

    interface CreateAccountRequest extends Request {
        body: { username: string, password: string },
        session: any
    }
    //get account
    accountRouter.get("/")


    //get request for checking the session
    accountRouter.get("/check-session", )
    accountRouter.post("/", async (req: CreateAccountRequest, res: Response) => {
        await accountService.registerAccount(req.body.username, req.body.password);
        res.status(201).send({username: req.body.username});
    })

    accountRouter.post("/login", async (req: CreateAccountRequest, res: Response) => {
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