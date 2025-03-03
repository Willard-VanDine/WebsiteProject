import { Account } from "../model/account.interface";
import bcrypt from "bcrypt";
import { AccountModel } from "../../db/accountmodel.db";
import { AccountStatsModel } from "../../db/accountStatsModel.db";
import { GamestateModel } from "../../db/gamestateModel.db";
import { IAccountService } from "./account.service.interface";

export class AccountDBService implements IAccountService {



    // Register a new account.
    async registerAccount(username: string, password: string): Promise<void> {
        // Creates a new Account with a username, hashedpassword. It also includes Accountlosses and Accountwins
        // Each Account also have their own gamestate to allow them to play games.
        const salt = bcrypt.genSaltSync(10);
        await AccountModel.sync();
        AccountModel.create({
            username: username,
            password: bcrypt.hashSync(password, salt),
        });
        await AccountStatsModel.sync();
        AccountStatsModel.create({
            username: username,
            accountLosses: 0,
            accountWins: 0
        });
        await GamestateModel.sync();
        GamestateModel.create({
            username: username,
            playerScore: 0,
            opponentScore: 0

        });

    }

    //Takes a username and returns the Account that has that username, you can also send in a password
    //If you do send in a password it will compare the password to encrypted version
    async findAccount(username: string, pass?: string): Promise<Account | undefined> {

        //TODO: Check if it is possible to combine this in one step.
        const user: AccountModel | null = await AccountModel.findOne({
            attributes: ['username', 'password'],
            where: {
                username: username
            }
        });



        const stats: AccountStatsModel | null = await AccountStatsModel.findOne({
            attributes: ['username', 'accountWins', 'accountLosses'],
            where: {
                username: username
            }
        });
        const game: GamestateModel | null = await GamestateModel.findOne({
            attributes: ['username', 'playerScore', 'opponentScore'],
            where: {
                username: username
            }
        });
        if ((user != null) && (stats != null) && (game != null)) {
            const account: Account | undefined = {
                username: user?.dataValues.username,
                password: user.dataValues.password,
                accountWins: stats.dataValues.accountWins,
                accountLosses: stats.dataValues.accountLosses,
                gamestate: {
                    playerScore: game.dataValues.playerScore,
                    opponentScore: game.dataValues.opponentScore
                }
            }
            if (account === undefined) {
                return undefined;
            }
            if (pass === undefined) {
                return account;
            } else {
                if (bcrypt.compareSync(pass, account.password)){
                    return account;
                }else{
                    return undefined;
                }
            }


            // const account = this.users.find((user) => user.username === username && bcrypt.compare(password, user.password));

        }
    }
    async updateAccount(username: string, number: number): Promise < void| undefined > {
        
        const stats: AccountStatsModel | null = await AccountStatsModel.findOne({
            attributes: ['username', 'accountWins', 'accountLosses'],
            where: {
                username: username
            }
        });
        if(stats === null){
            return undefined;
        }

        if (number === 1) {
            stats.update({
                accountWins: stats.accountWins+1,
            });
        } else if (number === -1) {
            stats.update({
                accountLosses: stats.accountLosses+1,
            });
        }
    }


}
