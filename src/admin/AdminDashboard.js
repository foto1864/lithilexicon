import React, { useEffect, useState, useRef } from 'react';
import {
  collection, query, getDocs, updateDoc, deleteDoc, doc, orderBy
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../utils/firebase';
import { useUser } from '../user/UserContext';
import SearchBar from '../app/SearchBar';
import '../styles/AdminDashboard.css'; // βάλε CSS εδώ για το highlight

export default function AdminDashboard() {
  const { role, loading } = useUser();
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState(null);
  const [editPhrase, setEditPhrase] = useState('');
  const [editMeaning, setEditMeaning] = useState('');

  const [pendingEntries, setPendingEntries] = useState([]);
  const [approvedEntries, setApprovedEntries] = useState([]);
  const [showApproved, setShowApproved] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
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
    }
  }, [role]);

  useEffect(() => {
    if (!searchQuery) return;

    const all = [...pendingEntries, ...approvedEntries];
    const found = all.find(e =>
      e.phrase.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (found && entryRefs.current[found.id]) {
      const el = entryRefs.current[found.id];
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Remove highlight from all
      Object.values(entryRefs.current).forEach(ref => {
        if (ref) ref.classList.remove('highlight');
      });

      // Add highlight only to found
      el.classList.add('highlight');
    }
  }, [searchQuery, pendingEntries, approvedEntries]);


  const handleApprove = async (id) => {
    await updateDoc(doc(db, 'entries', id), { approved: true });
    setPendingEntries(prev => prev.filter(e => e.id !== id));
    setApprovedEntries(prev => [...prev, pendingEntries.find(e => e.id === id)]);
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
    <div className='admin-div'>
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

     <button onClick={() => setShowApproved(prev => !prev)}>
        {showApproved ? 'Κρύψε τα εγκεκριμένα' : 'Δες όλα τα εγκεκριμένα'}
      </button>

      {showApproved && (
        <>
          <SearchBar onSearch={setSearchQuery} />
          <h2>Εγκεκριμένες Φράσεις</h2>
          <ul>
            {approvedEntries.map(entry => (
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
                    <button onClick={() => handleEdit(entry)}>Επεξεργασία</button>
                    <button onClick={() => handleReject(entry.id)}>Διαγραφή</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      <button onClick={() => navigate('/')}>Πίσω στην Αρχική</button>
    </div>
  );
}
