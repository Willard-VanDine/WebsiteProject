import express from "express";
import { accountRouter } from "./router/account.router";
import { gamestateRouter } from "./router/gamestate.router";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import { AccountService } from "./service/account.service";
import { GamestateService } from "./service/gamestate.service";

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
const accountService = new AccountService();
const gamestateService = new GamestateService(accountService);
app.use("/account", accountRouter(accountService));
app.use("/gameboard", gamestateRouter(gamestateService));