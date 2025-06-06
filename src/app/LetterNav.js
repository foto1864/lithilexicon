import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Layout.css';

const GREEK_ALPHABET = [
  'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ',
  'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π',
  'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'
];

export default function LetterNav() {
  return (
    <div className="letter-nav">
      {GREEK_ALPHABET.map(letter => (
        <Link key={letter} to={`/letter/${letter}`}>
          {letter}
        </Link>
      ))}
    </div>
  );
}
