import { Account } from "../model/account.interface";
import bcrypt from "bcrypt";
import { IAccountService } from "./account.service.interface";

export class AccountService implements IAccountService{
    users: Account[] =[];

    

    // Register a new account.
    async registerAccount(username: string, password: string) : Promise<void> {
        // Creates a new Account with a username, hashedpassword. It also includes Accountlosses and Accountwins
        // Each Account also have their own gamestate to allow them to play games.
        const salt = bcrypt.genSaltSync(10);
        this.users.push({
            username: username,
            password: bcrypt.hashSync(password, salt),
            accountLosses:0,
            accountWins: 0,
            gamestate: {
                playerScore : 0,
                opponentScore : 0
            }
        });
    }
    
    //Takes a username and returns the Account that has that username, you can also send in a password
    //If you do send in a password it will compare the password to encrypted version
    async findAccount(username: string, password ?: string): Promise<Account | undefined> {
        if (! password) {
            const user = this.users.find((user) => user.username === username);
            return user;
        }
        const account = this.users.find((user) => user.username === username && bcrypt.compare(password, user.password));
        return account;
    }
    async updateAccount(username: string, number:number): Promise<void|undefined>{
        const user = this.users.find((user) => user.username === username);
        if(user === undefined){
            return;
        }
        if(number === 1){
            user.accountWins = user.accountWins +1;
        }else if(number === -1){
            user.accountLosses = user.accountLosses +1;
        }
    }
    

}
