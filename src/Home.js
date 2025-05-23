import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import { db } from './firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';

export default function Home() {
  const { user, role, loading } = useUser();
  const [entries, setEntries] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchApproved = async () => {
      const q = query(
        collection(db, 'entries'),
        where('approved', '==', true),
        orderBy('phrase')
      );
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEntries(results);
    };

    fetchApproved();
  }, []);

  return (
    <div>
      <h1>Ληθιλεξικόν - Home</h1>

      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          {!user && <li><Link to="/register">Register</Link></li>}
          {!user && <li><Link to="/login">Login</Link></li>}
          {user && <li><Link to="/submit">Submit Phrase</Link></li>}
          {user && role === 'admin' && <li><Link to="/admin">Admin Dashboard</Link></li>}
          {user && role === 'subscriber' && <li><Link to="/profile">My Profile</Link></li>}
          {user && <li><button onClick={() => {signOut(auth).then(() => navigate('/')); }}>Logout</button></li>}
        </ul>
      </nav>

      {loading ? (
        <p>Loading user...</p>
      ) : user ? (
        <p>Welcome <strong>{user.email}</strong> — Role: <strong>{role}</strong></p>
      ) : (
        <p>You are not logged in.</p>
      )}

      <hr />

      <h2>Approved Entries</h2>
      {entries.length === 0 ? (
        <p>No approved phrases yet.</p>
      ) : (
        <ul>
          {entries.map(entry => (
            <li key={entry.id}>
              <strong>{entry.phrase}</strong>: {entry.meaning} — uploaded by {entry.uploadedByUsername || entry.uploadedBy}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
