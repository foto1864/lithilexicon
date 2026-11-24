import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useUser } from '../user/UserContext';
import '../styles/About.css';

const CONTACT_EMAIL = 'info@lithilexicon.gr';

// Για να μπει φωτογραφία: βάλτε το αρχείο στο public/team/ και συμπληρώστε το photo, π.χ. '/team/kokona.jpg'.
const team = [
  { name: 'Κυριακή Κοκονά', role: 'Μέλος της ομάδας', photo: '' },
  { name: 'Φίλιππος Καραμανλής', role: 'Μέλος της ομάδας', photo: '' },
  { name: 'Γιάννης Φωτεινάκης', role: 'Μέλος της ομάδας', photo: '' },
  { name: 'Ελένη Παπανικολάου', role: 'Μέλος της ομάδας', photo: '' }
];

const faqs = [
  {
    q: 'Ποιες λέξεις μπορώ να υποβάλω;',
    a: 'Οποιαδήποτε λέξη, φράση, παροιμία, ιδιωματισμό ή τοπική έκφραση που δεν χρησιμοποιείται συχνά σήμερα και αξίζει να μη χαθεί.'
  },
  {
    q: 'Πρέπει να ξέρω τη σημασία της φράσης;',
    a: 'Όχι. Μπορείτε να ανεβάσετε μια φράση είτε με τη σημασία της είτε χωρίς. Αν τη θυμάστε αλλά δεν ξέρετε τι σημαίνει ακριβώς, ανεβάστε την. Κάποιο άλλο μέλος μπορεί να προτείνει τη σημασία αργότερα.'
  },
  {
    q: 'Γιατί δεν εμφανίζεται αμέσως η φράση μου;',
    a: 'Κάθε υποβολή ελέγχεται από έναν διαχειριστή πριν δημοσιευτεί. Μόλις εγκριθεί, γίνεται μέρος του λεξικού και τη βλέπουν όλοι.'
  },
  {
    q: 'Κοστίζει κάτι η συμμετοχή;',
    a: 'Όχι, η συμμετοχή είναι εντελώς δωρεάν. Χρειάζεται μόνο ένας λογαριασμός για να υποβάλετε φράσεις.'
  },
  {
    q: 'Μπορώ να υποβάλω φράσεις σε άλλη γλώσσα ή διάλεκτο;',
    a: 'Το λεξικό είναι αφιερωμένο στην ελληνική γλώσσα. Τοπικές ελληνικές εκφράσεις και ιδιωματισμοί είναι πάντα ευπρόσδεκτοι. Σημειώστε στη σημασία από ποια περιοχή προέρχονται.'
  }
];

const sections = [
  ['ergo', 'Το Έργο'],
  ['istoria', 'Ιστορία & Όραμα'],
  ['symmetoxi', 'Πώς Συμμετέχω'],
  ['eggrafi', 'Εγγραφή'],
  ['stirixi', 'Στήριξε'],
  ['omada', 'Η Ομάδα'],
  ['faq', 'Συχνές Ερωτήσεις'],
  ['epikoinonia', 'Επικοινωνία']
];

const initials = name => name.split(' ').map(part => part[0]).join('');

function ContactForm() {
  const { user } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await addDoc(collection(db, 'contactMessages'), {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        timestamp: serverTimestamp()
      });
      setName(''); setMessage('');
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>Όνομα<input type="text" value={name} onChange={e => setName(e.target.value)} maxLength={100} required /></label>
      <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} maxLength={200} required /></label>
      <label>Μήνυμα<textarea value={message} onChange={e => setMessage(e.target.value)} maxLength={5000} required /></label>
      <button type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Αποστολή…' : 'Αποστολή μηνύματος'}</button>
      {status === 'sent' && <p className="form-status" role="status">Ευχαριστούμε! Το μήνυμά σας στάλθηκε.</p>}
      {status === 'error' && <p className="form-status error" role="alert">Η αποστολή απέτυχε. Δοκιμάστε ξανά ή γράψτε μας στο {CONTACT_EMAIL}.</p>}
    </form>
  );
}

