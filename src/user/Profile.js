import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext';
import { db, auth } from './firebase';
import {
  collection, query, where, getDocs, deleteDoc, doc, addDoc, Timestamp
} from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, role, loading, username } = useUser();
  const [entries, setEntries] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserEntries = async () => {
      if (!user) return;
      const q = query(collection(db, 'entries'), where('uploadedBy', '==', user.email));
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEntries(results);
    };
    fetchUserEntries();
  }, [user]);

  const handleDeleteAccount = async () => {
    try {
      await addDoc(collection(db, 'deletedAccounts'), {
        uid: user.uid,
        email: user.email,
        reason,
        deletedAt: Timestamp.now()
      });

      await deleteDoc(doc(db, 'users', user.uid));
      await deleteUser(auth.currentUser);

      setMessage('Account deleted.');
      navigate('/');
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>You are not logged in.</p>;

  return (
    <div>
      <h2>My Profile</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {role}</p>
      <p><strong>Username:</strong> {username}</p>


      <hr />
      <h3>My Uploaded Phrases</h3>
      {entries.length === 0 ? (
        <p>You haven’t uploaded any phrases yet.</p>
      ) : (
        <ul>
          {entries.map(entry => (
            <li key={entry.id}>
              <strong>{entry.phrase}</strong>: {entry.meaning} ({entry.approved ? 'Approved' : 'Pending'})
            </li>
          ))}
        </ul>
      )}

      <hr />
      <h3>Delete My Account</h3>
      {!showConfirm ? (
        <button onClick={() => setShowConfirm(true)}>Delete My Account</button>
      ) : (
        <div>
          <p>This will permanently delete your account and phrases. Are you sure?</p>
          <textarea
            placeholder="(Optional) Reason for leaving..."
            value={reason}
            onChange={e => setReason(e.target.value)}
          />
          <br />
          <button onClick={handleDeleteAccount}>Yes, Delete</button>
          <button onClick={() => setShowConfirm(false)}>Cancel</button>
        </div>
      )}
      <p>{message}</p>
    </div>
  );
}
