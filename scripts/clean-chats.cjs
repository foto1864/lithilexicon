const fs = require('node:fs');
const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('el').replace(/\s+/g, ' ').trim();
const clean = s => s.replace(/@[\p{L} ]+/gu, '').replace(/\(?CR\s+[A-Z]+\)?/g, '').replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, '').replace(/\s+/g, ' ').replace(/\s+([,;])/g, '$1').replace(/^[\s,]+|[\s,]+$/g, '').trim();
function parse(text) {
  const records = new Map();
  let tags = 0, empty = 0;
  text.split(/\r?\n/).forEach((line, index) => {
    const body = line.replace(/^\[[^\]]+\] [^:]+: /, '').trim();
    if (!body.startsWith('#')) return;
    for (const raw of body.slice(1).split('#')) {
      tags++;
      const content = clean(raw);
      if (!content) { empty++; continue; }
      const equal = content.indexOf('=');
      let phrase = equal < 0 ? content : content.slice(0, equal);
      let meaning = equal < 0 ? '' : content.slice(equal + 1).trim();
      // Parenthetical etymologies with '=' belong to the supplied meaning.
      if (equal >= 0 && phrase.includes('(')) {
        const start = phrase.indexOf('(');
        meaning = content.slice(start + 1).replace(/\)\s*,?$/, '').trim();
        phrase = phrase.slice(0, start);
      }
      // Explanatory prose is not part of the headword; without '=' it is not a meaning.
      if (equal < 0) phrase = phrase.replace(/\s*\([^)]*\)/g, '').split(/\.\s|:\s|,\s*η φυσική|\s+είναι η |\s+ο μή έχων|\s+χώρος μπροστά|\s+στην θάλασσα/)[0];
      if (phrase.startsWith('ψωλάρω,')) phrase = 'ψωλάρω';
      phrase = clean(phrase).replace(/[.]$/, '');
      const corrections = {
        'ταουλι τραπέζι': 'ταούλι', 'σε χρόνο μηδέν, σε χρόμο DT': 'σε χρόνο μηδέν, σε χρόνο DT',
        'στο φτερό, πιο αργός λαι από το replay': 'στο φτερό, πιο αργός και από το replay',
        'είναι μια σουπιά αυτός': 'είναι μια σουπιά αυτός(η)',
        'τρικυμια τρικυμία εν κρανιω': 'τρικυμία, τρικυμία εν κρανίω'
      };
      phrase = corrections[phrase] || phrase;
      if (!phrase) { empty++; continue; }
      const key = normalize(phrase);
      const existing = records.get(key);
      if (existing) {
        existing.lines.push(index + 1);
        if (meaning && !existing.meaning.includes(meaning)) existing.meaning = [existing.meaning, meaning].filter(Boolean).join('; ');
      } else records.set(key, { phrase, meaning, lines: [index + 1] });
    }
  });
  return { entries: [...records.values()], tags, empty };
}
if (require.main === module) {
  const result = parse(fs.readFileSync('chats/chat.txt', 'utf8'));
  fs.writeFileSync('chats/entries.cleaned.json', JSON.stringify(result.entries, null, 2) + '\n');
  console.log({ tags: result.tags, empty: result.empty, unique: result.entries.length, withMeaning: result.entries.filter(e => e.meaning).length });
}
module.exports = { parse, normalize };
