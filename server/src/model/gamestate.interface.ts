// Intended to be for playing "best of five" and such
//TODO: Maybe add a gameIsDone boolean field here. and perhaps gameScoreThreshold.
export interface Gamestate {
    playerScore : number;
    opponentScore : number;
}