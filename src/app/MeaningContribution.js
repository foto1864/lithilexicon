import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useUser } from '../user/UserContext';

export default function MeaningContribution({ entry }) {
  const { user, username } = useUser();
  const [open, setOpen] = useState(false);
  const [meaning, setMeaning] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  async function submit(event) {
    event.preventDefault();
    if (!meaning.trim() || !user || !username) return;
    setBusy(true); setError('');
    try {
      await addDoc(collection(db, 'meaningSuggestions'), {
        entryId: entry.id, phrase: entry.phrase, meaning: meaning.trim(),
        uploadedBy: user.email, uploadedByUsername: username, timestamp: Timestamp.now()
      });
      setSent(true);
    } catch (_) { setError('Η υποβολή απέτυχε. Δοκιμάστε ξανά.'); }
    finally { setBusy(false); }
  }
  if (sent) return <p role="status">Ευχαριστούμε! Η σημασία σας στάλθηκε για έγκριση.</p>;
  return <div className="meaning-contribution">
    <button onClick={() => setOpen(!open)} aria-expanded={open}>Πρόσθεσε σημασία</button>
    {open && (user ? <form onSubmit={submit}>
      <label htmlFor="suggested-meaning">Ποια είναι η σημασία της φράσης;</label>
      <textarea id="suggested-meaning" value={meaning} onChange={e => setMeaning(e.target.value)} required maxLength={5000} rows={4} />
      <p>Η πρότασή σας θα ελεγχθεί από διαχειριστή πριν δημοσιευτεί.</p>
      <button disabled={busy || !username || !meaning.trim()}>{busy ? 'Αποστολή…' : 'Υποβολή σημασίας'}</button>
      {error && <p role="alert">{error}</p>}
    </form> : <p><Link to="/login">Συνδέσου</Link> ή <Link to="/register">δημιούργησε λογαριασμό</Link> για να προσθέσεις σημασία.</p>)}
  </div>;
}
