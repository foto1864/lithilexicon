import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../utils/firebase';
import LetterNav from './LetterNav';

export default function LetterPage() {
  const { letter } = useParams();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      const q = query(
        collection(db, 'entries'),
        where('approved', '==', true),
        orderBy('phrase')
      );
      const snapshot = await getDocs(q);
      const results = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(entry =>
          normalize(entry.phrase).startsWith(normalize(letter))
        );

      setEntries(results);
      setLoading(false);
    };

    fetchEntries();
  }, [letter]);

  const normalize = (text) =>
    text
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // αφαιρεί τόνους
      .trim();

  return (
    <div>
      {/* <LetterNav /> */}
      <h2>Λέξεις/Φράσεις από «{letter}»:</h2>

      {loading ? (
        <p>Φόρτωση...</p>
      ) : entries.length === 0 ? (
        <p>Ακόμα δεν υπάρχουν καταχωρήσεις για αυτό το γράμμα.</p>
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