export default function About() {
  const { user } = useUser();
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
  }, [hash]);
  return (
    <div className="about-page">
      <header className="about-hero">
        <p className="eyebrow">ΣΧΕΤΙΚΑ ΜΕ ΕΜΑΣ</p>
        <h1>Ένα ζωντανό αρχείο <em>λαϊκής μνήμης</em></h1>
        <nav className="about-toc" aria-label="Ενότητες σελίδας">
          {sections.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
        </nav>
      </header>

      <section id="ergo" className="about-section">
        <span className="about-num">01</span>
        <div>
          <h2>Το Έργο</h2>
          <h3>Τι είναι το Ληθιλεξικόν</h3>
          <p>Το Ληθιλεξικόν είναι μια διαδικτυακή κοινότητα αφιερωμένη στην καταγραφή λέξεων, φράσεων, παροιμιών και ιδιωματισμών που χρησιμοποιούνται όλο και λιγότερο και κινδυνεύουν να εξαφανιστούν.</p>
          <p>Στόχος μας δεν είναι μόνο η δημιουργία ενός λεξικού αλλά ενός ζωντανού αρχείου λαϊκής μνήμης, πολιτισμού και γλωσσικής παράδοσης.</p>
        </div>
      </section>

      <section id="istoria" className="about-section">
        <span className="about-num">02</span>
        <div>
          <h2>Ιστορία & Όραμα</h2>
          <p>Η ιδέα γεννήθηκε από μια απλή διαπίστωση: καθημερινά χάνονται λέξεις που κάποτε ακούγονταν σε σπίτια, γειτονιές, χωριά και παρέες σε όλη την Ελλάδα. Μαζί τους χάνεται και ένα μικρό κομμάτι της ιστορίας μας.</p>
          <blockquote>Το όραμά μας: να δημιουργηθεί η μεγαλύτερη ανοιχτή διαδικτυακή συλλογή ξεχασμένων ελληνικών λέξεων και εκφράσεων.</blockquote>
        </div>
      </section>

      <section id="symmetoxi" className="about-section">
        <span className="about-num">03</span>
        <div>
          <h2>Πώς Συμμετέχω</h2>
          <p>Κάθε μέλος μπορεί να υποβάλει λέξεις, φράσεις, παροιμίες, ιδιωματισμούς και τοπικές εκφράσεις, με ή χωρίς τη σημασία τους.</p>
          <ol className="steps">
            <li><strong>Υποβάλετε</strong> τη φράση που θυμάστε, μαζί με τη σημασία της αν την ξέρετε.</li>
            <li><strong>Ένας διαχειριστής</strong> την ελέγχει και την εγκρίνει.</li>
            <li><strong>Η φράση δημοσιεύεται</strong> στο λεξικό. Αν δεν έχει σημασία, άλλα μέλη μπορούν να προτείνουν μία.</li>
          </ol>
          <Link className="button primary" to={user ? '/submit' : '/login'}>Πρόσθεσε μια φράση <span aria-hidden="true">+</span></Link>
        </div>
      </section>

      <section id="eggrafi" className="about-section">
        <span className="about-num">04</span>
        <div>
          <h2>Οδηγίες Εγγραφής</h2>
          <p>Η συμμετοχή είναι <strong>δωρεάν</strong>.</p>
          <ol className="steps">
            <li>Πατήστε <Link to="/register">Εγγραφή</Link> και συμπληρώστε όνομα χρήστη, email και κωδικό.</li>
            <li>Συνδεθείτε με τα στοιχεία σας.</li>
            <li>Από το κουμπί «+ Προσθήκη φράσης» υποβάλετε την πρώτη σας φράση.</li>
          </ol>
          {!user && <Link className="text-link" to="/register">Δημιούργησε λογαριασμό <span aria-hidden="true">→</span></Link>}
        </div>
      </section>

      <section id="stirixi" className="about-section">
        <span className="about-num">05</span>
        <div>
          <h2>Στήριξε την Προσπάθεια</h2>
          <p>Η γλώσσα είναι συλλογική υπόθεση. Κάθε λέξη που καταγράφεται είναι μια λέξη που δεν θα ξεχαστεί.</p>
          <p>Μπορείτε να βοηθήσετε προσθέτοντας φράσεις, προτείνοντας σημασίες, ρωτώντας τους μεγαλύτερους για λέξεις που θυμούνται και μοιράζοντας το Ληθιλεξικόν με φίλους και οικογένεια.</p>
        </div>
      </section>

      <section id="omada" className="about-section">
        <span className="about-num">06</span>
        <div>
          <h2>Η Ομάδα</h2>
          <ul className="team-grid">
            {team.map(member => (
              <li key={member.name} className="team-card">
                {member.photo
                  ? <img className="team-photo" src={member.photo} alt={member.name} />
                  : <div className="team-photo placeholder" aria-hidden="true">{initials(member.name)}</div>}
                <strong>{member.name}</strong>
                <span>{member.role}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="faq" className="about-section">
        <span className="about-num">07</span>
        <div>
          <h2>Συχνές Ερωτήσεις</h2>
          <div className="faq-list">
            {faqs.map(item => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="epikoinonia" className="about-section">
        <span className="about-num">08</span>
        <div>
          <h2>Επικοινωνία</h2>
          <p>Γράψτε μας στο <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> ή χρησιμοποιήστε τη φόρμα.</p>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
