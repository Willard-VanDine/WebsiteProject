import { Gamestate } from "../model/gamestate.interface";
import { Choice } from "../model/choices.enum";
import { AccountService } from "./account.service";
import { Account } from "../model/account.interface";

export class GamestateService {
    private accountService: AccountService;
    

    // Represent an ongoing game, start "fresh" with no choices made yet.
    private currentGame: { playerChoice: Choice | null, opponentChoice: Choice | null } = {
        playerChoice: null,
        opponentChoice: null
    };
    constructor(accountService: AccountService){
        this.accountService = accountService;
    }
    // Starts a new game -> reset the state (POST-request I believe, we request modification of data)
    // Exposed for the router layer so player can request to start a new game
    // should maybe return GameState, as we could use a get request for tomorrow, 
    async startGame(username:string) : Promise<void|undefined> {
        const user : Account | undefined = await this.accountService.findAccount(username);
        if (user === undefined) {
            return undefined
        }
        this.currentGame = {
            playerChoice: null,
            opponentChoice: null
        };

        user.gamestate ={
            playerScore: 0,
            opponentScore: 0            
        };
    }
    
    // Make a move for the player and for the "PC opponent" (POST-request I believe, as above)
    // Exposed for the router layer, so player can play lé Sten Sax Påse :)
    async makeMove(username: string, playerChoice: Choice): Promise<number | undefined> {
        const user: Account | undefined = await this.accountService.findAccount(username);
        if (user === undefined) {
            return undefined;
        }
    
        // Proceed with the move and determine winner
        this.currentGame.playerChoice = playerChoice;
        this.currentGame.opponentChoice = this.getOpponentChoice();
        const result = this.determineWinner(user);
    
       
    
        return result;
    }
    

    // Helper method to randomly generate a choice for the opponent
    private getOpponentChoice(): Choice {
        const choices = [Choice.Rock, Choice.Paper, Choice.Scissors];
        //Note: random returns number between 0 and 1. Line below just multiplies by 3 so we can floor it
        // i.e. random <= 0.333  gives floor 0.99 = gives 0, any higher gives 1 up to 0.667 and after which gives 2 
        const randomIndex = Math.random() * choices.length;
        const index = Math.floor(randomIndex) % choices.length; // Modulo just in case
        return choices[index];
    }

    // Determine winner between player and opponent
    // Returns  1 if player scored
    // Returns  0 if it's a draw
    // Returns -1 if opponent scored
    private determineWinner(user:Account): number {
        const { playerChoice, opponentChoice } = this.currentGame;

        if (playerChoice === opponentChoice) {
            return 0; // Draw
        }

        // The cases in which the player scores
        if ((playerChoice === Choice.Rock && opponentChoice === Choice.Scissors) ||
            (playerChoice === Choice.Paper && opponentChoice === Choice.Rock) ||
            (playerChoice === Choice.Scissors && opponentChoice === Choice.Paper)) {
            user.gamestate.playerScore++;
            return 1;
        }

        // If it's not draw & player didn't score -> opponent scored
        user.gamestate.opponentScore++;
        return -1; // PC wins
    }

    // GET current game score. Explosed for the router layer.
    async getGameScore(username:string) : Promise<Gamestate| undefined> {
        // I was unsure if sending score exposes risks for data manipulation
        // in typescript like a java object, so I return a copy instead //Oscar
        const user : Account | undefined = await this.accountService.findAccount(username);
        if (user === undefined) {
            return undefined
        }
        if (Object.values(user.gamestate).every(value => Number.isNaN(value))) {
            throw new Error("Both fields in the state are NaN.");
        } else {
            return JSON.parse(JSON.stringify(user.gamestate));
        }
    }
}
