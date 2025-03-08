import express, { Request, Response, Router } from "express";
import { Account } from "../model/account.interface";
import { LoggedIn } from "../model/loggedin.interface";
import { UserContent } from "../model/usercontent.interface";
import { IAccountService } from "../service/account.service.interface";

export function accountRouter(accountService: IAccountService): Router {
    const accountRouter = express.Router();

    //Used for calls that do not require an input.
    interface AccountRequest{
        session:any
    }
    //Includes a body so that it can be used for method calls.
    interface CreateAccountRequest extends Request {
        body: { username: string, password: string },
        session: any
    }
    //TODO: Fixa alla interfaces in i denna filen.
    interface UpdateAccount extends Request{
        body: {number:number},
        session: any
    }
    //get User Content. Takes the session username and check if such a user exists.
    //If such User exists then return username, accountwins and accountlosses
    accountRouter.get("/getAccount", async (req: AccountRequest, res: Response<UserContent|String>)=>{
        try{
        const account:Account | undefined = await accountService.findAccount(req.session.username);
       //if such a user exist then return the properties otherwise message
        if((req.session.username != undefined) && (account != undefined)){
           const userContent: UserContent = {username: account.username, accountWins: account.accountWins, accountLosses: account.accountLosses};
            res.status(200).send(userContent);
        }else{
            res.status(401).send("Such a user does not exist.");
        }
        }catch(e:any){
            res.status(500).send(e.message);
        }
    })


    //get request for checking the session returns a JSON LoggedIn:true if true and false if false
    //it is used to verify if a user is logged in, and updates the website respectively
    accountRouter.get("/check-session", async (req: AccountRequest, res: Response<LoggedIn|string>)=>{
        try{
        if(req.session.username){
            res.status(200).send({loggedIn:true});
        }else{
            res.status(401).send({loggedIn:false});
        }
        }catch(e:any){
            res.status(500).send(e.message);
        }
    })
    //If a user is logged in, they will be logged out.
    accountRouter.get("/logOut", async (req: AccountRequest, res: Response<void|String>)=>{
        try{
        if(req.session.username){
            delete req.session.username;
            res.status(204).send();
        }else{
            res.status(401).send("You are not logged in!");
        }
        }catch(e :any){
            res.status(500).send(e.message);
        }
    })
    //Register a user by using the constructor. Does not return a body, just a 201 message.
    accountRouter.post("/", async (req: CreateAccountRequest, res: Response<void|string>) => {
        try{
        if(await accountService.registerAccount(req.body.username, req.body.password) === true){
            res.status(201).send();
        }
        else{
             res.status(401).send("Such an account already exists!");
        }
        }catch(e:any){
            res.status(500).send(e.message);
        }
    })
    //Login, takes an input that is a username and a password
    //If the Credentials are correct or if the user does not exist then 
    accountRouter.post("/login", async (req: CreateAccountRequest, res: Response<void|string>) => {
        try{
        const user: Account | undefined = await accountService.findAccount(req.body.username, req.body.password);
        if (user === undefined) {
            res.status(401).send("You are not logged in!");
            return;
        }
        
        req.session.username = req.body.username; // Login
        res.status(200).send();
        }catch(e:any){
            res.status(500).send(e.message);
        }
    })
    

    return accountRouter;
}