import axios from "axios";
import { Result } from "../../server/src/model/result.interface";
import { Choice } from "../../server/src/model/choices.enum";
import { Gamestate } from "../../server/src/model/gamestate.interface";
import { LoggedIn } from "../../server/src/model/loggedin.interface";
import { UserContent } from "../../server/src/model/usercontent.interface";

axios.defaults.withCredentials = true;
const BASE_URL = "http://localhost:8080";

/*
Takes a Choice and makes an Axios post request on the location BASE_URL/gameboard in the router layer, sending in the playerChoice
If it receives a 201 response it will return a result, however, if it response has status 400, or 401 it returns undefined
Result is a JSON objekt that merely contains a number.
If it returns any other status code it will throw an error, this is mostly for error code 500.
If it throws an error, it will log the error in the browser terminal and return undefined
*/
export async function makeMove(playerChoice: Choice): Promise<Gamestate | undefined> {
    try {
        const response = await axios.post<Gamestate>(`${BASE_URL}/gameboard`, { playerChoice: playerChoice });
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
/*
Makes a axios get request unto BASE_URL/gameboard, if it receives a 200 request then it will return a Gamsestate
A Gamestate is a JSON Objekt that holds playerScore, opponentScore, both being numbers.
If the method instead recieves a 401 request, then it will return undefined
if it does not recognize the status code then it will throw an execption.
*/
export async function getGameScore(): Promise<Gamestate | undefined> {
    try {
        const response = await axios.get<Gamestate>(`${BASE_URL}/gameboard`);
        if (response.status === 200)
            return response.data;
        if(response.status === 401)
            return undefined;
        else throw new Error(`Unexpected status code: ${response.status}`);
    }
    catch (e: any) {
        console.log(e)
        return undefined;
    }
}
//TODO: rework this one! should probably return a gamestate, and the method should actually make the user
// actually play the game
export async function subscribeToGame(): Promise<boolean | undefined> {
    try {
        const response = await axios.get<boolean|undefined>(`${BASE_URL}/gameboard/subscribeToGame`);
        if (response.status === 201){
            return true;
        }
        if(response.status === 200){
            return false;
        }
        else
            throw new Error(`Unexpected status code: ${response.status}`);
    }
    catch (e: any) {
        console.log(e);
        return undefined;
    }
}
/*
Creates a post request to the accountrouter with the respective input of a username and password
Creates an account succesfully if status is 201 and returns true if that is the case.
If it returns a 401 it means creation failed, and then the method returns false.
Otherwise it does not recognize the statuscode which means it will throw and exception.
*/
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
/*
Makes a post request to the router, sends in username and password.
Sends back a JSON object whenver status code 200 and 401 are received. Throws otherwise
*/
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
/*
Checks wheter or not a user is logged in. Sends a get request 
Throws an error if anything other than 200 and 401 is recevied
Loggedin is a JSON object that holds a boolean
*/
export async function checkSession(): Promise<LoggedIn | undefined> {
    try {
        const response = await axios.get<LoggedIn>(`${BASE_URL}/account/check-session`);
        if (response.status === 200 || response.status === 401) {
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
/*
Sends a get request to logout, if 204 is returned then user is succesfully logged out
Throws error at other statuscodes.
TODO: consider removing 401 and 500 on this one. perhaps should return boolean as well to signify succesful login
*/
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

/*
Make a get request, if you get status code 200, then you can get data of UserContent in return
If status === 401 then undefined is returned, and otherwise it throws an error.
UserContent is a JSON object that includes a username string, accountWins number and accountLosses number
*/
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
//TODO: perhaps remove this one!
export async function accountScore(number: number): Promise<void> {
    try {
        const response = await axios.post(`${BASE_URL}/account/accountscore`, { number: number });
        if (response.status === 200)
            return;

    } catch (e: any) {
        console.log(e);
    }
}