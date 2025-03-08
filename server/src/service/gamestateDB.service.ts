import { Gamestate } from "../model/gamestate.interface";
import { Choice } from "../model/choices.enum";
import { Account } from "../model/account.interface";
import { IAccountService } from "./account.service.interface";
import { IGamestateService } from "./gamestate.service.interface";
import { AccountModel, GamestateModel } from '../../db/modelloader';
import { winnerOfGame } from "../model/winnerOfGame.enum";

export class GamestateDBService implements IGamestateService<Choice> {
    private accountService: IAccountService;


    // Represent an ongoing game, start "fresh" with no choices made yet.
    private currentGame: { playerChoice: Choice | null, opponentChoice: Choice | null } = {
        playerChoice: null,
        opponentChoice: null
    };
    constructor(accountService: IAccountService) {
        this.accountService = accountService;
    }
    async subscribeToGame(username: string): Promise<boolean | undefined> {
        const user: Account | undefined = await this.accountService.findAccount(username);
        console.log("sanity check");
        console.log(user);
        if (user === null) {
            return undefined; //user does not exist.
        }
        const userGamestate: GamestateModel | null = await GamestateModel.findOne({
            attributes: ['username'],
            where: {
                username: username
            }
        });
        console.log(userGamestate);
        //if a user is not subcribe to this game, subscribe them with the following parameters.
        if (userGamestate === null) {
            await GamestateModel.create({
                username: username,
                playerScore: 0,
                opponentScore: 0,
                gameName: "Rock paper scissors",
                gameThreshold: 4,
                winnerOfGame: winnerOfGame.noWinner
            });
            return true;
        } else {
            return false; //User is already subscribed to this game.
        }

    }
    // Starts a new game -> reset the state
    // Exposed for the router layer so player can request to start a new game 
    async startGame(username: string): Promise<void | undefined> {
        const userGamestate: GamestateModel | null = await GamestateModel.findOne({
            attributes: ['username', 'playerScore', 'opponentScore'],
            where: {
                username: username
            }
        });
        if (userGamestate === null) {
            return undefined
        }
        this.currentGame = {
            playerChoice: null,
            opponentChoice: null
        };

        await userGamestate.update({
            playerScore: 0,
            opponentScore: 0
        });
    }

