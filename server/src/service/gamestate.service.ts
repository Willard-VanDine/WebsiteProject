import { Gamestate } from "../model/gamestate.interface";
import { Choice } from "../model/choices.enum";

export class GamestateService {
    private state: Gamestate = {
        playerScore: NaN,
        opponentScore: NaN
    };

    // Represent an ongoing game, start "fresh" with no choices made yet.
    private currentGame: { playerChoice: Choice | null, opponentChoice: Choice | null } = {
        playerChoice: null,
        opponentChoice: null
    };

    // Starts a new game -> reset the state (POST-request I believe, we request modification of data)
    // Exposed for the router layer so player can request to start a new game
    // should maybe return GameState, as we could use a get request for tomorrow, 
    async startGame() : Promise<void> {
        this.currentGame = {
            playerChoice: null,
            opponentChoice: null
        };

        this.state.playerScore = 0;
        this.state.opponentScore = 0;
    }
    
    // Make a move for the player and for the "PC opponent" (POST-request I believe, as above)
    // Exposed for the router layer, so player can play lé Sten Sax Påse :)
    async makeMove(playerChoice: Choice) : Promise<number> {
        this.currentGame.playerChoice = playerChoice;
        this.currentGame.opponentChoice = this.getOpponentChoice();

        return this.determineWinner();
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
    private determineWinner(): number {
        const { playerChoice, opponentChoice } = this.currentGame;

        if (playerChoice === opponentChoice) {
            return 0; // Draw
        }

        // The cases in which the player scores
        if ((playerChoice === Choice.Rock && opponentChoice === Choice.Scissors) ||
            (playerChoice === Choice.Paper && opponentChoice === Choice.Rock) ||
            (playerChoice === Choice.Scissors && opponentChoice === Choice.Paper)) {
            this.state.playerScore++;
            return 1;
        }

        // If it's not draw & player didn't score -> opponent scored
        this.state.opponentScore++;
        return -1; // PC wins
    }

    // GET current game score. Explosed for the router layer.
    async getGameScore() : Promise<Gamestate> {
        // I was unsure if sending score exposes risks for data manipulation
        // in typescript like a java object, so I return a copy instead //Oscar
    
        if (Object.values(this.state).every(value => Number.isNaN(value))) {
            throw new Error("Both fields in the state are NaN.");
        } else {
            return JSON.parse(JSON.stringify(this.state));
        }
    }
}
