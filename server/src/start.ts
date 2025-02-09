import express from "express";
import { accountRouter } from "./router/account.router";
import { gamestateRouter } from "./router/gamestate.router";

export const app = express();

app.use(express.json());
app.use("/account", accountRouter);
app.use("/gameboard", gamestateRouter);