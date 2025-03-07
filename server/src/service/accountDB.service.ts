import { Account } from "../model/account.interface";
import bcrypt from "bcrypt";
import { AccountModel, AccountStatsModel, GamestateModel } from '../../db/modelloader';
import { IAccountService } from "./account.service.interface";

export class AccountDBService implements IAccountService {


    //Initalize all tables if they are not currently present.
    constructor(){
        this.init();
    }
    private async init(): Promise<void>{
        await AccountModel.sync();
        await AccountStatsModel.sync();
        await GamestateModel.sync();
    }

    // Register a new account.
    async registerAccount(username: string, password: string): Promise<boolean> {
        // Creates a new Account with a username, hashedpassword. It also includes Accountlosses and Accountwins
        // Each Account also have their own gamestate to allow them to play games.
        
        const user: Account | undefined = await this.findAccount(username);
        if (user === undefined) {
            const salt = bcrypt.genSaltSync(10);
            
            await AccountModel.create({
                username: username,
                password: bcrypt.hashSync(password, salt),
            });
            
            await AccountStatsModel.create({
                username: username,
                accountLosses: 0,
                accountWins: 0
            });
            return true;
        }else{
            return false;
        }
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
        if ((user != null) && (stats != null) ) {
            const account: Account | undefined = {
                username: user?.dataValues.username,
                password: user.dataValues.password,
                accountWins: stats.dataValues.accountWins,
                accountLosses: stats.dataValues.accountLosses,
            };
  
            if (pass === undefined) {
            
                return account;
            } else {

                if (bcrypt.compareSync(pass, user.dataValues.password)) {
                    return account;
                } else {
                    return undefined;
                }
            }


            // const account = this.users.find((user) => user.username === username && bcrypt.compare(password, user.password));

        } else {
            return undefined;
        }
    }

    //This method takes a strng to identify a user, if the user does not exist return undefined
    //If the user does exist then check the value on number, if it is 1 then increase accountWins for that User
    //If number is -1 then increase AccountLosses for that User
    async updateAccount(username: string, number: number): Promise<void | undefined> {

        const stats: AccountStatsModel | null = await AccountStatsModel.findOne({
            attributes: ['username', 'accountWins', 'accountLosses'],
            where: {
                username: username
            }
        });
        if (stats === null) {
            return undefined;
        }

        if (number === 1) {
            await stats.update({
                accountWins: stats.accountWins + 1,
            });
        } else if (number === -1) {
            await stats.update({
                accountLosses: stats.accountLosses + 1,
            });
        }
    }


}
