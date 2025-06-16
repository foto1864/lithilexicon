import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useUser } from '../user/UserContext';
import '../styles/EntryPage.css';
import '../styles/Layout.css';

export default function EntryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useUser();

  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [editPhrase, setEditPhrase] = useState('');
  const [editMeaning, setEditMeaning] = useState('');

  useEffect(() => {
    const fetchEntry = async () => {
      const docRef = doc(db, 'entries', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() };
        setEntry(data);
        setEditPhrase(data.phrase);
        setEditMeaning(data.meaning);
      }

      setLoading(false);
    };

    fetchEntry();
  }, [id]);

  const formatDate = (timestamp) => {
    if (!timestamp) return '—';
    const date = timestamp.toDate();
    return date.toLocaleDateString('el-GR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStartLetter = (text) =>
    text
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')[0];

  const handleSave = async () => {
    await updateDoc(doc(db, 'entries', entry.id), {
      phrase: editPhrase,
      meaning: editMeaning
    });
    setEntry(prev => ({
      ...prev,
      phrase: editPhrase,
      meaning: editMeaning
    }));
    setEditMode(false);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Είστε σίγουρος ότι θέλετε να διαγράψετε αυτή τη φράση; Η ενέργεια δεν μπορεί να αναιρεθεί.');
    if (confirmed) {
      await deleteDoc(doc(db, 'entries', entry.id));
      navigate(`/letter/${getStartLetter(entry.phrase)}`);
    }
  };

  return (
    <div className="section">
      <div className="section-content"> 
        {loading ? (
            <p>Φόρτωση...</p>
          ) : entry ? (
            <div>
              {editMode ? (
                <>
                  <input value={editPhrase} onChange={(e) => setEditPhrase(e.target.value)} />
                  <textarea value={editMeaning} onChange={(e) => setEditMeaning(e.target.value)} rows={4} cols={60} />
                  <br />
                  <button onClick={handleSave}>Αποθήκευση</button>
                  <button onClick={() => setEditMode(false)}>Ακύρωση</button>
                </>
              ) : (
                <>
                  <h2>{entry.phrase}</h2>
                  <p><strong>Σημασία:</strong> {entry.meaning}</p>
                  <p><strong>Ανέβηκε από:</strong> {entry.uploadedByUsername || entry.uploadedBy}</p>
                  <p><strong>Ημερομηνία:</strong> {formatDate(entry.timestamp)}</p>

                  {role === 'admin' && (
                    <>
                      <button onClick={() => setEditMode(true)}>Επεξεργασία</button>
                      <button onClick={handleDelete}>Διαγραφή</button>
                    </>
                  )}
                </>
              )}

              <hr />
              <Link to={`/letter/${getStartLetter(entry.phrase)}`}>
                <strong>Πίσω</strong>
              </Link>

              <h3>Σχόλια - Σίγουρα κάτι πρέπει να βάλουμε εδώ</h3>
              <p>(Η ενότητα σχολίων δεν είναι ακόμα ενεργή)</p>
              <textarea rows={4} cols={60} placeholder="Γράψε ένα σχόλιο..." disabled />
            </div>
          ) : (
            <p>Η φράση δεν βρέθηκε.</p>
          )
        }
      </div>
     </div>
  );
}
