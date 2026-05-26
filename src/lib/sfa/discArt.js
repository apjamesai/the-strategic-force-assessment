// ─────────── Default disc art SVG library (abstract evocations)
// Returns HTML string for use with dangerouslySetInnerHTML

const BASE_DEFS = `<defs>
  <radialGradient id="g1" cx="50%" cy="40%" r="60%">
    <stop offset="0%" stop-color="#2a1f17"/>
    <stop offset="60%" stop-color="#100a07"/>
    <stop offset="100%" stop-color="#040302"/>
  </radialGradient>
  <radialGradient id="amberG" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#ff8a4a" stop-opacity="0.6"/>
    <stop offset="100%" stop-color="#c93a16" stop-opacity="0"/>
  </radialGradient>
  <filter id="blur1"><feGaussianBlur stdDeviation="2.5"/></filter>
  <filter id="blurHi"><feGaussianBlur stdDeviation="8"/></filter>
</defs>
<rect width="600" height="600" fill="url(#g1)"/>`;

const CLOSE = `<div class="sfa-disc-veil"></div>`;

function wrap(inner, extraClass = '') {
  return `<svg class="sfa-disc-art${extraClass ? ' ' + extraClass : ''}" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice">${BASE_DEFS}${inner}</svg>${CLOSE}`;
}

