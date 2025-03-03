import express from "express";
import { accountRouter } from "./router/account.router";
import { gamestateRouter } from "./router/gamestate.router";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import { AccountService } from "./service/account.service";
import { GamestateService } from "./service/gamestate.service";
import { IAccountService } from "./service/account.service.interface";
import { AccountDBService } from "./service/accountDB.service";
import { IGamestateService } from "./service/gamestate.service.interface";
import { GamestateDBService } from "./service/gamestateDB.service";

export const app = express();
dotenv.config();
if (! process.env.SESSION_SECRET) {
  console.log("Could not find SESSION_SECRET in .env file");
  process.exit();
}
app.use(session({
  secret : process.env.SESSION_SECRET,
  resave : false,
  saveUninitialized : true
}));
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
const accountService: IAccountService = new AccountDBService();
const gamestateService:IGamestateService = new GamestateDBService(accountService);
app.use("/account", accountRouter(accountService));
app.use("/gameboard", gamestateRouter(gamestateService));