// Tokenises text into word-spans with staggered transition-delays.
// Preserves <em> spans across word boundaries.
export function wordReveal(text, delayBase = 0) {
  if (!text) return '';
  const tokens = text.split(/(<em>|<\/em>|\s+)/).filter(t => t && t.length > 0);
  let inEm = false;
  let idx = 0;
  let out = '';
  tokens.forEach(tok => {
    if (tok === '<em>') { inEm = true; }
    else if (tok === '</em>') { inEm = false; }
    else if (/^\s+$/.test(tok)) { out += ' '; }
    else {
      const delay = delayBase + idx * 70;
      const content = inEm ? `<em>${tok}</em>` : tok;
      out += `<span class="sfa-reveal-word" style="transition-delay:${delay}ms">${content}</span>`;
      idx++;
    }
  });
  return out;
}

export function wordRevealArr(arr, delayBase = 0) {
  let cur = delayBase;
  return arr.map(line => {
    const html = wordReveal(line, cur);
    cur += line.split(' ').length * 70 + 200;
    return `<span class="reveal-line">${html}</span>`;
  }).join('');
}