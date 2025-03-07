// Intended to be for playing "best of five" and such

import { winnerOfGame } from "./winnerOfGame.enum";

/*
Makes it possible to play a game, increasing the player's score and opponent's score, while also being able
to determine who actually wins the game. It also includes a gamename string to differentiate between different
types of games, such as rock paper scissors and chess etc.
It also has a gamethreshold that determines how many "rounds" will be played may vary for different games.
*/
export interface Gamestate {
    playerScore : number;
    opponentScore : number;
    gameName: string,
    gameThreshold: number,
    winnerOfGame: winnerOfGame;
}