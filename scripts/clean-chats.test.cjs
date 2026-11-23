const { test } = require('node:test');
const assert = require('node:assert/strict');
const { parse } = require('./clean-chats.cjs');
test('extracts multiple tags, keeps equals in meanings, ignores chat metadata and commentary', () => {
  const result = parse('[1/1/26, 1:00 PM] Name: #πρώτο = ένα = άλλο #δεύτερο ❤️\nhttps://example.com/#ignored\nσχόλιο\n#τρίτο\n#');
  assert.deepEqual(result.entries.map(({ phrase, meaning }) => ({ phrase, meaning })), [
    { phrase: 'πρώτο', meaning: 'ένα = άλλο' }, { phrase: 'δεύτερο', meaning: '' }, { phrase: 'τρίτο', meaning: '' }
  ]);
  assert.equal(result.empty, 1);
});
test('deduplicates accented case variants and retains supplied meanings', () => {
  const result = parse('#Λέξη\n#λέξη = έννοια');
  assert.equal(result.entries.length, 1);
  assert.equal(result.entries[0].meaning, 'έννοια');
});
test('does not invent meanings from parentheses or explanatory prose without equals', () => {
  const result = parse('#έκδυση (αλλαγή σκελετού)\n#ανάβαθη: η μή βαθιά');
  assert.deepEqual(result.entries.map(e => [e.phrase, e.meaning]), [['έκδυση', ''], ['ανάβαθη', '']]);
});
