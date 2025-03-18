// useAuth.ts (Custom Hook)
import { useState, useEffect } from 'react';
import { checkSession } from './api'; 


//This is a webhook that renders whenever the page reloads, this makes it so that the website updated dynamically
//To update the sidebar navigation if a user is logged in.
export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const verifySession = async () => {
      const sessionStatus = await checkSession();
      if (sessionStatus?.loggedIn) {
        setIsLoggedIn(sessionStatus.loggedIn);
      } else {
        setIsLoggedIn(false);
      }
    };

    verifySession();
});

  return { isLoggedIn, setIsLoggedIn };
}
