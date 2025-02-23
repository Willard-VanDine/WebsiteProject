import axios from "axios";
import { Result } from "../../server/src/model/result.interface";
import { Choice } from "../../server/src/model/choices.enum";
import { Gamestate } from "../../server/src/model/gamestate.interface";

axios.defaults.withCredentials = true;
const BASE_URL = "http://localhost:8080";

export async function makeMove(playerChoice : Choice) : Promise<Result | undefined> {
    try{
        const response = await axios.post<Result>(`${BASE_URL}/gameboard` , {playerChoice : playerChoice});
        return response.data;
    }
    catch(e : any){
        console.log(e);
        return undefined;
    }
}

export async function getGameScore() : Promise<Gamestate | undefined> {
    try{
        const response = await axios.get<Gamestate>(`${BASE_URL}/gameboard`);
        return response.data;
    }
    catch(e : any){
        return undefined;
    }
}

export async function startGame() : Promise<void | undefined> {
    try{
        await axios.post<void>(`${BASE_URL}/gameboard/startgame`);
        return;
    }
    catch(e : any){
        return undefined;
    }
}

export async function registerUser(username: string, password: string) : Promise<void> {
    try {
      await axios.post(`${BASE_URL}/account`, {username : username, password: password});
      return;
    } catch (e:any) {
      console.log(e);
    }
  }
  
  export async function login(username: string, password: string) : Promise<void> {
    try {
        await axios.post(`${BASE_URL}/account/login`, {username: username, password: password});
        return;
    }   catch(e:any){
            console.log(e);
    }
  }