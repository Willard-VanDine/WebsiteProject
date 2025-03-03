import { Gamestate } from "../model/gamestate.interface";
import { Choice } from "../model/choices.enum";
import { Account } from "../model/account.interface";
import { IAccountService } from "./account.service.interface";

export interface IGamestateService {
    
    
    // Starts a new game -> reset the state
    // Exposed for the router layer so player can request to start a new game 
    startGame(username:string) : Promise<void|undefined> 
     
    // Make a move for the player and for the "PC opponent" (POST-request I believe, as above)
    // Exposed for the router layer, so player can play lé Sten Sax Påse :)
    makeMove(username: string, playerChoice: Choice): Promise<number | undefined> 
        



    // GET current game score. Explosed for the router layer.
    getGameScore(username:string) : Promise<Gamestate| undefined> 
        //Checks if valid User then returns the Users gamestate.
       
}
