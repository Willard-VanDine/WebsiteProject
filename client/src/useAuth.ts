// useAuth.ts (Custom Hook)
import { useState, useEffect } from 'react';
import { checkSession } from './api'; // Assuming checkSession is the function to check session

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const verifySession = async () => {
      const sessionStatus = await checkSession();
      if (sessionStatus) {
        setIsLoggedIn(sessionStatus.loggedIn);
      } else {
        setIsLoggedIn(false);
      }
    };

    verifySession();
});

  return { isLoggedIn, setIsLoggedIn };
}