export const DEFAULT_DISC_ART = {
  councilChamber: wrap(`
    ${Array.from({length:9}, (_,i)=>{const x=60+i*60;return `<rect x="${x-3}" y="120" width="6" height="380" fill="#1a130e" stroke="rgba(255,90,44,0.15)" stroke-width="0.5"/>`;}).join('')}
    <ellipse cx="300" cy="540" rx="280" ry="40" fill="#0e0907" stroke="rgba(255,90,44,0.2)" stroke-width="0.7"/>
    <ellipse cx="300" cy="540" rx="180" ry="24" fill="none" stroke="rgba(255,90,44,0.3)" stroke-width="0.5"/>
    <ellipse cx="300" cy="540" rx="80" ry="11" fill="none" stroke="rgba(255,138,74,0.5)" stroke-width="0.5"/>
    <ellipse cx="300" cy="500" rx="14" ry="18" fill="#1c1410"/>
    <rect x="288" y="360" width="24" height="150" rx="6" fill="#15100c"/>
    <circle cx="300" cy="345" r="14" fill="#1a130e"/>
    <circle cx="300" cy="370" r="160" fill="url(#amberG)" filter="url(#blurHi)"/>
    ${Array.from({length:24}, ()=>`<circle cx="${Math.random()*600}" cy="${Math.random()*120}" r="${0.5+Math.random()}" fill="#ff5a2c" opacity="${0.2+Math.random()*0.6}"/>`).join('')}
  `),

  fracturedCity: wrap(`
    ${Array.from({length:30}, (_,i)=>{const x=i*22;const h=60+Math.random()*200;const top=480-h;return `<rect x="${x}" y="${top}" width="20" height="${h}" fill="#0a0705" stroke="rgba(255,90,44,0.1)" stroke-width="0.3"/>`;}).join('')}
    <ellipse cx="200" cy="380" rx="180" ry="60" fill="url(#amberG)" filter="url(#blurHi)" opacity="0.7"/>
    <ellipse cx="430" cy="420" rx="130" ry="40" fill="url(#amberG)" filter="url(#blurHi)" opacity="0.5"/>
    <rect x="280" y="430" width="6" height="60" fill="#0a0705"/>
    <rect x="320" y="430" width="6" height="60" fill="#0a0705"/>
    <circle cx="283" cy="425" r="5" fill="#0a0705"/>
    <circle cx="323" cy="425" r="5" fill="#0a0705"/>
  `),

  convoyArc: wrap(`
    <rect x="0" y="420" width="600" height="180" fill="#0c0908"/>
    <line x1="40" y1="430" x2="560" y2="425" stroke="#ff5a2c" stroke-width="0.6" opacity="0.4"/>
    ${Array.from({length:8}, (_,i)=>`<rect x="${80+i*60}" y="420" width="20" height="14" fill="#1a130e" stroke="rgba(255,90,44,0.4)" stroke-width="0.4"/>`).join('')}
    <circle cx="160" cy="200" r="6" fill="#ff8a4a"/>
    <circle cx="160" cy="200" r="20" fill="url(#amberG)" filter="url(#blurHi)"/>
    ${Array.from({length:40}, ()=>`<circle cx="${Math.random()*600}" cy="${Math.random()*350}" r="${0.4+Math.random()*0.8}" fill="#ff8a4a" opacity="${0.2+Math.random()*0.6}"/>`).join('')}
  `),

  privateMeet: wrap(`
    <rect x="80" y="120" width="440" height="220" fill="#070504"/>
    <line x1="80" y1="220" x2="520" y2="220" stroke="rgba(255,90,44,0.5)" stroke-width="0.4"/>
    <ellipse cx="320" cy="220" rx="260" ry="40" fill="url(#amberG)" filter="url(#blurHi)" opacity="0.6"/>
    <rect x="180" y="380" width="22" height="100" rx="6" fill="#16100b"/>
    <circle cx="191" cy="372" r="13" fill="#16100b"/>
    <rect x="400" y="370" width="22" height="110" rx="6" fill="#16100b"/>
    <circle cx="411" cy="362" r="13" fill="#16100b"/>
    <ellipse cx="300" cy="510" rx="200" ry="22" fill="#0c0907" stroke="rgba(255,90,44,0.25)" stroke-width="0.5"/>
    <ellipse cx="411" cy="370" rx="40" ry="60" fill="url(#amberG)" filter="url(#blurHi)" opacity="0.5"/>
  `),

  breakingPoint: wrap(`
    ${[150,250,350,450].map(x=>`<line x1="${x}" y1="60" x2="${x}" y2="540" stroke="rgba(255,90,44,0.4)" stroke-width="0.5"/>`).join('')}
    <rect x="295" y="0" width="10" height="600" fill="url(#amberG)" filter="url(#blurHi)" opacity="0.6"/>
    <rect x="288" y="400" width="24" height="120" rx="6" fill="#0d0807"/>
    <circle cx="300" cy="388" r="14" fill="#0d0807"/>
    <ellipse cx="300" cy="540" rx="60" ry="10" fill="rgba(255,90,44,0.18)" filter="url(#blur1)"/>
  `),

  confrontation: wrap(`
    <rect x="0" y="0" width="600" height="600" fill="#070504"/>
    <line x1="300" y1="60" x2="300" y2="540" stroke="rgba(255,90,44,0.3)" stroke-width="0.5"/>
    <circle cx="200" cy="280" r="80" fill="rgba(255,138,74,0.05)" stroke="rgba(255,90,44,0.4)" stroke-width="0.4"/>
    <circle cx="400" cy="280" r="80" fill="rgba(255,138,74,0.08)" stroke="rgba(255,90,44,0.5)" stroke-width="0.4"/>
    <rect x="190" y="340" width="20" height="160" rx="6" fill="#15100c"/>
    <circle cx="200" cy="335" r="14" fill="#15100c"/>
    <rect x="390" y="340" width="20" height="160" rx="6" fill="#15100c"/>
    <circle cx="400" cy="335" r="14" fill="#15100c"/>
    <ellipse cx="300" cy="380" rx="80" ry="12" fill="rgba(255,90,44,0.1)" filter="url(#blur1)"/>
  `),

  twinSuns: wrap(`
    <rect x="0" y="0" width="600" height="600" fill="url(#g1)"/>
    <line x1="0" y1="420" x2="600" y2="420" stroke="rgba(255,90,44,0.6)" stroke-width="0.6"/>
    <path d="M 0 480 Q 100 440 220 470 Q 340 500 460 460 Q 540 440 600 470 L 600 600 L 0 600 Z" fill="#0d0806"/>
    <circle cx="280" cy="380" r="46" fill="rgba(255,90,44,0.7)" filter="url(#blur1)"/>
    <circle cx="280" cy="380" r="30" fill="#ff8a4a"/>
    <circle cx="360" cy="360" r="22" fill="rgba(255,138,74,0.5)" filter="url(#blur1)"/>
    <circle cx="360" cy="360" r="14" fill="#ff5a2c"/>
    <rect x="297" y="495" width="6" height="62" fill="#0a0604"/>
    <circle cx="300" cy="490" r="6" fill="#0a0604"/>
  `),

  summonsHerald: wrap(`
    <circle cx="300" cy="380" r="120" fill="#0a0807" stroke="rgba(255,90,44,0.45)" stroke-width="0.6"/>
    <ellipse cx="300" cy="380" rx="120" ry="14" fill="url(#amberG)" filter="url(#blurHi)" opacity="0.7"/>
    <path d="M 300 380 L 240 60 L 360 60 Z" fill="rgba(255,107,0,0.08)" stroke="rgba(255,107,0,0.4)" stroke-width="0.6"/>
    <circle cx="300" cy="80" r="3" fill="#ff8a4a"/>
    <circle cx="300" cy="80" r="14" fill="url(#amberG)" filter="url(#blurHi)"/>
    ${Array.from({length:32}, ()=>`<circle cx="${Math.random()*600}" cy="${Math.random()*340}" r="${0.4+Math.random()*0.9}" fill="#fff" opacity="${0.2+Math.random()*0.6}"/>`).join('')}
  `),

  chaoticCouncil: wrap(`
    <ellipse cx="300" cy="540" rx="260" ry="36" fill="#0d0907" stroke="rgba(255,90,44,0.3)" stroke-width="0.6"/>
    <rect x="130" y="370" width="22" height="150" rx="6" fill="#15100c"/>
    <circle cx="141" cy="355" r="14" fill="#15100c"/>
    <line x1="141" y1="355" x2="100" y2="280" stroke="#15100c" stroke-width="6" stroke-linecap="round"/>
    <rect x="288" y="360" width="24" height="160" rx="6" fill="#0e0907"/>
    <circle cx="300" cy="345" r="15" fill="#0e0907"/>
    <rect x="450" y="370" width="22" height="150" rx="6" fill="#15100c"/>
    <circle cx="461" cy="355" r="14" fill="#15100c"/>
    <line x1="461" y1="355" x2="510" y2="290" stroke="#15100c" stroke-width="6" stroke-linecap="round"/>
    <ellipse cx="300" cy="120" rx="220" ry="60" fill="url(#amberG)" filter="url(#blurHi)" opacity="0.5"/>
  `),

  aftermathMedbay: wrap(`
    <rect x="0" y="80" width="600" height="440" fill="#070504"/>
    <line x1="80" y1="80" x2="160" y2="380" stroke="rgba(255,90,44,0.25)" stroke-width="0.5"/>
    <line x1="520" y1="80" x2="440" y2="380" stroke="rgba(255,90,44,0.25)" stroke-width="0.5"/>
    <rect x="288" y="400" width="24" height="120" rx="6" fill="#0e0907"/>
    <ellipse cx="300" cy="392" rx="14" ry="16" fill="#0e0907"/>
    <line x1="288" y1="430" x2="280" y2="495" stroke="#0e0907" stroke-width="6" stroke-linecap="round"/>
    <line x1="312" y1="430" x2="320" y2="495" stroke="#0e0907" stroke-width="6" stroke-linecap="round"/>
    <ellipse cx="100" cy="300" rx="120" ry="180" fill="url(#amberG)" filter="url(#blurHi)" opacity="0.4"/>
    <ellipse cx="300" cy="540" rx="200" ry="14" fill="rgba(255,107,0,0.15)" filter="url(#blur1)"/>
  `),

  shadowPattern: wrap(`
    <ellipse cx="300" cy="540" rx="180" ry="26" fill="#0a0706" stroke="rgba(255,90,44,0.2)" stroke-width="0.5"/>
    <path d="M 300 540 L 80 460 L 60 540 Z" fill="#050403" opacity="0.85"/>
    <path d="M 300 540 L 520 460 L 540 540 Z" fill="#050403" opacity="0.85"/>
    <rect x="288" y="360" width="24" height="160" rx="6" fill="#0e0907" stroke="rgba(255,90,44,0.55)" stroke-width="0.6"/>
    <circle cx="300" cy="345" r="16" fill="#0e0907" stroke="rgba(255,90,44,0.6)" stroke-width="0.6"/>
    <ellipse cx="120" cy="320" rx="80" ry="160" fill="url(#amberG)" filter="url(#blurHi)" opacity="0.55"/>
    <ellipse cx="480" cy="320" rx="80" ry="160" fill="url(#amberG)" filter="url(#blurHi)" opacity="0.55"/>
    <circle cx="300" cy="345" r="50" fill="none" stroke="rgba(255,107,0,0.35)" stroke-width="0.4"/>
  `),

  alliesWhisper: wrap(`
    <rect x="0" y="0" width="600" height="600" fill="#060403"/>
    <path d="M 60 540 L 60 220 Q 60 100 180 100 L 200 100 L 200 540 Z" fill="rgba(20,16,12,0.7)" stroke="rgba(255,90,44,0.18)" stroke-width="0.5"/>
    <path d="M 400 540 L 400 100 L 420 100 Q 540 100 540 220 L 540 540 Z" fill="rgba(20,16,12,0.7)" stroke="rgba(255,90,44,0.18)" stroke-width="0.5"/>
    <ellipse cx="300" cy="540" rx="150" ry="20" fill="#0a0706"/>
    <rect x="240" y="320" width="32" height="220" rx="8" fill="#0c0807" stroke="rgba(255,107,0,0.3)" stroke-width="0.5"/>
    <circle cx="256" cy="310" r="14" fill="#0c0807"/>
    <rect x="284" y="310" width="32" height="230" rx="8" fill="#0c0807" stroke="rgba(255,107,0,0.4)" stroke-width="0.5"/>
    <circle cx="300" cy="300" r="14" fill="#0c0807"/>
    <rect x="328" y="320" width="32" height="220" rx="8" fill="#0c0807" stroke="rgba(255,107,0,0.3)" stroke-width="0.5"/>
    <circle cx="344" cy="310" r="14" fill="#0c0807"/>
    <circle cx="300" cy="160" r="6" fill="#ff8a4a"/>
    <circle cx="300" cy="160" r="40" fill="url(#amberG)" filter="url(#blurHi)" opacity="0.8"/>
  `),

  reckoningMirror: wrap(`
    <rect x="0" y="0" width="600" height="600" fill="#060403"/>
    <ellipse cx="300" cy="540" rx="240" ry="22" fill="#0a0706" stroke="rgba(255,90,44,0.2)" stroke-width="0.4"/>
    <rect x="170" y="360" width="26" height="170" rx="6" fill="#0e0907" stroke="rgba(255,90,44,0.55)" stroke-width="0.6"/>
    <circle cx="183" cy="345" r="17" fill="#0e0907" stroke="rgba(255,90,44,0.6)" stroke-width="0.6"/>
    <rect x="404" y="360" width="26" height="170" rx="6" fill="#0e0907" stroke="rgba(255,90,44,0.35)" stroke-width="0.6" opacity="0.85"/>
    <circle cx="417" cy="345" r="17" fill="#0e0907" stroke="rgba(255,90,44,0.4)" stroke-width="0.6" opacity="0.85"/>
    <line x1="300" y1="40" x2="300" y2="560" stroke="url(#amberG)" stroke-width="2" filter="url(#blurHi)"/>
    <line x1="300" y1="60" x2="300" y2="540" stroke="rgba(255,107,0,0.7)" stroke-width="0.8"/>
    <circle cx="300" cy="345" r="50" fill="url(#amberG)" filter="url(#blurHi)" opacity="0.8"/>
  `),

  dividedChamber: wrap(`
    <rect x="0" y="0" width="600" height="600" fill="#070504"/>
    ${[100,160,220,280,340,400].map(y=>`
      <line x1="40" y1="${y}" x2="${300-(y-220)*0.2}" y2="${y}" stroke="rgba(255,90,44,0.1)" stroke-width="0.5"/>
      <line x1="${300+(y-220)*0.2}" y1="${y}" x2="560" y2="${y}" stroke="rgba(255,90,44,0.1)" stroke-width="0.5"/>
    `).join('')}
    <line x1="300" y1="40" x2="300" y2="560" stroke="rgba(255,107,0,0.45)" stroke-width="0.8"/>
    <ellipse cx="300" cy="300" rx="14" ry="260" fill="url(#amberG)" filter="url(#blurHi)" opacity="0.6"/>
    <rect x="294" y="440" width="12" height="100" rx="3" fill="#15100c"/>
    <circle cx="300" cy="430" r="8" fill="#15100c"/>
  `)
};

