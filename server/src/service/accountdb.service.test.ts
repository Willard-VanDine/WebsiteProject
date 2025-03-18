import { AccountDBService } from "./accountDB.service";
import { AccountModel, AccountStatsModel } from "../../db/modelloader";
import bcrypt from "bcrypt";

// Mock the models so that we don’t actually mess up the data in databse.
jest.mock("../../db/modelloader", () => ({
    // Jest.fn() used to make them mock functions which we can control return value sof
    AccountModel: {
        sync: jest.fn().mockResolvedValue(true), // Simulated table sync (creation)
        create: jest.fn(),
        findOne: jest.fn(),
    },

    AccountStatsModel: {
        sync: jest.fn().mockResolvedValue(true), // Simulated table sync (creation)
        create: jest.fn(),
        findOne: jest.fn(),
    },

    GamestateModel: {
        sync: jest.fn().mockResolvedValue(true), // Simulated table sync (creation)
    }
}));

// AccountDBService test suite:
describe("AccountDBService", () => {
    let accountService: AccountDBService;

    beforeEach(async () => {
        // Clear any previous calls to the mocks.
        jest.clearAllMocks();
        // Class constructor calls init which syncs, so this is a "resync"/reset of database.
        accountService = new AccountDBService();
    });

    describe("registerAccount", () => {
        test("should register a new account (happy path)", async () => {
            // Simulate that no account exists by returning null
            (AccountModel.findOne as jest.Mock).mockResolvedValue(null);
            (AccountStatsModel.findOne as jest.Mock).mockResolvedValue(null);

            // Simulate successful account and stats creation
            (AccountModel.create as jest.Mock).mockResolvedValue({});
            (AccountStatsModel.create as jest.Mock).mockResolvedValue({});

            const result = await accountService.registerAccount("Luffy", "Mugiwara");
            expect(result).toBe(true);
            expect(AccountModel.create).toHaveBeenCalled();
            expect(AccountStatsModel.create).toHaveBeenCalled();

        });

        test("should not register an account if user already exists (unhappy path)", async () => {
            // Simulate that the account already exists.
            (AccountModel.findOne as jest.Mock).mockResolvedValue({
                dataValues: { username: "Luffy", password: "hashed" }
            });

            (AccountStatsModel.findOne as jest.Mock).mockResolvedValue({
                dataValues: { username: "Luffy", accountWins: 0, accountLosses: 0 }
            });

            const result = await accountService.registerAccount("Luffy", "Mugiwara");
            expect(result).toBe(false); // i.e. account with name Luffy already exists

        });
    });

    describe("findAccount", () => {
        test("should find account without password check (happy path)", async () => {
            // Create a hash for password
            const hashed = bcrypt.hashSync("Mugiwara", 10);
            (AccountModel.findOne as jest.Mock).mockResolvedValue({
                dataValues: { username: "Luffy", password: hashed }
            });

            (AccountStatsModel.findOne as jest.Mock).mockResolvedValue({
                dataValues: { username: "Luffy", accountWins: 3, accountLosses: 2 }
            });

            // Call findAccount without a password.
            const account = await accountService.findAccount("Luffy");
            expect(account).toEqual({
                username: "Luffy",
                password: hashed,
                accountWins: 3,
                accountLosses: 2,
            });

        });

        test("should find account with correct password check (happy path 2 I guess)", async () => {
            // Create a hash for the correct password.
            const correctPassword = "Mugiwara";
            const hashed = bcrypt.hashSync(correctPassword, 10);
    
            (AccountModel.findOne as jest.Mock).mockResolvedValue({
                dataValues: { username: "Luffy", password: hashed }
            });
    
            (AccountStatsModel.findOne as jest.Mock).mockResolvedValue({
                dataValues: { username: "Luffy", accountWins: 1, accountLosses: 2 }
            });
    
            // Call findAccount with the correct password.
            const account = await accountService.findAccount("Luffy", correctPassword);
            expect(account).toEqual({
                username: "Luffy",
                password: hashed,
                accountWins: 1,
                accountLosses: 2,
            });
        });

        test("should return undefined for incorrect password (unhappy path)", async () => {
            // Create a hash for a known password.
            const hashed = bcrypt.hashSync("Mugiwara", 10);
            (AccountModel.findOne as jest.Mock).mockResolvedValue({
                dataValues: { username: "Luffy", password: hashed }
            });

            (AccountStatsModel.findOne as jest.Mock).mockResolvedValue({
                dataValues: { username: "Luffy", accountWins: 5, accountLosses: 3 }
            });

            // Call findAccount with an incorrect password.
            const account = await accountService.findAccount("Luffy", "wrongpassword");
            expect(account).toBeUndefined();

        });
    });

    describe("updateAccount", () => {
        test("should update account wins (happy path)", async () => {
            // Create a fake stats object with an update method.
            const statsMock = {
                accountWins: 3,
                accountLosses: 3,
                update: jest.fn().mockResolvedValue(true),
            };

            (AccountStatsModel.findOne as jest.Mock).mockResolvedValue(statsMock);
            await accountService.updateAccount("Luffy", 1);
            expect(statsMock.update).toHaveBeenCalledWith({ accountWins: 4 });

        });

        test("should update account losses (happy path 2 I guess)", async () => {
            const statsMock = {
                accountWins: 3,
                accountLosses: 3,
                update: jest.fn().mockResolvedValue(true),
            };

            (AccountStatsModel.findOne as jest.Mock).mockResolvedValue(statsMock);
            await accountService.updateAccount("Luffy", -1);
            expect(statsMock.update).toHaveBeenCalledWith({ accountLosses: 4 });

        });

        test("should return undefined when account stats not found (unhappy path)", async () => {
            // Simulate that no stats record exists.
            (AccountStatsModel.findOne as jest.Mock).mockResolvedValue(null);
            const result = await accountService.updateAccount("Luffy", 1);
            expect(result).toBeUndefined();

        });

    });

});
