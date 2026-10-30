import React, { useContext, useEffect, useState, createContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../utils/firebase';

const UserContext = createContext();
export function useUser() { return useContext(UserContext); }

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    let unsubscribeProfile;
    const unsubscribeAuth = onAuthStateChanged(auth, firebaseUser => {
      unsubscribeProfile?.();
      setUser(firebaseUser);
      setRole(null);
      setUsername(null);
      setProfileError('');
      if (!firebaseUser) {
        setLoading(false);
        return;
      }
      setLoading(true);
      // Observe profile creation too: registration writes this after Auth signs in.
      unsubscribeProfile = onSnapshot(doc(db, 'users', firebaseUser.uid), snapshot => {
        const data = snapshot.data();
        setRole(data?.role || 'subscriber');
        setUsername(data?.username || null);
        setLoading(false);
      }, () => {
        setProfileError('Έχετε συνδεθεί, αλλά δεν ήταν δυνατή η φόρτωση του προφίλ σας. Δοκιμάστε ξανά αργότερα.');
        setLoading(false);
      });
    }, () => {
      setProfileError('Δεν ήταν δυνατός ο έλεγχος σύνδεσης. Ανανεώστε τη σελίδα.');
      setLoading(false);
    });
    return () => { unsubscribeAuth(); unsubscribeProfile?.(); };
  }, []);

  return <UserContext.Provider value={{ user, role, username, loading, profileError }}>{children}</UserContext.Provider>;
}
