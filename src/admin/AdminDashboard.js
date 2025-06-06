import React, { useEffect, useState } from 'react';
import {
  collection, query, getDocs, updateDoc, deleteDoc, doc, orderBy
} from 'firebase/firestore';
import { db } from './firebase';
import { useUser } from './UserContext';

import { useNavigate } from 'react-router-dom';

// at the top of your component:

export default function AdminDashboard() {
  const { role, loading } = useUser();
  const [entries, setEntries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editPhrase, setEditPhrase] = useState('');
  const [editMeaning, setEditMeaning] = useState('');
    const navigate = useNavigate();


  useEffect(() => {
    if (role === 'admin') {
      const fetchAll = async () => {
        const q = query(collection(db, 'entries'), orderBy('phrase'));
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEntries(results);
      };
      fetchAll();
    }
  }, [role]);

  const handleApprove = async (id) => {
    await updateDoc(doc(db, 'entries', id), { approved: true });
    setEntries(prev => prev.map(e => e.id === id ? { ...e, approved: true } : e));
  };

  const handleReject = async (id) => {
    await deleteDoc(doc(db, 'entries', id));
    setEntries(prev => prev.filter(entry => entry.id !== id));
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
    setEntries(prev =>
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
    <div>
      <h2>Admin Dashboard</h2>
      {entries.length === 0 ? (
        <p>No entries found.</p>
      ) : (
        <ul>
          {entries.map(entry => (
            <li key={entry.id}>
              {editingId === entry.id ? (
                <div>
                  <input value={editPhrase} onChange={e => setEditPhrase(e.target.value)} />
                  <input value={editMeaning} onChange={e => setEditMeaning(e.target.value)} />
                  <button onClick={() => handleSave(entry.id)}>Save</button>
                  <button onClick={handleCancel}>Cancel</button>
                </div>
              ) : (
                <div>
                  <strong>{entry.phrase}</strong>: {entry.meaning} — by {entry.uploadedBy}
                  {!entry.approved && (
                    <>
                      <button onClick={() => handleApprove(entry.id)}>Approve</button>
                      <button onClick={() => handleReject(entry.id)}>Reject</button>
                    </>
                  )}
                  <button onClick={() => handleEdit(entry)}>Edit</button>
                  <button onClick={() => handleReject(entry.id)}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      
        <button onClick={() => navigate('/')}>Back to Home</button>

    </div>
  );
}
