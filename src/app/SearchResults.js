import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getApprovedEntries, normalizePhrase, entryErrorMessage } from '../utils/entries';

export default function SearchResults() {
  const [params] = useSearchParams();
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);

  const searchQuery = params.get('query')?.toLowerCase().trim() || '';

  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    getApprovedEntries().then(all => {
      const grouped = {};
      all.filter(entry => normalizePhrase(entry.phrase).includes(normalizePhrase(searchQuery)))
        .forEach(entry => {
          const letter = normalizePhrase(entry.phrase).charAt(0);
          if (!grouped[letter]) grouped[letter] = [];
          grouped[letter].push(entry);
        });
      if (active) setResults(grouped);
    }).catch(err => {
      if (active) setError(entryErrorMessage(err));
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [searchQuery, attempt]);

  return (
    <div className="section">
      <div className="section-content"> 
        <h2>Αποτελέσματα για: «{searchQuery}»</h2>

        {error ? (<div role="alert"><p>{error}</p><button onClick={() => setAttempt(value => value + 1)}>Δοκιμή ξανά</button></div>) : loading ? (
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
                    <Link to={`/entry/${entry.id}`}><strong>{entry.phrase}</strong></Link>{entry.meaning?.trim() ? `: ${entry.meaning}` : <> · <Link className="add-meaning-link" to={`/entry/${entry.id}`}>Πρόσθεσε σημασία</Link></>} — {entry.uploadedByUsername || entry.uploadedBy}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
