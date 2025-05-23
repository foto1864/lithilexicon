import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username,
        email: user.email,
        role: "subscriber"
      });

      setMessage('Account created successfully! Redirecting ...');
      setTimeout(() => navigate('/'), 1500);

    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} required /><br></br>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required /><br></br>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
          required
        /><br></br>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Confirm Password"
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
        <br></br>
        <label>
          <input type="checkbox" onChange={() => setShowPassword(prev => !prev)} />
          Show Password
        </label>
        <br></br>
        <br />
        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
