import { Gamestate } from "../model/gamestate.interface";

export class GamestateService {
    private state : Gamestate = {
        "playerScore" : 0,
        "opponentScore" : 0
    }
}