export function getDiscArt(artId, skinOverrides) {
  if (skinOverrides && skinOverrides[artId]) {
    return skinOverrides[artId];
  }
  return DEFAULT_DISC_ART[artId] || DEFAULT_DISC_ART.summonsHerald;
}

// Choreo backgrounds — SVG strings for dangerouslySetInnerHTML
export function getChoreoSVG(id, skinOverrides) {
  if (skinOverrides && skinOverrides[id]) return skinOverrides[id];
  return getDefaultChoreo(id);
}

function getDefaultChoreo(id) {
  const amber = 'var(--amber)';
  switch (id) {
    case 'converging':
      return `<svg class="sfa-choreo" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        ${Array.from({length:14}, (_,i)=>{const y=100+i*55;return `<line x1="-50" y1="${y}" x2="1700" y2="${y-100+Math.sin(i)*200}" stroke-width="0.5"/>`;}).join('')}
      </svg>`;
    case 'ripple':
      return `<svg class="sfa-choreo" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        ${Array.from({length:10}, (_,i)=>`<circle cx="800" cy="450" r="${80+i*60}" stroke-width="0.4" stroke-opacity="${0.6-i*0.05}"/>`).join('')}
      </svg>`;
    case 'sun-arcs':
      return `<svg class="sfa-choreo sun-arcs" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        <path d="M -100 700 Q 400 200 800 250 T 1700 700" stroke-width="0.8" stroke-dasharray="3000" stroke-dashoffset="0"/>
        <path d="M -100 750 Q 400 300 800 350 T 1700 750" stroke-width="0.5" stroke-dasharray="3000" stroke-dashoffset="0" stroke-opacity="0.5"/>
        <circle cx="640" cy="280" r="38" stroke-width="0.6" fill="rgba(255,90,44,0.18)"/>
        <circle cx="780" cy="220" r="22" stroke-width="0.5" fill="rgba(255,138,74,0.22)"/>
      </svg>`;
    case 'grid':
      return `<svg class="sfa-choreo" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        ${Array.from({length:24}, (_,i)=>`<line x1="${i*70}" y1="0" x2="${i*70}" y2="900" stroke-width="0.3" stroke-opacity="0.4"/>`).join('')}
        ${Array.from({length:14}, (_,i)=>`<line x1="0" y1="${i*70}" x2="1600" y2="${i*70}" stroke-width="0.3" stroke-opacity="0.4"/>`).join('')}
      </svg>`;
    case 'fault':
      return `<svg class="sfa-choreo" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        <path d="M 0 600 L 200 580 L 380 640 L 520 540 L 700 600 L 880 480 L 1080 600 L 1280 520 L 1600 600" stroke-width="0.7"/>
        <path d="M 0 660 L 220 640 L 400 700 L 540 600 L 720 660 L 900 540 L 1100 660 L 1300 580 L 1600 660" stroke-width="0.4" stroke-opacity="0.5"/>
      </svg>`;
    case 'web':
      return `<svg class="sfa-choreo" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        ${Array.from({length:16}, (_,i)=>{const a=(i/16)*Math.PI*2;return `<line x1="800" y1="450" x2="${800+Math.cos(a)*900}" y2="${450+Math.sin(a)*900}" stroke-width="0.3"/>`;}).join('')}
        ${[180,320,460,600].map((r,i)=>`<circle cx="800" cy="450" r="${r}" stroke-width="0.3" stroke-opacity="${0.5-i*0.08}"/>`).join('')}
      </svg>`;
    default:
      return '';
  }
}