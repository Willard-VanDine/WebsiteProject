import { AccountService } from "./account.service";

let accountService : AccountService;

beforeEach(() => {
    accountService = new AccountService();
  });


test("Users should be able to register an account", async () => {
   //Check if the account begins empty then register and check if it contains a username.
    expect(await accountService.getAccount()).toStrictEqual({username : "", accountWins : 0, accountLosses : 0});
    await accountService.registerAccount("Beatrice");
    expect(await accountService.getAccount()).toStrictEqual({username : "Beatrice", accountWins : 0, accountLosses : 0});
});

test("Users should not be able to register an empty account", async () => {
    //Check that it throws an exception if an empty string is sent in.
    expect(await accountService.registerAccount("")).toThrow();
    
});

test("Users amount of wins and losses should be able to increase", async () => {
    await accountService.registerAccount("Rosa");
    await accountService.updateAccountScore(1);
    expect(await accountService.getAccount()).toStrictEqual({username : "Rosa", accountWins : 1, accountLosses : 0});
    await accountService.updateAccountScore(-1);
    expect(await accountService.getAccount()).toStrictEqual({username : "Rosa", accountWins : 1, accountLosses : 1});
    
});

test("A user that does not exist, should not be able to increase their score", async () => {

    //The method should throw if we do not have a username.
    expect(await accountService.updateAccountScore(1)).toThrow();
    
});

