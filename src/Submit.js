import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';

export default function Submit() {
  const [phrase, setPhrase] = useState('');
  const [meaning, setMeaning] = useState('');
  const [message, setMessage] = useState('');
  const { user, role } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage("You must be logged in to submit.");
      return;
    }

    try {
      await addDoc(collection(db, 'entries'), {
        phrase,
        meaning,
        uploadedBy: user.email,
        approved: role === 'admin',
        timestamp: Timestamp.now()
      });

      setMessage(role === 'admin' ? "Phrase submitted and auto-approved!" : "Phrase submitted for moderation.");
      setPhrase('');
      setMeaning('');
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div>
      <h2>Submit a Phrase</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Phrase" value={phrase} onChange={e => setPhrase(e.target.value)} required />
        <input type="text" placeholder="Meaning" value={meaning} onChange={e => setMeaning(e.target.value)} required />
        <button type="submit">Submit</button>
      </form>
      <p>{message}</p>
      <button onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
}
