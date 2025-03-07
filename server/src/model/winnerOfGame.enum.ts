/*
This merely acts as a boolean but with 3 different states to distuingish whenever a game is over, and who wins
Used to communicate between the backend and frontend
*/
export enum winnerOfGame{
     noWinner = "No winner",
     playerWins = "Player wins",
     opponentWins = "Opponent wins"
     
}