import { Gamestate } from "../model/gamestate.interface";
import { Choice } from "../model/choices.enum";
import { Account } from "../model/account.interface";
import { IAccountService } from "./account.service.interface";

export interface IGamestateService<I> {
    
    /*
    Makes it so users can subscribe to a specific game. It should fill in the neccesary components
    such as gamename and gametreshold that this game will use. PlayerScore and OpponentScore should start at 0
    winnerOfGame enum should always be insantiated to nowinner.
    Returns true if a User subscribed to the game succesfully, returns false if user is already subscribed to the game.
    Returns undefined if the user does not exist.
    */
    subscribeToGame(username:string) : Promise<boolean|undefined> 
     /*
    Make a move for the player and for the "PC opponent" the implementation is dependent on what kind of game it is

    Exposed for the router layer. 
    TODO: what inputs should this method take?
    ^*/
    makeMove(username: string, playerInput: I): Promise<Gamestate | undefined> 
        



    // GET current game score. Explosed for the router layer.
    getGameScore(username:string) : Promise<Gamestate| undefined> 
        //Checks if valid User then returns the Users gamestate.
       
}
