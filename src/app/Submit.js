import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '..//user/UserContext';

// Import from 'styles'
import '..//styles/Submit.css';

export default function Submit() {
  const [phrase, setPhrase] = useState('');
  const [meaning, setMeaning] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useUser();
  const navigate = useNavigate();

  const location = useLocation();
    useEffect(() => {
      if (location.state) {
        setPhrase(location.state.phrase || '');
        setMeaning(location.state.meaning || '');
      }
  }, [location.state]);


  const handlePreviewRedirect = (e) => {
    e.preventDefault();

    if (!user) {
      setMessage("Πρέπει να είστε συνδεδεμένος για να κάνετε υποβολή.");
      return;
    }

    navigate('/submit-preview', {
      state: {
        phrase,
        meaning
      }
    });
  };

  return (
    <div className="section">
      <div className="section-content submit-div">
        <h2>Υποβολή Φράσης</h2>
        <p>
          Όταν υποβάλετε τη λέξη ή φράση σας, τότε αυτή θα μπει σε σειρά προτεραιότητας για να ελεγχθεί από έναν διαχειριστή.
          Εάν η φράση σας εγκριθεί θα γίνει και αυτή μέρος του λεξικού μας!
          Θερμή παράκληση να μην υποβάλετε φράσεις σε γλώσσες άλλες εκτός της ελληνικής, καθώς και να προσέχετε ότι τονίζετε όλες τις λέξεις.
        </p>
        <form className='submit-form' onSubmit={handlePreviewRedirect}>
          <div>
            <input type="text" placeholder="Φράση" value={phrase} onChange={e => setPhrase(e.target.value)} required />
            <input type="text" placeholder="Σημασία" value={meaning} onChange={e => setMeaning(e.target.value)} required />
          </div>
          <button className='preview-button' type="submit">Προεπισκόπηση</button>
        </form>
        <p>{message}</p>
      </div>
    </div>

  );
}
