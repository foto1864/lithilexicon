import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

export const normalizePhrase = (text = '') => text
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleUpperCase('el-GR').trim();

export async function getApprovedEntries() {
  // Sort locally: this query needs no composite Firestore index.
  const snapshot = await getDocs(query(collection(db, 'entries'), where('approved', '==', true)));
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
    .filter(entry => typeof entry.phrase === 'string')
    .sort((a, b) => a.phrase.localeCompare(b.phrase, 'el'));
}

export function entryErrorMessage(error) {
  if (error.code === 'permission-denied') return 'Η πρόσβαση στις φράσεις δεν επιτρέπεται αυτή τη στιγμή. Χρειάζεται έλεγχος των δικαιωμάτων της βάσης.';
  return 'Δεν ήταν δυνατή η φόρτωση των φράσεων. Ελέγξτε τη σύνδεσή σας και δοκιμάστε ξανά.';
}
