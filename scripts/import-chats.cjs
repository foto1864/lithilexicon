// Uses the existing Firebase CLI account; never stores or prints credentials.
const fs = require('node:fs');
const crypto = require('node:crypto');
const { normalize } = require('./clean-chats.cjs');
const auth = require('/usr/local/lib/node_modules/firebase-tools/lib/auth');
const base = 'https://firestore.googleapis.com/v1/projects/lithilexicon/databases/(default)/documents';
async function main() {
  const account = auth.getGlobalDefaultAccount();
  if (!account) throw new Error('Firebase CLI login required');
  const token = await auth.getAccessToken(account.tokens.refresh_token, ['https://www.googleapis.com/auth/cloud-platform']);
  async function api(path, body) {
    const response = await fetch(base + path, { method: 'POST', headers: { Authorization: `Bearer ${token.access_token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!response.ok) throw new Error(`Firestore ${response.status}: ${await response.text()}`);
    return response.json();
  }
  const rows = await api(':runQuery', { structuredQuery: { from: [{ collectionId: 'entries' }] } });
  const existing = new Map(rows.filter(r => r.document).map(r => [normalize(r.document.fields.phrase?.stringValue || ''), r.document]));
  const entries = JSON.parse(fs.readFileSync('chats/entries.cleaned.json'));
  const writes = []; let skipped = 0, created = 0, enriched = 0;
  for (const entry of entries) {
    const key = normalize(entry.phrase);
    const previous = existing.get(key);
    if (previous) {
      if (!previous.fields.meaning?.stringValue?.trim() && entry.meaning) {
        writes.push({ update: { name: previous.name, fields: { meaning: { stringValue: entry.meaning } } }, updateMask: { fieldPaths: ['meaning'] }, currentDocument: { updateTime: previous.updateTime } }); enriched++;
      } else skipped++;
      continue;
    }
    const id = 'chat-' + crypto.createHash('sha256').update(key).digest('hex').slice(0, 32);
    writes.push({ update: { name: base.replace('https://firestore.googleapis.com/v1/', '') + '/entries/' + id, fields: {
      phrase: { stringValue: entry.phrase }, meaning: { stringValue: entry.meaning }, approved: { booleanValue: true },
      uploadedByUsername: { stringValue: 'Η ομάδα του Ληθιλεξικού' }, uploadedBy: { stringValue: 'chat-import' }, timestamp: { timestampValue: new Date().toISOString() }
    } }, currentDocument: { exists: false } }); created++;
  }
  console.log(JSON.stringify({ mode: process.argv.includes('--apply') ? 'apply' : 'dry-run', source: entries.length, created, enriched, skipped }));
  if (process.argv.includes('--apply') && writes.length) {
    fs.writeFileSync('chats/import-backup.json', JSON.stringify(rows.filter(r => r.document).map(r => r.document), null, 2));
    await api(':commit', { writes });
    console.log('Atomic import committed.');
  }
}
main().then(() => process.exit(0)).catch(e => { console.error(e.message); process.exit(1); });
