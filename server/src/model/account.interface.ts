import { Gamestate } from "./gamestate.interface";

export interface Account {
    username : string;
    password : string;
    accountWins : number;
    accountLosses : number
}