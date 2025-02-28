import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Make sure to import useNavigate correctly
import { getAccount } from "./api";
import { UserContent } from "../../server/src/model/usercontent.interface";

interface AccountPageProps {
  isLoggedIn: boolean | null;
}

const AccountPage = ({ isLoggedIn }: AccountPageProps) => {
  const [account, setAccount] = useState<UserContent | null>(null);
  const navigate = useNavigate();

  // Redirect immediately if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");  // Redirect to login if not logged in
    }else{
      getAccountData();
    }
  }, [isLoggedIn, navigate]);

  const getAccountData = async () => {
    const fetchedAccount = await getAccount();
    if (fetchedAccount === undefined) return;

    // Check if the account contains all the required fields, then set the local account to fetched account
    if (
      fetchedAccount.username &&
      typeof fetchedAccount.accountWins === 'number' &&
      typeof fetchedAccount.accountLosses === 'number'
    ) {
      setAccount(fetchedAccount);
    } else {
      console.error('Invalid account data');
      setAccount(null);
    }
  };
  // Component will not load if user is logged in.
  return (
    isLoggedIn ===true ? (
      <section className="heightFixer rounder centerObjects">
        <div>
          {account && (
            <div>
              <h2>Account Details</h2>
              <p>Username: {account.username}</p>

              <p>Wins: {account.accountWins}</p>
              <p>Losses: {account.accountLosses}</p>
            </div>
          )}
        </div>
      </section>
    ) : (
      <div>
        <p>Redirecting to login...</p>
      </div>
    )
  );
};

export default AccountPage;
