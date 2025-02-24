// useAuth.ts (Custom Hook)
import { useState, useEffect } from 'react';
import { checkSession } from './api'; // Assuming checkSession is the function to check session

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifySession = async () => {
      const sessionStatus = await checkSession();
      if (sessionStatus) {
        setIsLoggedIn(sessionStatus.loggedIn);
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false); // Set loading to false once the check is complete
    };

    verifySession();
  }, []);

  return { isLoggedIn, loading };
}
