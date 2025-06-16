import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

// Imports
import { auth } from '../utils/firebase';
import { useUser } from '../user/UserContext';
import '..//styles/Home.css';

export default function Home() {
  const { user, role, loading , username } = useUser();
  const navigate = useNavigate();

  // Εδώ βάζεις τις χειροκίνητες "επιλεγμένες" φράσεις
  const featured = [
    {
      phrase: 'Άρον άρον',
      meaning: 'Με μεγάλη βιασύνη',
      uploadedBy: 'foto'
    },
    {
      phrase: 'Μπανάλ',
      meaning: 'Πολυχρησιμοποιημένο',
      uploadedBy: 'maestros'
    },
    {
      phrase: 'Στου κουφού την πόρτα όσο θέλεις βρόντα',
      meaning: 'Δεν έχει νόημα να προσπαθείς για κάτι ανώφελο',
      uploadedBy: 'foto'
    },
    {
      phrase: 'Φιρί φιρί',
      meaning: 'Επίμονα και προκλητικά',
      uploadedBy: 'Madame Coco'
    }
  ];

  return (
    <div>
      <div className="section" style={{ backgroundColor: '' }}>
        <div className="section-content">
          <h1 className='site-title'>Ληθιλεξικόν - Αρχική</h1>

          {loading ? (
            <p>Loading user...</p>
          ) : user ? (
            <p>Καλωσήρθες, <strong>{username}</strong> — Ρόλος: <strong>{role}</strong></p>
          ) : (
            <p>Δεν έχετε συνδεθεί.</p>
          )}

          <nav>
            <ul style={{listStyle: 'none', padding: 0}}> 
              {user && <li><button onClick={() => { signOut(auth).then(() => navigate('/')); }}>Αποσύνδεση</button></li>}
              {!user && <li><button onClick={ () => navigate('/login')}>Σύνδεση</button></li>}
            </ul>
          </nav>
          <hr />
        </div>
      </div>

      <div className="section">
        <div className="section-content">
          <p><strong>Καλωσήρθατε στο Ληθιλεξικόν!</strong></p>
          <p>Σκοπός του Ληθιλεξικού είναι να φέρει ξανά στο φως ξεχασμένες ελληνικές λέξεις και φράσεις.
            Για τους νεότερους, αποτελεί μια ευκαιρία να γνωρίσουν εκφράσεις που δεν έχουν ξανακούσει, 
            προσφέροντας μια γεύση από την παλαιότερη μορφή της γλώσσας μας.
          </p>
          <p>Μπορείτε να περιηγηθείτε στο περιεχόμενο του λεξικού επιλέγοντας το αρχικό γράμμα κάθε λέξης,
            ενώ σας ενθαρρύνουμε να συμβάλετε προσθέτοντας τις δικές σας φράσεις και λέξεις, βοηθώντας έτσι 
            να εμπλουτίσουμε μαζί αυτή τη μοναδική συλλογή.
          </p>
          <p>
            <button onClick={ () => navigate('/submit')}>Υποβάλετε μια φράση!</button>
          </p>
          <hr />
        </div>
      </div>

      <div className="section">
        <div className="section-content">
          <h2>Επιλεγμένες Φράσεις</h2>
          <ul>
            {featured.map((entry, index) => (
              <li key={index}>
                <strong>{entry.phrase}</strong>: {entry.meaning} — uploaded by {entry.uploadedBy}
              </li>
            ))}
          </ul>
        </div>
        </div>
  
    </div>
  );
}

