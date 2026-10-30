import React, { useEffect, useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom';

// Import from 'utils'
import { db } from '..//utils/firebase';
import { getApprovedEntries } from '../utils/entries';

// Import from 'user'
import { useUser } from '..//user/UserContext';

// Import from 'styles'
import '..//styles/Submit.css'

  const IGNORED_WORDS = [
    'και', 'το', 'τη', 'της', 'του', 'τον', 'την', 'σε', 'από', 'με', 'για', 'να', 'που', 'ως', 'πως', 'πιο', 'οι', 'τα',
    'είναι', 'ή', 'ένα', 'ενα', 'ο', 'η', 'αν', 'σου', 'μου', 'κι', 'τι', 'δεν', 'έχω', 'κάνω', 'στην', 'στους', 'στα',
    'μέσα', 'προς', 'ναι', 'οχι', 'κατι', 'πολύ'
    // συμπλήρωσε και άλλες ελεύθερα
  ];

  const tokenize = (text) => {
    return text
      .toLowerCase()
      .replace(/[.,;:"'«»!?()]/g, '')
      .split(/\s+/)
      .filter(word => word && !IGNORED_WORDS.includes(word));
  };

  const getOverlapCount = (a, b) => {
    const setA = new Set(a);
    const setB = new Set(b);
    return [...setA].filter(x => setB.has(x)).length;
  };

export default function SubmitPreview() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, role, username } = useUser();

  const [similarEntries, setSimilarEntries] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const phrase = state?.phrase?.trim() || '';
  const meaning = state?.meaning?.trim() || '';

  // Τον αράπη κι αν τον πλένεις το σαπούνι σου χαλάς: Δεν έχει νόημα να προσπαθείς για κάτι ανώφελο

  useEffect(() => {
    const fetchSimilarEntries = async () => {
      const entries = await getApprovedEntries();
      const inputTokens = tokenize(phrase);
      const candidates = [];

      entries.forEach(data => {
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

    if (phrase) fetchSimilarEntries().catch(() => setError('Δεν ήταν δυνατός ο έλεγχος για παρόμοιες φράσεις. Δοκιμάστε ξανά αργότερα.'));
  }, [phrase]);

  const handleFinalSubmit = async () => {
    if (!user || !username) { setError('Συνδεθείτε και περιμένετε να φορτωθεί το προφίλ σας πριν την υποβολή.'); return; }
    setError('');
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
      setError('Η υποβολή απέτυχε. Ελέγξτε τη σύνδεσή σας και δοκιμάστε ξανά.');
      setSubmitting(false);
    }
  };

  return (
    <div className='section'>
      <div className="section-content submit-preview">
        <h2>Επιβεβαίωση Υποβολής</h2>
        {error && <p role="alert">{error}</p>}

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
    </div>
  );
}
