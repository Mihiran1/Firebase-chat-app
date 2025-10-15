import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth } from './firebase/config';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import Chat from './components/chat/Chat';

const App = () => {
  const [user, setUser] = useState(null);
  const [hasAccount, setHasAccount] = useState(true); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set Firebase session persistence to session only (clears on tab/browser close)
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setLoading(false);
        });
        return () => unsubscribe();
      })
      .catch((error) => {
        console.error("Error setting persistence:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen">
      {!user ? (
        <div className="min-h-screen bg-gray-50">
          {hasAccount ? (
            <Login setHasAccount={setHasAccount} />
          ) : (
            <SignUp setHasAccount={setHasAccount} />
          )}
        </div>
      ) : (
        <div className="h-full">
          <Chat user={user} />
        </div>
      )}
    </div>
  );
};

export default App;
