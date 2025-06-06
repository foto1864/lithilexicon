import React, { useContext, useEffect, useState, createContext } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setRole(data.role || 'subscriber');
          setUsername(data.username || null);
        } else {
          setRole('subscriber');
          setUsername(null);
        }
      } else {
        setRole(null);
        setUsername(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider value={{ user, role, username, loading }}>
      {children}
    </UserContext.Provider>
  );
}
