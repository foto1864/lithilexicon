import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import LetterNav from './LetterNav';
import '../styles/EntryPage.css';

export default function EntryPage() {
  const { id } = useParams();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntry = async () => {
      const docRef = doc(db, 'entries', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setEntry({ id: docSnap.id, ...docSnap.data() });
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

  return (
    <div className='entry-container'>

      {loading ? (
        <p>Φόρτωση...</p>
      ) : entry ? (
        <div>
          <h2>{entry.phrase}</h2>
          <p><strong>Σημασία:</strong> {entry.meaning}</p>
          <p><strong>Ανέβηκε από:</strong> {entry.uploadedByUsername || entry.uploadedBy}</p>
          <p><strong>Ημερομηνία:</strong> {formatDate(entry.timestamp)}</p>

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
      )}
    </div>
  );
}
