import React, { useEffect, useState, useRef } from 'react';
import {
  collection, query, getDocs, updateDoc, deleteDoc, doc, orderBy, runTransaction
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../utils/firebase';
import { useUser } from '../user/UserContext';
import '../styles/Layout.css'; 

export default function AdminDashboard() {
  const { role, loading } = useUser();
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState(null);
  const [editPhrase, setEditPhrase] = useState('');
  const [editMeaning, setEditMeaning] = useState('');

  const [pendingEntries, setPendingEntries] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionError, setSuggestionError] = useState('');
  const [busySuggestion, setBusySuggestion] = useState(null);
  const [ , setApprovedEntries ] = useState([]);

  const entryRefs = useRef({}); // κρατάει DOM refs για κάθε entry

  useEffect(() => {
    if (role === 'admin') {
      const fetchAll = async () => {
        const q = query(collection(db, 'entries'), orderBy('phrase'));
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPendingEntries(results.filter(e => !e.approved));
        setApprovedEntries(results.filter(e => e.approved));
      };
      fetchAll();
      getDocs(collection(db, 'meaningSuggestions')).then(snapshot => setSuggestions(snapshot.docs.map(d => ({ ...d.data(), id: d.id })))).catch(() => setSuggestionError('Δεν φορτώθηκαν οι προτάσεις σημασίας.'));
    }
  }, [role]);

  const handleApprove = async (id) => {
    await updateDoc(doc(db, 'entries', id), { approved: true });
    setPendingEntries(prev => prev.filter(e => e.id !== id));
    setApprovedEntries(prev => [...prev, pendingEntries.find(e => e.id === id)]);
  };

  const moderateSuggestion = async (suggestion, approve) => {
    setBusySuggestion(suggestion.id); setSuggestionError('');
    try {
      const suggestionRef = doc(db, 'meaningSuggestions', suggestion.id);
      if (approve) {
        await runTransaction(db, async transaction => {
          const entryRef = doc(db, 'entries', suggestion.entryId);
          const current = await transaction.get(entryRef);
          const pending = await transaction.get(suggestionRef);
          if (!pending.exists()) throw new Error('Η πρόταση έχει ήδη εξεταστεί.');
          if (!current.exists()) throw new Error('Η φράση δεν υπάρχει πλέον.');
          if (current.data().meaning?.trim()) throw new Error('Η φράση έχει ήδη σημασία. Ελέγξτε την πριν από άλλη αλλαγή.');
          transaction.update(entryRef, { meaning: pending.data().meaning });
          transaction.delete(suggestionRef);
        });
      } else await deleteDoc(suggestionRef);
      setSuggestions(previous => previous.filter(item => item.id !== suggestion.id));
    } catch (error) { setSuggestionError(error.message || 'Η ενέργεια απέτυχε.'); }
    finally { setBusySuggestion(null); }
  };

  const handleReject = async (id) => {
    await deleteDoc(doc(db, 'entries', id));
    setPendingEntries(prev => prev.filter(e => e.id !== id));
    setApprovedEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setEditPhrase(entry.phrase);
    setEditMeaning(entry.meaning);
  };

  const handleSave = async (id) => {
    await updateDoc(doc(db, 'entries', id), {
      phrase: editPhrase,
      meaning: editMeaning
    });
    setPendingEntries(prev =>
      prev.map(e => e.id === id ? { ...e, phrase: editPhrase, meaning: editMeaning } : e)
    );
    setApprovedEntries(prev =>
      prev.map(e => e.id === id ? { ...e, phrase: editPhrase, meaning: editMeaning } : e)
    );
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  if (loading) return <p>Loading...</p>;
  if (role !== 'admin') return <p>Access denied.</p>;

  return (
    <div className="section">
      <div className="section-content">
        <h2>Προτάσεις σημασίας</h2>
        {suggestionError && <p role="alert">{suggestionError}</p>}
        {suggestions.length === 0 ? <p>Δεν υπάρχουν προτάσεις σημασίας προς έγκριση.</p> : <ul>
          {suggestions.map(suggestion => <li key={suggestion.id}>
            <strong>{suggestion.phrase}</strong>: {suggestion.meaning} — {suggestion.uploadedByUsername}
            <button disabled={busySuggestion !== null} onClick={() => moderateSuggestion(suggestion, true)}>Έγκριση σημασίας</button>
            <button disabled={busySuggestion !== null} onClick={() => moderateSuggestion(suggestion, false)}>Απόρριψη</button>
          </li>)}
        </ul>}
        <h2>Φράσεις προς έγκριση</h2>
        {pendingEntries.length === 0 ? (
          <p>Δεν υπάρχουν εκκρεμείς φράσεις προς έγκριση</p>
        ) : (
          <ul>
            {pendingEntries.map(entry => (
              <li key={entry.id} ref={el => entryRefs.current[entry.id] = el}>
                {editingId === entry.id ? (
                  <div>
                    <input value={editPhrase} onChange={e => setEditPhrase(e.target.value)} />
                    <input value={editMeaning} onChange={e => setEditMeaning(e.target.value)} />
                    <button onClick={() => handleSave(entry.id)}>Αποθήκευση</button>
                    <button onClick={handleCancel}>Ακύρωση</button>
                  </div>
                ) : (
                  <div>
                    <strong>{entry.phrase}</strong>: {entry.meaning} — by {entry.uploadedBy}
                    <button onClick={() => handleApprove(entry.id)}>Έγκριση</button>
                    <button onClick={() => handleReject(entry.id)}>Απόρριψη</button>
                    <button onClick={() => handleEdit(entry)}>Επεξεργασία</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
        <hr />
        <button onClick={() => navigate('/')}>Πίσω στην Αρχική</button>
      </div>
    </div>
  );
}
