import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getApprovedEntries, normalizePhrase, entryErrorMessage } from '../utils/entries';
import '..//styles/Layout.css';

export default function LetterPage() {
  const { letter } = useParams();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    getApprovedEntries().then(all => {
      if (active) setEntries(all.filter(entry => normalizePhrase(entry.phrase).startsWith(normalizePhrase(letter))));
    }).catch(err => {
      if (active) setError(entryErrorMessage(err));
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [letter, attempt]);

  return (
    <div className="section">
      <div className="section-content">
        <h2>Λέξεις/Φράσεις από «{letter}»:</h2>

        {error ? (<div role="alert"><p>{error}</p><button onClick={() => setAttempt(value => value + 1)}>Δοκιμή ξανά</button></div>) : loading ? (
          <p>Φόρτωση...</p>
        ) : entries.length === 0 ? (
          <p>Ακόμα δεν υπάρχουν καταχωρήσεις για αυτό το γράμμα.</p>
        ) : (
          <ul>
            {entries.map(entry => (
              <li key={entry.id}>
                <Link to={`/entry/${entry.id}`}>
                  <strong>{entry.phrase}</strong>
                </Link>: {entry.meaning} — uploaded by {entry.uploadedByUsername || entry.uploadedBy}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
