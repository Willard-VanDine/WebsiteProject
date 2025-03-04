import axios from "axios";
import { Result } from "../../server/src/model/result.interface";
import { Choice } from "../../server/src/model/choices.enum";
import { Gamestate } from "../../server/src/model/gamestate.interface";
import { LoggedIn } from "../../server/src/model/loggedin.interface";
import { UserContent } from "../../server/src/model/usercontent.interface";

axios.defaults.withCredentials = true;
const BASE_URL = "http://localhost:8080";

export async function makeMove(playerChoice: Choice): Promise<Result | undefined> {
    try {
        const response = await axios.post<Result>(`${BASE_URL}/gameboard`, { playerChoice: playerChoice });
        if (response.status === 201)
            return response.data;
        else if (response.status === 400 || response.status === 401)
            return undefined;
        else
            throw new Error(`Unexpected status code: ${response.status}`);
    }
    catch (e: any) {
        console.log(e);
        return undefined;
    }
}
//TODO: Might have to add 401, not sure.
export async function getGameScore(): Promise<Gamestate | undefined> {
    try {
        const response = await axios.get<Gamestate>(`${BASE_URL}/gameboard`);
        if (response.status === 200)
            return response.data;
        else throw new Error(`Unexpected status code: ${response.status}`);
    }
    catch (e: any) {
        return undefined;
    }
}

export async function startGame(): Promise<void | undefined> {
    try {
        const response = await axios.post<void>(`${BASE_URL}/gameboard/startgame`);
        if (response.status === 201)
            return;
        else
            throw new Error(`Unexpected status code: ${response.status}`);
    }
    catch (e: any) {
        return undefined;
    }
}
//Creates a post account with the respective input of a username and password and creates an account
//Creates an account succesfully if status is 201
export async function registerUser(username: string, password: string): Promise<boolean | undefined> {
    try {
        const response = await axios.post(`${BASE_URL}/account`, { username: username, password: password });
        if (response.status === 201) {
            return true;
        }
        if (response.status === 401) {
            return false;
        }
        else throw new Error(`Unexpected status code: ${response.status}`);
    } catch (e: any) {
        console.log(e);
        return undefined;
    }
}

//Makes a post request to the router, sends in username and password.
//Sends back a JSON object whenver status code 200 and 401 are received. Throws otherwise
export async function login(username: string, password: string): Promise<LoggedIn | undefined> {
    try {
        const response = await axios.post(`${BASE_URL}/account/login`, { username: username, password: password });
        if (response.status === 200)
            return { loggedIn: true };
        else if (response.status === 401)
            return { loggedIn: false };
        else
            throw new Error(`Unexpected status code: ${response.status}`);

    } catch (e: any) {
        console.log(e);
        return undefined;
    }
}

//Checks wheter or not a user is logged in. Sends a get request 
//Throws an error if anything other than 200 and 401 is recevied
export async function checkSession(): Promise<LoggedIn | undefined> {
    try {
        const response = await axios.get<LoggedIn>(`${BASE_URL}/account/check-session`);
        if (response.status === 200 || response.status === 401) {
            //returns true if 200, and false if 401 but in JSON format
            return response.data;
        }
        else {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
    } catch (e: any) {
        console.log(e);
        return undefined;

    }
}
//Sends a get request to logout, if 204 is returned then user is succesfully logged out
//Throws error at other statuscodes.
//TODO: consider removing 401 and 500 on this one.
export async function logOut(): Promise<void> {
    try {
        const response = await axios.get<void>(`${BASE_URL}/account/logOut`);
        if (response.status === 204)
            return;
        else throw new Error(`Unexpected status code: ${response.status}`);

    } catch (e: any) {
        console.log(e);

    }
}


//Make a get request, if you get status code 200, then you can get data of UserContent in return
//If status === 401 then undefined is returned, and otherwise it throws an error.
export async function getAccount(): Promise<UserContent | undefined> {
    try {
        const response = await axios.get<UserContent>(`${BASE_URL}/account/getAccount`);
        if (response.status === 200) {
            return response.data;
        } else if (response.status === 401) {
            return undefined;
        } else {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
    }
    catch (e: any) {
        console.error("Error fetching account:", e);
        return undefined;
    }
}
export async function accountScore(number: number): Promise<void> {
    try {
        const response = await axios.post(`${BASE_URL}/account/accountscore`, { number: number });
        if (response.status === 200)
            return;

    } catch (e: any) {
        console.log(e);
    }
}