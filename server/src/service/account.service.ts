import { Account } from "../model/account.interface";

export class AccountService {
    private acc : Account = {
        username : "", 
        accountWins : 0, 
        accountLosses : 0
    };

    // Register a new account.
    registerAccount(username: string): void {
        // Should register a new account with the provided username.
        // I guess we have to wait with implementing this, or make a
        // local state implementation regarding where the account is stored.
        // Gotta discuss how to deal with login/passwords too.
    }

    // Get current account score (wins and losses). Might not need, and just need getAccount?
    getAccountScore(): { accountWins: number, accountLosses: number } {
        // TODO:
    }

    // Update account wins and losses after a game
    // Can maybe take input 1 for win, -1 for loss
    // to follow structure from gamestate service class...
    updateAccountScore(result: number): void {
        // TODO:
    }

    // Get all account details (name, wins, losses)
    getAccount(): Account {
        // TODO:
    }

}
