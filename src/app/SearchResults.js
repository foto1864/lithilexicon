import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../utils/firebase';
import LetterNav from './LetterNav';

export default function SearchResults() {
  const [params] = useSearchParams();
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);

  const searchQuery = params.get('query')?.toLowerCase().trim() || '';

  useEffect(() => {
    const fetchAndFilter = async () => {
      const q = query(
        collection(db, 'entries'),
        where('approved', '==', true),
        orderBy('phrase')
      );
      const snapshot = await getDocs(q);
      const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const filtered = all.filter(entry =>
        entry.phrase.toLowerCase().includes(searchQuery)
      );

      const grouped = {};
      filtered.forEach(entry => {
        const letter = normalize(entry.phrase.charAt(0));
        if (!grouped[letter]) grouped[letter] = [];
        grouped[letter].push(entry);
      });

      setResults(grouped);
      setLoading(false);
    };

    fetchAndFilter();
  }, [searchQuery]);

  const normalize = (ch) =>
    ch
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove tonos
      .charAt(0);

  return (
    <div>
      <LetterNav />
      <h2>Αποτελέσματα για: «{searchQuery}»</h2>

      {loading ? (
        <p>Φόρτωση...</p>
      ) : Object.keys(results).length === 0 ? (
        <p>Δεν βρέθηκαν αποτελέσματα.</p>
      ) : (
        Object.keys(results).sort().map(letter => (
          <div key={letter}>
            <h3>{letter}</h3>
            <ul>
              {results[letter].map(entry => (
                <li key={entry.id}>
                  <strong>{entry.phrase}</strong>: {entry.meaning} — uploaded by {entry.uploadedByUsername || entry.uploadedBy}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
