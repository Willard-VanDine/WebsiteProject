import { Account } from "../model/account.interface";

export class AccountService {
    users: Account[] =[];

    

    // Register a new account.
    async registerAccount(username: string, password: string) : Promise<void> {
        // Should register a new account with the provided username and resets the amount of wins and losses.
        // TODO: this needs to be updated later most likely, to add passwords as an input which then is passed to the database
        this.users.push({
            username: username,
            password: password,
            accountLosses:0,
            accountWins: 0,
            gamestate: {
                playerScore : 0,
                opponentScore : 0
            }
        });
    }
    

    async findAccount(username: string, password ?: string): Promise<Account | undefined> {
        if (! password) {
            const user = this.users.find((user) => user.username === username);
            return user;
        }
        const user = this.users.find((user) => user.username === username && user.password === password);
        return user;
    }
    

}
