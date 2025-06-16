import React, { useEffect, useState } from 'react';
import {
  collection, query, where, getDocs, deleteDoc, doc, addDoc, Timestamp
} from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

// Import from 'user'
import { useUser } from '..//user/UserContext';

// Import from 'utils'
import { db, auth } from '..//utils/firebase';

// Import styles
import '../styles/Layout.css';

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
    <div className="section">
      <div className="section-content">
        <h2>Το προφίλ μου</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Ρόλος:</strong> {role}</p>
        <p><strong>Όνομα χρήστη:</strong> {username}</p>


        <hr />
        <h3>Φράσεις που έχω ανεβάσει</h3>
        {entries.length === 0 ? (
          <div><p>Δεν έχετε ανεβάσει καμία φράση ακόμα.</p>
          <p><button onClick={ () => navigate('/submit')}>Ανεβάστε τώρα μια!</button></p></div>
        ) : (
          <ul>
            {entries.map(entry => (
              <li key={entry.id}>
                <strong>{entry.phrase}</strong>: {entry.meaning} ({entry.approved ? 'Εγκρίθηκε' : 'Υπό εξέταση'})
              </li>
            ))}
          </ul>
        )}

        <hr />
        {!showConfirm ? (
          <button onClick={() => setShowConfirm(true)}>Διαγραφή λογαριασμού</button>
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
    </div>
  );
}
