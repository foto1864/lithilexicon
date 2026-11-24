// Uses only an isolated demo Firestore emulator; never connects to production.
const assert = require('node:assert/strict');
if (!process.env.FIRESTORE_EMULATOR_HOST) throw new Error('Firestore emulator is required');
const base = `http://${process.env.FIRESTORE_EMULATOR_HOST}/v1/projects/demo-lithilexicon/databases/(default)/documents`;
function token(uid) {
  const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url');
  return `${encode({ alg: 'none', typ: 'JWT' })}.${encode({ sub: uid, user_id: uid, email: `${uid}@example.test`, aud: 'demo-lithilexicon', iss: 'https://securetoken.google.com/demo-lithilexicon', iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600, firebase: { sign_in_provider: 'password' } })}.`;
}
const field = value => typeof value === 'boolean' ? { booleanValue: value } : { stringValue: value };
const fields = data => Object.fromEntries(Object.entries(data).map(([key, value]) => [key, field(value)]));
async function request(path, user, method = 'GET', body) {
  const response = await fetch(base + path, {
    method, headers: { 'Content-Type': 'application/json', ...(user ? { Authorization: `Bearer ${user === 'owner' ? 'owner' : token(user)}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  return { status: response.status, body: await response.json() };
}
async function allowed(path, user, method, body) {
  const result = await request(path, user, method, body);
  assert.equal(result.status, 200, JSON.stringify(result.body));
  return result.body;
}
async function denied(path, user, method, body) {
  const result = await request(path, user, method, body);
  assert.equal(result.status, 403, JSON.stringify(result.body));
}
const query = (fieldPath, value) => ({ structuredQuery: { from: [{ collectionId: 'entries' }], where: { fieldFilter: { field: { fieldPath }, op: 'EQUAL', value: field(value) } } } });
async function main() {
  for (const user of ['member', 'other', 'admin']) {
    await allowed(`/users/${user}`, user, 'PATCH', { fields: fields({ email: `${user}@example.test`, username: user, role: 'subscriber' }) });
  }
  await allowed('/users/admin?updateMask.fieldPaths=role', 'owner', 'PATCH', { fields: fields({ role: 'admin' }) });
  const entry = { fields: { ...fields({ phrase: 'Άρον άρον', meaning: 'Με βιασύνη', uploadedBy: 'member@example.test', uploadedByUsername: 'member', approved: false }), timestamp: { timestampValue: new Date().toISOString() } } };
  await denied('/entries/guest', null, 'PATCH', entry);
  await denied('/entries/self-approved', 'member', 'PATCH', { fields: { ...entry.fields, approved: field(true) } });
  await denied('/entries/spoofed', 'member', 'PATCH', { fields: { ...entry.fields, uploadedBy: field('other@example.test') } });
  await denied('/users/member?updateMask.fieldPaths=role', 'member', 'PATCH', { fields: fields({ role: 'admin' }) });
  await allowed('/entries/pending', 'member', 'PATCH', entry);
  await denied('/entries/pending', null);
  await denied('/entries/pending', 'other');
  await allowed('/entries/pending', 'member');
  await allowed(':runQuery', 'member', 'POST', query('uploadedBy', 'member@example.test'));
  await allowed(':runQuery', 'admin', 'POST', { structuredQuery: { from: [{ collectionId: 'entries' }] } });
  await denied('/users/member', 'other');
  await denied('/entries/pending?updateMask.fieldPaths=approved', 'member', 'PATCH', { fields: fields({ approved: true }) });
  await allowed('/entries/pending?updateMask.fieldPaths=approved', 'admin', 'PATCH', { fields: fields({ approved: true }) });
  const published = await allowed(':runQuery', null, 'POST', query('approved', true));
  assert.equal(published.filter(row => row.document).length, 1);
  await allowed('/entries/pending', null);
  const suggestion = { fields: { ...fields({ entryId: 'pending', phrase: 'Άρον άρον', meaning: 'Αμέσως', uploadedBy: 'member@example.test', uploadedByUsername: 'member' }), timestamp: { timestampValue: new Date().toISOString() } } };
  await denied('/meaningSuggestions/guest', null, 'PATCH', suggestion);
  await denied('/meaningSuggestions/spoof', 'other', 'PATCH', suggestion);
  await denied('/meaningSuggestions/invalid', 'member', 'PATCH', { fields: { ...suggestion.fields, entryId: field('missing') } });
  await allowed('/meaningSuggestions/proposal', 'member', 'PATCH', suggestion);
  await denied('/meaningSuggestions/proposal', 'other');
  await allowed('/meaningSuggestions/proposal', 'admin');
  await denied('/entries/pending?updateMask.fieldPaths=meaning', 'member', 'PATCH', { fields: fields({ meaning: 'Changed' }) });
  await allowed('/entries/pending?updateMask.fieldPaths=meaning', 'admin', 'PATCH', { fields: fields({ meaning: 'Αμέσως' }) });
  await allowed('/meaningSuggestions/proposal', 'admin', 'DELETE');
  await denied('/entries/pending', 'member', 'DELETE');
  await allowed('/entries/pending', 'admin', 'DELETE');
  const contact = { fields: { ...fields({ name: 'Επισκέπτης', email: 'guest@example.test', message: 'Γεια σας' }), timestamp: { timestampValue: new Date().toISOString() } } };
  await denied('/contactMessages/bad-time', null, 'PATCH', contact);
  const contactWrite = (id, email = 'guest@example.test') => ({ writes: [{ update: { name: `${base.split('/v1/')[1]}/contactMessages/${id}`, fields: { name: contact.fields.name, email: field(email), message: contact.fields.message } }, updateTransforms: [{ fieldPath: 'timestamp', setToServerValue: 'REQUEST_TIME' }] }] });
  await denied(':commit', null, 'POST', contactWrite('bad-email', 'nope'));
  await allowed(':commit', null, 'POST', contactWrite('guest'));
  await denied('/contactMessages/guest', null);
  await denied('/contactMessages/guest', 'member');
  await allowed('/contactMessages/guest', 'admin');
  await allowed('/contactMessages/guest', 'admin', 'DELETE');
  console.log('PASS: public phrases, private profiles, own submissions, admin moderation, and privilege escalation checks');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