    // Make a move for the player and for the "PC opponent" (POST-request I believe, as above)
    // Exposed for the router layer, so player can play lé Sten Sax Påse :)
    // Returns the gamestate representing the state of the game after the move is made.
    async makeMove(username: string, playerInput: Choice): Promise<Gamestate | undefined> {
        // Checks in the database if there is a user with that username, and they they are subscribed to this game
        const userGamestate: GamestateModel | null = await GamestateModel.findOne({
            attributes: ['username', 'playerScore', 'opponentScore', 'gameName', 'gameThreshold', 'winnerOfGame'],
            where: {
                username: username,
                gameName: "Rock paper scissors"
            }
        });
        if (userGamestate === null) {
            return undefined;
        }

        // Proceed with the move and determine winner
        this.currentGame.playerChoice = playerInput;
        this.currentGame.opponentChoice = this.getOpponentChoice();
        const result = await this.determineWinner(userGamestate);

        const gamestate: Gamestate = {
            playerScore: result.playerScore,
            opponentScore: result.opponentScore,
            gameName: result.gameName,
            gameThreshold: result.gameThreshold,
            winnerOfGame: result.winnerOfGame
        };

        return gamestate;
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
    // Returns the new gamestate representing the game after winner is determined.
    private async determineWinner(userGamestate: GamestateModel): Promise<Gamestate> {
        const { playerChoice, opponentChoice } = this.currentGame;
        const gamestate: Gamestate = {
            playerScore: userGamestate.dataValues.playerScore,
            opponentScore: userGamestate.dataValues.opponentScore,
            gameName: userGamestate.dataValues.gameName,
            gameThreshold: userGamestate.dataValues.gameThreshold,
            winnerOfGame: winnerOfGame.noWinner, // Default to noWinner initially
        };

        // Case when it's a draw
        if (playerChoice === opponentChoice) {
            return gamestate;  // No winner in this round
        }

        /*
        The cases in which the player scores, update the database playerscore and return an updated gamestate
        This happens whenever playerScore is < gameThreshold. Also set winner to none, since no one has won the game
        in this state. If playerScore is >= gameThreshold it updates playerScore and opponentScore to be 0 and sets a winner.
        This happens to both the local gamestate variable, and also to the database.
        */
        if (
            (playerChoice === Choice.Rock && opponentChoice === Choice.Scissors) ||
            (playerChoice === Choice.Paper && opponentChoice === Choice.Rock) ||
            (playerChoice === Choice.Scissors && opponentChoice === Choice.Paper)
        ) {
            if (userGamestate.dataValues.playerScore < userGamestate.dataValues.gameThreshold) {
                // Player scores a point, but game is not over yet
                await userGamestate.update({
                    playerScore: userGamestate.playerScore + 1,
                    winnerOfGame: winnerOfGame.noWinner, // We don't have a winner at this state of the game.
                });
                gamestate.playerScore++;
            } else {
                // Player wins the game (threshold reached)
                await userGamestate.update({
                    playerScore: 0,
                    opponentScore: 0,
                    winnerOfGame: winnerOfGame.playerWins, // Declare player as winner
                });
                gamestate.playerScore = 0;
                gamestate.opponentScore = 0;
                gamestate.winnerOfGame = winnerOfGame.playerWins; // Set the winner for this round
                await this.accountService.updateAccount(userGamestate.dataValues.username, 1);
            }
            return gamestate; // Player won this round
        }

        // Check if the opponent wins the round
        if (
            (opponentChoice === Choice.Rock && playerChoice === Choice.Scissors) ||
            (opponentChoice === Choice.Paper && playerChoice === Choice.Rock) ||
            (opponentChoice === Choice.Scissors && playerChoice === Choice.Paper)
        ) {
            if (userGamestate.dataValues.opponentScore < userGamestate.dataValues.gameThreshold) {
                // Opponent scores a point, but game is not over yet
                await userGamestate.update({
                    opponentScore: userGamestate.opponentScore + 1,
                    winnerOfGame: winnerOfGame.noWinner, // We don't have a winner at this state of the game.
                });
                gamestate.opponentScore++;
            } else {
                // Opponent wins the game (threshold reached)
                await userGamestate.update({
                    playerScore: 0,
                    opponentScore: 0,
                    winnerOfGame: winnerOfGame.opponentWins, // Declare opponent as winner
                });
                gamestate.playerScore = 0;
                gamestate.opponentScore = 0;
                gamestate.winnerOfGame = winnerOfGame.opponentWins; // Set the winner for this round
                await this.accountService.updateAccount(userGamestate.dataValues.username, -1);
            }
            return gamestate; // Opponent won this round
        }

        return gamestate; // PC wins
    }


    // GET current game score. Exposed for the router layer.
    async getGameScore(username: string): Promise<Gamestate | undefined> {
        //Checks if valid User then returns the Users gamestate.
        const userGamestate: GamestateModel | null = await GamestateModel.findOne({
            attributes: ['username', 'playerScore', 'opponentScore', 'gameName', 'gameThreshold', 'winnerOfGame'],
            where: {
                username: username
            }
        });
        if (userGamestate === null) {
            return undefined;
        }
        const gamestate: Gamestate = {
            playerScore: userGamestate.dataValues.playerScore,
            opponentScore: userGamestate.dataValues.opponentScore,
            gameName: userGamestate.dataValues.gameName,
            gameThreshold: userGamestate.dataValues.gameThreshold,
            winnerOfGame: userGamestate.dataValues.winnerOfGame
        };

        if (Object.values(gamestate).every(value => Number.isNaN(value))) {
            throw new Error("Both fields in the state are NaN.");
        } else {
            return JSON.parse(JSON.stringify(gamestate));
        }
    }
}
