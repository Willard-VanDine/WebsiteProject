import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Make sure to import useNavigate correctly
import { getAccount } from "./api";
import { UserContent } from "../../server/src/model/usercontent.interface";
import { Card } from "react-bootstrap"; 

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

  return (
    isLoggedIn ===true ? (
      <section className="heightFixer rounder centerObjects">
        <div>
          {account && (
          <Card className="card-container p-4 text-center">
          <Card.Body>
            <h2 className="mb-3">Account Details</h2>
            <p><strong>Username:</strong> {account!.username}</p>

            <div className="d-flex justify-content-between mt-3">
              <p className="text-success"><strong>Wins:</strong> {account!.accountWins}</p>
              <p className="text-danger"><strong>Losses:</strong> {account!.accountLosses}</p>
            </div>

            {/* Progress Bar */}
            <div className="progress">
              <div 
                className="progress-bar bg-success" 
                style={{ width: `${
                  (account!.accountWins + account!.accountLosses) ?
                  Math.round((account!.accountWins / (account!.accountWins + account!.accountLosses)) * 100) :
                  0
                  }%` }}>
              </div>
            </div>

            <p className="mt-2"><strong>Win Rate:</strong> {
                  (account!.accountWins + account!.accountLosses) ?
                  Math.round((account!.accountWins / (account!.accountWins + account!.accountLosses)) * 100) :
                  0
                  }%</p>
          </Card.Body>
        </Card>
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
