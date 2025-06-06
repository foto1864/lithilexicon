import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom';

// Import from 'utils'
import { db } from '..//utils/firebase';

// Import from 'user'
import { useUser } from '..//user/UserContext';

// Import from 'styles'
import '..//styles/Submit.css'

export default function SubmitPreview() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, role, username } = useUser();

  const [similarEntries, setSimilarEntries] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const phrase = state?.phrase?.trim() || '';
  const meaning = state?.meaning?.trim() || '';

  // Τον αράπη κι αν τον πλένεις το σαπούνι σου χαλάς: Δεν έχει νόημα να προσπαθείς για κάτι ανώφελο

  const IGNORED_WORDS = [
    'και', 'το', 'τη', 'της', 'του', 'τον', 'την', 'σε', 'από', 'με', 'για', 'να', 'που', 'ως', 'πως', 'πιο', 'οι', 'τα',
    'είναι', 'ή', 'ένα', 'ενα', 'ο', 'η', 'αν', 'σου', 'μου', 'κι', 'τι', 'δεν', 'έχω', 'κάνω', 'στην', 'στους', 'στα',
    'μέσα', 'προς', 'ναι', 'οχι', 'κατι', 'πολύ'
    // συμπλήρωσε και άλλες ελεύθερα
  ];

  const tokenize = (text) => {
    return text
      .toLowerCase()
      .replace(/[.,;:"'«»!?()\-]/g, '')
      .split(/\s+/)
      .filter(word => word && !IGNORED_WORDS.includes(word));
  };

  const getOverlapCount = (a, b) => {
    const setA = new Set(a);
    const setB = new Set(b);
    return [...setA].filter(x => setB.has(x)).length;
  };

  useEffect(() => {
    const fetchSimilarEntries = async () => {
      const snapshot = await getDocs(collection(db, 'entries'));
      const inputTokens = tokenize(phrase);
      const candidates = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        const dbTokens = tokenize(data.phrase);
        const overlap = getOverlapCount(inputTokens, dbTokens);

        if (overlap >= 1) {
          candidates.push({
            phrase: data.phrase,
            meaning: data.meaning
          });
        }
      });

      setSimilarEntries(candidates);
    };

    if (phrase) fetchSimilarEntries();
  }, [phrase]);

  const handleFinalSubmit = async () => {
    if (!user || !username) return;
    setSubmitting(true);

    try {
      await addDoc(collection(db, 'entries'), {
        phrase,
        meaning,
        uploadedBy: user.email,
        uploadedByUsername: username,
        approved: role === 'admin',
        timestamp: Timestamp.now()
      });
      navigate('/');
    } catch (err) {
      console.error("Υποβολή απέτυχε:", err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="submit-preview">
      <h2>Επιβεβαίωση Υποβολής</h2>

      {similarEntries.length > 0 && (
        <div className="warning">
          <p>⚠️ Βρέθηκαν παρόμοιες φράσεις στο λεξικό:</p>
          <ul>
            {similarEntries.map((entry, index) => (
              <li key={index}>
                <strong>{entry.phrase}</strong>: {entry.meaning}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="preview">
        <h3>Φράση:</h3>
        <p>{phrase}</p>
        <h3>Σημασία:</h3>
        <p>{meaning}</p>
      </div>

      <div className="actions">
        <button onClick={() => navigate('/submit', { state: { phrase, meaning } })}>🔙 Επιστροφή για Επεξεργασία</button>
        <button onClick={() => navigate('/')}>❌ Ακύρωση</button>
        <button onClick={handleFinalSubmit} disabled={submitting}>
          ✅ Οριστική Υποβολή
        </button>
      </div>
    </div>
  );
}
