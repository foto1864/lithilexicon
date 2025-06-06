import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

// Import from 'utils'
import { auth } from '..//utils/firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage('Login successful! Redirecting ...');

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h2>Σύνδεση</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required /> <br />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
          required
        /> <br />
        <label>
          <input type="checkbox" onChange={() => setShowPassword(prev => !prev)} /> Εμφάνιση Κωδικού
        </label>
        <br /><br />

        <p><a href="/forgot-password">Ξεχάσατε τον κωδικό σας;</a></p>

        <button type="submit">Σύνδεση</button>
      </form>

      <p>Δεν έχετε λογαριασμό; <br></br>
        {<Link to="/register">Εγγραφείτε τώρα!</Link>}
      </p>

      <p>{message}</p>
    </div>
  );
}
