import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';

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
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required /> <br />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
          required
        /> <br />
        <label>
          <input type="checkbox" onChange={() => setShowPassword(prev => !prev)} /> Show Password
        </label>
        <br /><br />

        <p><a href="/forgot-password">Forgot Password?</a></p>

        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
