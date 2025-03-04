import { Account } from "../model/account.interface";
import bcrypt from "bcrypt";

export interface IAccountService {
    

    

    // Register a new account using a username string and a username password, does not return a value
    // Fails if the username is already taken
    registerAccount(username: string, password: string) : Promise<boolean> 
        
       
    
    //Finds an account, by using a username string and a password string and returns an account.
    //Fails if such an account does not exist.
    findAccount(username: string, password ?: string): Promise<Account | undefined> 
    //Update values in an account. By taking in a string and a number, does not return a value  
    //Username is used to find an account, number is used to determine what field should be updated. 
    //Fails if such an account does not exist.
    updateAccount(username: string, number:number): Promise<void|undefined>
        
    

}
