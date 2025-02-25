import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { getAccount } from "./api";
import {Account} from "../../server/src/model/account.interface";


export default function AccountPage() {
    const [account, setAccount] = useState<Account | null>(null);

    const handleClick = async() => {
        const fetchedAccount = await getAccount();
        if(fetchedAccount === undefined)
            return;
        // Check if the account contains all the required fields
        if (
          fetchedAccount.username &&
          fetchedAccount.password &&
          typeof fetchedAccount.accountWins === 'number' &&
          typeof fetchedAccount.accountLosses === 'number' 
        ) {
          setAccount(fetchedAccount);
        } else {
          console.error('Invalid account data');
          setAccount(null);
        }
      };

    return (
        <section className="heightFixer rounder centerObjects rounder">
          <div>
      <button onClick={handleClick}>Get Account</button>
      {account && (
        <div>
          <h2>Account Details</h2>
          <p>Username: {account.username}</p>
          <p>Password: {account.password}</p>
          <p>Wins: {account.accountWins}</p>
          <p>Losses: {account.accountLosses}</p>
        </div>
      )}
    </div>
        </section>
    )

}