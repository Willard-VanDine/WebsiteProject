import { Account } from "../model/account.interface";

export class AccountService {
    private acc : Account = {
        username : "", 
        accountWins : 0, 
        accountLosses : 0
    };

    // Register a new account.
    registerAccount(username: string): void {
        // Should register a new account with the provided username and resets the amount of wins and losses.
        // TODO: this needs to be updated later most likely, to add passwords as an input which then is passed to the database
        this.acc.username = username;
        this.acc.accountWins = 0;
        this.acc.accountLosses = 0;
    }


    // Update account wins and losses after a game
    // Can maybe take input 1 for win, -1 for loss
    // to follow structure from gamestate service class, 0 should not be neccesary as we only call the method when it is 1 or -1
    private updateAccountScore(result: number): void {
        if(result === 1)
            this.acc.accountWins++;
        else this.acc.accountLosses++;
    }

    // Get all account details (name, wins, losses) this is done by making a deep copy of the object.
    getAccount(): Account {
        return JSON.parse(JSON.stringify(this.acc));
    }

}
