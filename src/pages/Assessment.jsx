import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SCENES_FORCE_TRIAL } from '@/lib/sfa/scenes-force-trial';
import {
  FRAMEWORK, ARCHETYPES, SECONDARY_PATTERNS, RISK_COPY, NEXT_STEPS, MOCK_PROFILES,
  RULE_DEFAULTS, rebuildScores, computeResults, getRunningFlags,
  pickArchetype, pickSecondaryPattern, bandFor, overallBand, riskBand,
  applyConditional, personalizeScene
} from '@/lib/sfa/engine';
import { getDiscArt, getChoreoSVG } from '@/lib/sfa/discArt';
import { PRACTICE_ICONS, RISK_ICONS, STEP_ICONS } from '@/lib/sfa/icons';

// ─── Initial state ───────────────────────────────────────────
const initialScores = () => ({
  practices: {
    understand_self: [], master_emotions: [], embed_practices: [],
    be_curious: [], listen_deeply: [], think_critically: [],
    unlock_creativity: [], manage_uncertainty: [], future_focused: [],
    act_decisively: [], collaborate_inclusively: [], influence_effortlessly: []
  },
  risks: { control_bias: [], moral_drift: [], detachment_pressure: [] }
});

// ─── Word reveal helper ──────────────────────────────────────
function wordRevealHTML(text, delayBase = 0) {
  if (!text) return '';
  const tokens = text.split(/(<em>|<\/em>|\s+)/).filter(t => t && t.length > 0);
  let inEm = false, idx = 0, out = '';
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

// ─── SVG icon renderer ───────────────────────────────────────
function PracticeIcon({ k }) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1"
      dangerouslySetInnerHTML={{ __html: PRACTICE_ICONS[k] || '' }}
    />
  );
}
function RiskIcon({ k }) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1"
      dangerouslySetInnerHTML={{ __html: RISK_ICONS[k] || '' }}
    />
  );
}
function StepIcon({ k }) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1"
      dangerouslySetInnerHTML={{ __html: STEP_ICONS[k] || '' }}
    />
  );
}

// ─── Choreo + DiscArt inline ─────────────────────────────────
function Choreo({ id, skinOverrides }) {
  const html = getChoreoSVG(id, skinOverrides);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function DiscArtEl({ artId, skinOverrides }) {
  const html = getDiscArt(artId, skinOverrides);
  return <div className="sfa-disc" dangerouslySetInnerHTML={{ __html: html }} />;
}

// ─── ARCHETYPE PORTRAIT SVGS (abstract silhouettes) ─────────
const ARCHETYPE_ART_SVG = {
  reactive_defender: (
    <svg viewBox="0 0 380 380">
      <defs>
        <radialGradient id="rd1" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#2a1f17"/><stop offset="100%" stopColor="#070504"/></radialGradient>
        <radialGradient id="rdG" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ff8a4a" stopOpacity="0.6"/><stop offset="100%" stopColor="#c93a16" stopOpacity="0"/></radialGradient>
        <filter id="rdBlur"><feGaussianBlur stdDeviation="6"/></filter>
      </defs>
      <rect width="380" height="380" fill="url(#rd1)"/>
      <ellipse cx="190" cy="380" rx="170" ry="22" fill="rgba(255,90,44,0.18)" filter="url(#rdBlur)"/>
      <path d="M 80 380 L 90 280 L 130 250 L 150 200 L 160 170 L 190 150 L 220 170 L 230 200 L 250 250 L 290 280 L 300 380 Z" fill="#0e0907" stroke="rgba(255,90,44,0.45)" strokeWidth="0.8"/>
      <circle cx="190" cy="155" r="22" fill="#0e0907" stroke="rgba(255,90,44,0.5)" strokeWidth="0.6"/>
      <ellipse cx="190" cy="340" rx="180" ry="40" fill="url(#rdG)" filter="url(#rdBlur)"/>
    </svg>
  ),
  tactical_survivor: (
    <svg viewBox="0 0 380 380">
      <defs>
        <radialGradient id="ts1" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#2a1f17"/><stop offset="100%" stopColor="#070504"/></radialGradient>
        <radialGradient id="tsG" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ff8a4a" stopOpacity="0.6"/><stop offset="100%" stopColor="#c93a16" stopOpacity="0"/></radialGradient>
        <filter id="tsBlur"><feGaussianBlur stdDeviation="6"/></filter>
      </defs>
      <rect width="380" height="380" fill="url(#ts1)"/>
      <ellipse cx="190" cy="380" rx="160" ry="20" fill="rgba(255,90,44,0.15)" filter="url(#tsBlur)"/>
      <path d="M 150 380 L 170 230 L 195 150 L 215 230 L 230 380 L 200 380 L 205 280 L 195 280 L 185 380 Z" fill="#0e0907" stroke="rgba(255,90,44,0.5)" strokeWidth="0.7"/>
      <circle cx="195" cy="130" r="20" fill="#0e0907" stroke="rgba(255,90,44,0.55)" strokeWidth="0.7"/>
      <circle cx="120" cy="100" r="42" fill="url(#tsG)" filter="url(#tsBlur)"/>
      <circle cx="120" cy="100" r="22" fill="#ff5a2c" opacity="0.7"/>
    </svg>
  ),
  hidden_drifter: (
    <svg viewBox="0 0 380 380">
      <defs>
        <radialGradient id="hd1" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#2a1f17"/><stop offset="100%" stopColor="#070504"/></radialGradient>
        <radialGradient id="hdG" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ff8a4a" stopOpacity="0.55"/><stop offset="100%" stopColor="#c93a16" stopOpacity="0"/></radialGradient>
        <filter id="hdBlur"><feGaussianBlur stdDeviation="8"/></filter>
      </defs>
      <rect width="380" height="380" fill="url(#hd1)"/>
      <ellipse cx="190" cy="380" rx="160" ry="20" fill="rgba(255,90,44,0.15)" filter="url(#hdBlur)"/>
      <path d="M 130 380 L 140 200 L 165 130 L 190 200 L 200 380 Z" fill="rgba(20,16,12,0.6)" stroke="rgba(255,90,44,0.25)" strokeWidth="0.6" filter="url(#hdBlur)" opacity="0.6"/>
      <circle cx="165" cy="115" r="18" fill="rgba(20,16,12,0.6)" stroke="rgba(255,90,44,0.25)" strokeWidth="0.5" opacity="0.6"/>
      <path d="M 175 380 L 185 200 L 210 130 L 235 200 L 245 380 Z" fill="#0e0907" stroke="rgba(255,90,44,0.55)" strokeWidth="0.7"/>
      <circle cx="210" cy="115" r="20" fill="#0e0907" stroke="rgba(255,90,44,0.6)" strokeWidth="0.7"/>
      <line x1="175" y1="380" x2="175" y2="120" stroke="rgba(255,90,44,0.4)" strokeWidth="0.5"/>
      <ellipse cx="180" cy="270" rx="20" ry="160" fill="url(#hdG)" filter="url(#hdBlur)" opacity="0.5"/>
    </svg>
  ),
  strategic_operator: (
    <svg viewBox="0 0 380 380">
      <defs>
        <radialGradient id="so1" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#2a1f17"/><stop offset="100%" stopColor="#070504"/></radialGradient>
        <radialGradient id="soG" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ff8a4a" stopOpacity="0.6"/><stop offset="100%" stopColor="#c93a16" stopOpacity="0"/></radialGradient>
        <filter id="soBlur"><feGaussianBlur stdDeviation="6"/></filter>
      </defs>
      <rect width="380" height="380" fill="url(#so1)"/>
      <ellipse cx="190" cy="370" rx="150" ry="20" fill="rgba(255,90,44,0.2)" filter="url(#soBlur)"/>
      <path d="M 130 370 L 150 220 L 170 140 L 185 110 L 195 110 L 210 140 L 230 220 L 250 370 Z" fill="#0e0907" stroke="rgba(255,90,44,0.65)" strokeWidth="0.8"/>
      <circle cx="190" cy="100" r="22" fill="#0e0907" stroke="rgba(255,90,44,0.7)" strokeWidth="0.8"/>
      <circle cx="190" cy="100" r="50" fill="none" stroke="rgba(255,90,44,0.4)" strokeWidth="0.5"/>
      <circle cx="190" cy="200" r="120" fill="url(#soG)" filter="url(#soBlur)" opacity="0.4"/>
    </svg>
  ),
  force_multiplier: (
    <svg viewBox="0 0 380 380">
      <defs>
        <radialGradient id="fm1" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#2a1f17"/><stop offset="100%" stopColor="#070504"/></radialGradient>
        <radialGradient id="fmG" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffab2b" stopOpacity="0.7"/><stop offset="100%" stopColor="#c93a16" stopOpacity="0"/></radialGradient>
        <filter id="fmBlur"><feGaussianBlur stdDeviation="10"/></filter>
      </defs>
      <rect width="380" height="380" fill="url(#fm1)"/>
      <circle cx="190" cy="170" r="140" fill="url(#fmG)" filter="url(#fmBlur)"/>
      <ellipse cx="190" cy="350" rx="120" ry="14" fill="rgba(255,90,44,0.3)" filter="url(#fmBlur)"/>
      <path d="M 150 350 L 165 200 L 180 130 L 200 130 L 215 200 L 230 350 Z" fill="#0e0907" stroke="rgba(255,138,74,0.8)" strokeWidth="1"/>
      <circle cx="190" cy="118" r="18" fill="#0e0907" stroke="rgba(255,138,74,0.85)" strokeWidth="1"/>
    </svg>
  )
};

// ─── Scene renderers ─────────────────────────────────────────

function LandingScene({ scene, onNext }) {
  return (
    <div className="sfa-scene-inner sfa-layout-centered" style={{ maxWidth: 900 }}>
      <div style={{ textAlign: 'center', position: 'relative' }}>
        <Choreo id="sun-arcs" />
        <div className="sfa-eyebrow sfa-reveal-word">{scene.locationLabel}</div>
        <h1 className="sfa-landing-title" style={{ marginTop: 36 }}>
          {scene.title.map((w, i) => (
            <span key={i} className="sfa-reveal-word" style={{ transitionDelay: `${i * 120 + 400}ms` }}
              dangerouslySetInnerHTML={{ __html: w + ' ' }}
            />
          ))}
        </h1>
        <div className="sfa-landing-sub sfa-reveal-word" style={{ transitionDelay: '1400ms' }}>{scene.sub}</div>
        <div className="sfa-framing-note sfa-reveal-word" style={{ transitionDelay: '1800ms', marginTop: 48, textAlign: 'left', maxWidth: 540, margin: '48px auto 0' }}>{scene.note}</div>
        <button className="sfa-landing-cta sfa-reveal-word" style={{ transitionDelay: '2200ms' }} onClick={onNext}>
          <span>{scene.cta}</span>
          <span className="arrow"></span>
        </button>
      </div>
      <div className="sfa-landing-meta">est. 12 minutes · 36 questions · 4 closing reflections</div>
    </div>
  );
}

function IntakeScene({ scene, onSubmit }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const ready = firstName.trim().length >= 1 && lastName.trim().length >= 1 && emailOk && gender;

  const handleSubmit = () => {
    if (!firstName.trim()) { setError('First name is required.'); return; }
    if (!lastName.trim()) { setError('Last name is required.'); return; }
    if (!emailOk) { setError('Please enter a valid email.'); return; }
    if (!gender) { setError('Please choose how we should address you.'); return; }
    onSubmit({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), gender });
  };

  const genders = [
    { key: 'she', label: 'She / Her', sub: 'female-presenting character' },
    { key: 'he', label: 'He / Him', sub: 'male-presenting character' },
    { key: 'they', label: 'They / Them', sub: 'androgynous-presenting character' }
  ];

  return (
    <div className="sfa-scene-inner sfa-layout-centered">
      <div className="sfa-intake-block">
        <Choreo id="grid" />
        <div className="sfa-eyebrow sfa-reveal-word">{scene.eyebrow}</div>
        <h2 className="sfa-display sfa-reveal-word" style={{ fontSize: 'clamp(28px,3.6vw,52px)', fontStyle: 'italic', margin: '8px 0 4px', transitionDelay: '300ms' }}>{scene.title}</h2>
        <div className="sfa-body-text sfa-reveal-word" style={{ fontStyle: 'italic', fontFamily: 'var(--serif)', fontSize: 17, color: 'var(--ink-mute)', transitionDelay: '600ms' }}>{scene.sub}</div>

        <div className="sfa-intake-grid" style={{ marginTop: 32 }}>
          <div className="sfa-intake-field sfa-reveal-word" style={{ transitionDelay: '900ms' }}>
            <label className="sfa-intake-label">First name</label>
            <input className="sfa-intake-input" type="text" placeholder="What we will call you"
              value={firstName} onChange={e => setFirstName(e.target.value)} />
          </div>
          <div className="sfa-intake-field sfa-reveal-word" style={{ transitionDelay: '1050ms' }}>
            <label className="sfa-intake-label">Last name</label>
            <input className="sfa-intake-input" type="text" placeholder=""
              value={lastName} onChange={e => setLastName(e.target.value)} />
          </div>
          <div className="sfa-intake-field full sfa-reveal-word" style={{ transitionDelay: '1200ms' }}>
            <label className="sfa-intake-label">Email</label>
            <input className="sfa-intake-input" type="email" placeholder="your@email"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>

        <div className="sfa-intake-field full sfa-reveal-word" style={{ transitionDelay: '1400ms', marginTop: 12 }}>
          <label className="sfa-intake-label">How should we address you, and render your character?</label>
          <div className="sfa-intake-gender">
            {genders.map(g => (
              <div key={g.key} className={`sfa-intake-gender-opt${gender === g.key ? ' selected' : ''}`}
                onClick={() => setGender(g.key)}>
                <span className="opt-label">{g.label}</span>
                <span className="opt-sub">{g.sub}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sfa-intake-consent sfa-reveal-word" style={{ transitionDelay: '1700ms' }}>
          Your details stay on this device. They are used to personalise the story and your result.
        </div>
        {error && <div className="sfa-intake-error">{error}</div>}

        <div className="sfa-reveal-word" style={{ transitionDelay: '2100ms' }}>
          <button className={`sfa-q-advance${ready ? ' ready' : ''}`} onClick={handleSubmit}>
            <span>Enter the chamber</span>
            <span className="arrow"></span>
          </button>
        </div>
      </div>
    </div>
  );
}

function CrawlScene({ scene }) {
  const style = scene.crawlStyle || 'film';

  if (style === 'briefing') {
    return (
      <>
        <div className="sfa-brief-scanlines"></div>
        <div className="sfa-brief-preamble">{scene.preamble || ''}</div>
        <div className="sfa-brief-title">
          <div className="sfa-brief-meta">{scene.episode || 'Prologue'}</div>
          <h1 className="sfa-brief-title-main">{(scene.title || []).join(' ')}</h1>
        </div>
        <div className="sfa-brief-cards">
          {(scene.paragraphs || []).slice(0, 3).map((p, i) => (
            <div key={i} className="sfa-brief-card" style={{ animationDelay: `${10 + i * 8}s` }}>
              <div className="sfa-brief-card-num">{String(i + 1).padStart(2, '0')} / {Math.min(scene.paragraphs.length, 3).toString().padStart(2, '0')}</div>
              <div className="sfa-brief-card-body">{p}</div>
            </div>
          ))}
          <div className="sfa-brief-card brief-countdown" style={{ animationDelay: `${10 + Math.min((scene.paragraphs || []).length, 3) * 8}s` }}>
            <div className="sfa-brief-card-num">FINAL CHECK</div>
            <div className="sfa-brief-card-body" style={{ fontFamily: 'monospace', fontSize: 'clamp(20px,2.4vw,30px)', letterSpacing: '0.1em' }}>
              {scene.countdown || 'GO FOR PROLOGUE'}
            </div>
          </div>
        </div>
        <div className="sfa-brief-horizon"></div>
      </>
    );
  }

  if (style === 'scroll') {
    const verses = (scene.paragraphs || []).slice(0, 3);
    const defaultSeal = `<svg viewBox="0 0 200 200"><rect x="18" y="18" width="164" height="164" fill="#b53536" stroke="#7a1818" stroke-width="2"/></svg>`;
    return (
      <>
        <div className="sfa-scroll-paper"></div>
        <div className="sfa-scroll-preamble">{scene.preamble || ''}</div>
        <div className="sfa-scroll-frame">
          <div className="sfa-scroll-seal" dangerouslySetInnerHTML={{ __html: scene.markSvg || defaultSeal }} />
          <div className="sfa-scroll-title">{(scene.title || []).join(' ')}</div>
          <div className="sfa-scroll-meta">{scene.episode || ''}</div>
          <div className="sfa-scroll-divider"></div>
          <div className="sfa-scroll-verses">
            {verses.map((p, i) => (
              <div key={i} className="sfa-scroll-verse" style={{ animationDelay: `${10 + i * 8}s` }}>{p}</div>
            ))}
          </div>
          <div className="sfa-scroll-footer" style={{ animationDelay: `${10 + verses.length * 8}s` }}>{scene.countdown || ''}</div>
        </div>
        <div className="sfa-scroll-horizon"></div>
      </>
    );
  }

  if (style === 'broadsheet') {
    const paras = (scene.paragraphs || []).slice(0, 3);
    return (
      <>
        <div className="sfa-broad-paper"></div>
        <div className="sfa-broad-frame">
          <div className="sfa-broad-dateline">{scene.preamble || ''}</div>
          <div className="sfa-broad-mast">
            <div className="sfa-broad-rule"></div>
            <h1 className="sfa-broad-title">{(scene.title || []).join(' ')}</h1>
            <div className="sfa-broad-rule"></div>
            <div className="sfa-broad-byline">{scene.episode || ''}</div>
          </div>
          <div className="sfa-broad-columns">
            {paras.map((p, i) => (
              <div key={i} className="sfa-broad-column" style={{ animationDelay: `${5 + i * 8}s` }}>
                <div className="sfa-broad-column-no">No. {String(i + 1).padStart(2, '0')}</div>
                <div className="sfa-broad-leader">{p}</div>
              </div>
            ))}
          </div>
          <div className="sfa-broad-stamp" style={{ animationDelay: `${5 + paras.length * 8}s` }}>{scene.countdown || ''}</div>
        </div>
        <div className="sfa-broad-horizon"></div>
      </>
    );
  }

  // Default: film (Star Wars)
  return (
    <>
      <div className="sfa-crawl-stars"></div>
      <div className="sfa-crawl-preamble">{scene.preamble}</div>
      <div className="sfa-crawl-title-wrap">
        <div className="sfa-crawl-title-episode">{scene.episode}</div>
        <div className="sfa-crawl-title-main">
          {(scene.title || []).map((w, i) => <span key={i}>{w}</span>)}
        </div>
      </div>
      <div className="sfa-crawl-viewport">
        <div className="sfa-crawl-text">
          {(scene.paragraphs || []).map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>
      <div className="sfa-crawl-fade"></div>
      <div className="sfa-crawl-horizon"></div>
    </>
  );
}

function NarrativeScene({ scene, skinOverrides }) {
  const textBlock = (
    <div>
      {scene.eyebrow && <div className="sfa-eyebrow sfa-reveal-word">{scene.eyebrow}</div>}
      <h2 className="sfa-display" style={{ margin: '36px 0 32px', fontSize: 'clamp(32px,5.2vw,76px)' }}
        dangerouslySetInnerHTML={{ __html: wordRevealHTML(scene.body.join(' '), 200) }}
      />
      {(scene.bodyAfter || []).length > 0 && (
        <div className="sfa-body-text" style={{ maxWidth: 620, margin: 0, fontSize: 'clamp(15px,1.4vw,20px)', lineHeight: 1.6 }}>
          {scene.bodyAfter.map((line, i) => (
            <p key={i} style={{ marginBottom: 14 }}
              dangerouslySetInnerHTML={{ __html: wordRevealHTML(line, 1500 + i * 1200) }}
            />
          ))}
        </div>
      )}
    </div>
  );

  if (scene.artId) {
    const layout = scene.layout || 'disc-left';
    const disc = <DiscArtEl key={scene.artId} artId={scene.artId} skinOverrides={skinOverrides} />;
    return (
      <div className="sfa-scene-inner" style={{
        display: 'grid', gap: 'clamp(40px,6vw,100px)', alignItems: 'center',
        gridTemplateColumns: 'minmax(280px,1fr) 1.3fr'
      }}>
        <Choreo id="converging" skinOverrides={skinOverrides} />
        {layout === 'disc-left' ? <>{disc}{textBlock}</> : <>{textBlock}{disc}</>}
      </div>
    );
  }

  return (
    <div className="sfa-scene-inner sfa-layout-centered">
      <Choreo id="converging" skinOverrides={skinOverrides} />
      {textBlock}
    </div>
  );
}

function NarrativeSceneQuote({ scene, skinOverrides }) {
  const layout = scene.layout || 'disc-right';
  const disc = <DiscArtEl key={scene.artId} artId={scene.artId} skinOverrides={skinOverrides} />;
  const text = (
    <div>
      <div className="sfa-narrative-quote"
        dangerouslySetInnerHTML={{ __html: wordRevealHTML(scene.quote, 400) + `<span class="speaker sfa-reveal-word" style="transition-delay:1800ms">${scene.speaker}</span>` }}
      />
    </div>
  );
  return (
    <div className="sfa-scene-inner" style={{
      display: 'grid', gap: 'clamp(40px,6vw,100px)', alignItems: 'center',
      gridTemplateColumns: 'minmax(280px,1fr) 1.3fr'
    }}>
      <Choreo id="converging" skinOverrides={skinOverrides} />
      {layout === 'disc-left' ? <>{disc}{text}</> : <>{text}{disc}</>}
    </div>
  );
}

function QuestionScene({ scene, savedAnswer, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [textVal, setTextVal] = useState('');

  useEffect(() => {
    if (savedAnswer !== undefined) {
      if (scene.kind === 'rating' || scene.kind === 'mc') setSelected(savedAnswer);
      if (scene.kind === 'ranking') setRanking(Array.isArray(savedAnswer) ? savedAnswer : []);
    }
  }, []);

  const handleRank = (idx) => {
    setRanking(prev => {
      const next = prev.includes(idx) ? prev.filter(x => x !== idx) : [...prev, idx];
      return next;
    });
  };

  const handleSubmit = () => {
    if (scene.kind === 'rating' && selected !== null) onAnswer(selected);
    else if (scene.kind === 'mc' && selected !== null) onAnswer(selected);
    else if (scene.kind === 'ranking' && ranking.length === scene.items.length) onAnswer(ranking.slice());
    else if (scene.kind === 'short-text') onAnswer(null, textVal);
  };

  const rankLabels = ['1st', '2nd', '3rd', '4th'];
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  const isReady = (
    (scene.kind === 'rating' && selected !== null) ||
    (scene.kind === 'mc' && selected !== null) ||
    (scene.kind === 'ranking' && ranking.length === scene.items.length) ||
    (scene.kind === 'short-text' && textVal.trim().length >= 3)
  );

  return (
    <div className="sfa-scene-inner sfa-layout-centered">
      <div className="sfa-question-block">
        <Choreo id="grid" />
        <div className="sfa-q-meta">
          <span className="practice sfa-reveal-word">{scene.practice || ''}</span>
          <span className="sfa-reveal-word">{scene.locationLabel}</span>
        </div>
        {scene.setup && (
          <div className="sfa-body-text sfa-reveal-word" style={{ marginBottom: 24, color: 'var(--ink-mute)', fontStyle: 'italic', fontFamily: 'var(--serif)', fontSize: 17 }}>
            {scene.setup}
          </div>
        )}
        <div className="sfa-q-prompt" dangerouslySetInnerHTML={{ __html: wordRevealHTML(scene.prompt, 200) }} />

        {scene.kind === 'rating' && (
          <div className="sfa-q-scale">
            {(scene.labels || []).map((label, i) => (
              <div key={i} className={`sfa-q-scale-item${selected === i ? ' selected' : ''}`} onClick={() => setSelected(i)}>
                <div className="sfa-q-scale-num">{i + 1}</div>
                <div className="sfa-q-scale-label">{label}</div>
              </div>
            ))}
          </div>
        )}

        {scene.kind === 'mc' && (
          <div className="sfa-q-options">
            {(scene.options || []).map((opt, i) => (
              <div key={i} className={`sfa-q-option${selected === i ? ' selected' : ''}`} onClick={() => setSelected(i)}>
                <div className="letter">{letters[i]}</div>
                <div className="copy">{opt.copy}</div>
              </div>
            ))}
          </div>
        )}

        {scene.kind === 'ranking' && (
          <>
            <div className="sfa-q-ranking-hint">Click items in the order you would prioritise — first to last.</div>
            <div className="sfa-q-ranking">
              {(scene.items || []).map((item, i) => {
                const rankPos = ranking.indexOf(i);
                const isAssigned = rankPos !== -1;
                return (
                  <div key={i} className={`sfa-q-ranking-item${isAssigned ? ' assigned' : ''}`} onClick={() => handleRank(i)}>
                    <div className={`sfa-q-ranking-rank${!isAssigned ? ' empty' : ''}`}>
                      {isAssigned ? (rankLabels[rankPos] || rankPos + 1) : '—'}
                    </div>
                    <div className="sfa-q-ranking-copy">{item.label}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {scene.kind === 'short-text' && (
          <>
            <textarea className="sfa-q-textarea" placeholder={scene.placeholder || ''}
              value={textVal} onChange={e => setTextVal(e.target.value)} />
            <div className="sfa-q-text-meta">{scene.hint}</div>
          </>
        )}

        <button className={`sfa-q-advance${isReady ? ' ready' : ''}`} onClick={handleSubmit}>
          <span>Continue</span>
          <span className="arrow"></span>
        </button>
      </div>
    </div>
  );
}

function MidpointScene({ scene, onSubmit }) {
  const [textVal, setTextVal] = useState('');

  return (
    <div className="sfa-scene-inner" style={{
      display: 'grid', gap: 'clamp(40px,6vw,100px)', alignItems: 'center',
      gridTemplateColumns: 'minmax(280px,1fr) 1.3fr'
    }}>
      <Choreo id="sun-arcs" />
      <DiscArtEl artId="twinSuns" />
      <div className="sfa-reflect-card">
        <div className="sfa-eyebrow sfa-reveal-word">{scene.eyebrow}</div>
        {scene.showIntro && (
          <div className="sfa-body-text sfa-reveal-word" style={{ margin: '32px 0 48px', transitionDelay: '600ms', fontSize: 'clamp(17px,1.4vw,22px)' }}
            dangerouslySetInnerHTML={{ __html: scene.intro }} />
        )}
        {!scene.showIntro && <div style={{ height: 24 }}></div>}
        <div className="sfa-reflect-prompt sfa-reveal-word" style={{ transitionDelay: `${scene.showIntro ? 1400 : 600}ms`, marginBottom: 24 }}
          dangerouslySetInnerHTML={{ __html: scene.prompt }} />
        <textarea className="sfa-q-textarea" placeholder={scene.placeholder}
          value={textVal} onChange={e => setTextVal(e.target.value)} />
        <div className="sfa-q-text-meta" style={{ fontStyle: 'italic', fontFamily: 'var(--serif)', fontSize: 14, color: 'var(--ink-mute)', textTransform: 'none', letterSpacing: '0.02em' }}>
          — {scene.hint}
        </div>
        <button className="sfa-q-advance ready" style={{ marginTop: 40 }}
          onClick={() => onSubmit(scene.key, textVal, scene.isLast)}>
          <span>{scene.isLast ? 'Continue the assessment' : 'Continue'}</span>
          <span className="arrow"></span>
        </button>
      </div>
    </div>
  );
}

function TwistScene({ scene }) {
  return (
    <div className="sfa-scene-inner sfa-layout-centered">
      <div style={{ maxWidth: 780 }}>
        <Choreo id="ripple" />
        <div className="sfa-eyebrow sfa-reveal-word">{scene.locationLabel}</div>
        <div className="sfa-twist-body" style={{ margin: '48px 0' }}>
          {(scene.body || []).map((p, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: wordRevealHTML(p, 400 + i * 600) }} />
          ))}
        </div>
        {scene.quote && (
          <div className="sfa-narrative-quote" style={{ marginTop: 48, maxWidth: 680 }}
            dangerouslySetInnerHTML={{ __html: wordRevealHTML(scene.quote, 3200) + `<span class="speaker sfa-reveal-word" style="transition-delay:4400ms">${scene.speaker}</span>` }}
          />
        )}
      </div>
    </div>
  );
}

function EndReflectionScene({ scene, onSubmit }) {
  const [textVal, setTextVal] = useState('');
  return (
    <div className="sfa-scene-inner sfa-layout-centered">
      <div className="sfa-question-block">
        <Choreo id="grid" />
        <div className="sfa-q-meta">
          <span className="practice sfa-reveal-word">{scene.eyebrow}</span>
          <span className="sfa-reveal-word">{scene.locationLabel}</span>
        </div>
        {scene.intro && (
          <div className="sfa-body-text sfa-reveal-word" style={{ marginBottom: 24, color: 'var(--ink-mute)', fontStyle: 'italic', fontFamily: 'var(--serif)', fontSize: 17 }}>
            {scene.intro}
          </div>
        )}
        <div className="sfa-q-prompt" dangerouslySetInnerHTML={{ __html: wordRevealHTML(scene.prompt, 200) }} />
        <textarea className="sfa-q-textarea" placeholder={scene.placeholder || ''}
          value={textVal} onChange={e => setTextVal(e.target.value)} />
        <div className="sfa-q-text-meta">Optional — saved with your result so you can return to it.</div>
        <button className="sfa-q-advance ready" onClick={() => onSubmit(scene.key, textVal)}>
          <span>Continue</span>
          <span className="arrow"></span>
        </button>
      </div>
    </div>
  );
}

function ResultsLaunchScene({ onShowResults }) {
  return (
    <div className="sfa-scene-inner sfa-layout-centered">
      <div>
        <Choreo id="web" />
        <div className="sfa-eyebrow sfa-reveal-word">YOUR RESULT IS READY</div>
        <h1 className="sfa-display" style={{ fontSize: 'clamp(40px,5vw,72px)', margin: '32px 0', fontStyle: 'italic', color: 'var(--ink)' }}
          dangerouslySetInnerHTML={{ __html: wordRevealHTML('The pattern, revealed.', 400) }}
        />
        <button className="sfa-landing-cta sfa-reveal-word" style={{ transitionDelay: '1400ms', marginTop: 24 }} onClick={onShowResults}>
          <span>Read your profile</span>
          <span className="arrow"></span>
        </button>
      </div>
    </div>
  );
}

// ─── RESULTS PAGE ────────────────────────────────────────────

const PRACTICE_ORDER = [
  'understand_self', 'master_emotions', 'embed_practices',
  'be_curious', 'listen_deeply', 'think_critically',
  'unlock_creativity', 'manage_uncertainty', 'future_focused',
  'act_decisively', 'collaborate_inclusively', 'influence_effortlessly'
];

function WheelSVG({ R, onSelect, onHover }) {
  const cx = 400, cy = 400, innerR = 110, baseR = 180, maxR = 360;
  const segAngle = 30 * Math.PI / 180;

  function pointAt(r, a) { return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }

  function arcSegment(r0, r1, a0, a1) {
    const [x0, y0] = pointAt(r0, a0);
    const [x1, y1] = pointAt(r0, a1);
    const [x2, y2] = pointAt(r1, a1);
    const [x3, y3] = pointAt(r1, a0);
    return `M ${x0} ${y0} A ${r0} ${r0} 0 0 1 ${x1} ${y1} L ${x2} ${y2} A ${r1} ${r1} 0 0 0 ${x3} ${y3} Z`;
  }

  const segments = PRACTICE_ORDER.map((key, i) => {
    const score = R.practices[key];
    const a0 = -Math.PI / 2 + i * segAngle;
    const a1 = a0 + segAngle;
    const scoreR = baseR + (score / 100) * (maxR - baseR);
    const fillOpacity = 0.18 + (score / 100) * 0.55;
    const d = arcSegment(innerR, scoreR, a0, a1);
    return { key, d, fillOpacity, score };
  });

  const rings = [25, 50, 75, 100].map(pct => baseR + (pct / 100) * (maxR - baseR));

  const spokes = PRACTICE_ORDER.map((_, i) => {
    const a = -Math.PI / 2 + i * segAngle;
    const [x1, y1] = pointAt(innerR, a);
    const [x2, y2] = pointAt(maxR, a);
    return { x1, y1, x2, y2 };
  });

  const levelArcs = [
    { L: 'L1', startIdx: 0 }, { L: 'L2', startIdx: 3 },
    { L: 'L3', startIdx: 6 }, { L: 'L4', startIdx: 9 }
  ].map(({ L, startIdx }) => {
    const a0 = -Math.PI / 2 + startIdx * segAngle;
    const a1 = a0 + 3 * segAngle;
    const midA = (a0 + a1) / 2;
    const r = maxR + 26;
    const [tx, ty] = pointAt(r, midA);
    const rot = (midA * 180 / Math.PI + 90);
    const rotFinal = (rot > 90 && rot < 270) ? rot + 180 : rot;
    return { L, tx, ty, rotFinal, name: FRAMEWORK.levels[L].name };
  });

  return (
    <svg viewBox="0 0 800 800" style={{ width: '100%', height: '100%', display: 'block', cursor: 'pointer' }}>
      <defs>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1310"/>
          <stop offset="100%" stopColor="#0a0807"/>
        </radialGradient>
      </defs>
      {rings.map((r, i) => (
        <circle key={i} className="sfa-wheel-ring" cx={cx} cy={cy} r={r}/>
      ))}
      {segments.map(({ key, d, fillOpacity, score }) => (
        <path key={key} className="sfa-wheel-segment"
          d={d}
          fill={`rgba(255,90,44,${fillOpacity.toFixed(3)})`}
          stroke="rgba(255,90,44,0.55)" strokeWidth="0.7"
          onClick={() => onSelect(key)}
          onMouseOver={() => onHover(key)}
        />
      ))}
      {spokes.map((s, i) => (
        <line key={i} className="sfa-wheel-spoke" x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}/>
      ))}
      <circle className="sfa-wheel-center-disk" cx={cx} cy={cy} r={innerR} fill="url(#centerGlow)"/>
      <text className="sfa-wheel-center-text" x={cx} y={cy - 32} textAnchor="middle"
        style={{ fontSize: 14, letterSpacing: '0.32em', textTransform: 'uppercase', fill: 'var(--ink-mute)', fontFamily: 'var(--sans)', fontWeight: 400 }}>
        Your wheel
      </text>
      <text className="sfa-wheel-center-text" x={cx} y={cy + 14} textAnchor="middle"
        style={{ fontSize: 38, fill: 'var(--amber)', fontStyle: 'italic', fontFamily: 'var(--serif)' }}>
        {R.overall}<tspan style={{ fontSize: 18, fill: 'var(--ink-mute)' }}>%</tspan>
      </text>
      <text className="sfa-wheel-center-text" x={cx} y={cy + 44} textAnchor="middle"
        style={{ fontSize: 9, fontFamily: 'var(--sans)', letterSpacing: '0.3em', fill: 'var(--ink-mute)', textTransform: 'uppercase' }}>
        {overallBand(R.overall)}
      </text>
      {levelArcs.map(({ L, tx, ty, rotFinal, name }) => (
        <text key={L}
          x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
          transform={`rotate(${rotFinal} ${tx} ${ty})`}
          style={{ fontSize: 13, fontStyle: 'italic', fill: 'var(--ink-mute)', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 300, fontFamily: 'var(--serif)', pointerEvents: 'none' }}>
          {name}
        </text>
      ))}
    </svg>
  );
}

function ResultsPage({ R, archKey, secondaryKey, reflections, onRestart, onDownload }) {
  const arch = ARCHETYPES[archKey];
  const secondary = secondaryKey ? SECONDARY_PATTERNS[secondaryKey] : null;
  const [selectedKey, setSelectedKey] = useState(null);
  const [showTiles, setShowTiles] = useState(false);

  const sortedP = Object.entries(R.practices).sort((a, b) => b[1] - a[1]);
  const top = sortedP[0];
  const bottom = sortedP[sortedP.length - 1];

  const secondaryHardTriggered = secondary && typeof secondary.trigger === 'function' && (function () {
    try { return !!secondary.trigger(R); } catch (e) { return false; }
  })();

  const handleSelect = (key) => setSelectedKey(prev => prev === key ? null : key);
  const handleHover = (key) => { if (!selectedKey) setSelectedKey(key); };

  const WheelDetail = () => {
    if (!selectedKey) return (
      <div className="sfa-wheel-detail">
        <div className="sfa-wheel-empty-hint">Hover or tap a segment. The longer the wedge, the stronger that practice — in your pattern.</div>
      </div>
    );
    const p = FRAMEWORK.practices[selectedKey];
    const score = R.practices[selectedKey];
    const band = bandFor(score);
    const copy = score >= 65 ? p.high : p.low;
    return (
      <div className="sfa-wheel-detail">
        <div className="sfa-wheel-detail-eyebrow">{FRAMEWORK.levels[p.level].num} · {FRAMEWORK.levels[p.level].name}</div>
        <div className="sfa-wheel-detail-name">{p.displayLong}</div>
        <div className="sfa-wheel-detail-row">
          <div className="sfa-wheel-detail-score">{score}<span style={{ fontSize: '0.4em', color: 'var(--ink-mute)', fontStyle: 'normal', letterSpacing: '0.1em', marginLeft: 4 }}>/100</span></div>
          <div className="sfa-wheel-detail-band">{band}</div>
        </div>
        <div className="sfa-wheel-detail-bar"><div className="fill" style={{ width: `${score}%` }}></div></div>
        <div className="sfa-wheel-detail-body" dangerouslySetInnerHTML={{ __html: copy }} />
      </div>
    );
  };

  return (
    <div className="sfa-results-inner">
      {/* HERO */}
      <div className="sfa-results-hero-grid">
        <div className="hero-left">
          <div className="sfa-hero-eyebrow">YOUR SCORE</div>
          <div className="sfa-hero-score-mini"><span className="pct">{R.overall}</span><span style={{ fontSize: '0.4em', color: 'var(--ink-mute)', letterSpacing: '0.05em' }}>%</span></div>
          <div className="sfa-hero-band-line">{arch.band.toUpperCase()}</div>
          <div className="sfa-hero-headline">{arch.headline}</div>
        </div>
        <div className="sfa-archetype-portrait">
          {ARCHETYPE_ART_SVG[archKey] || ARCHETYPE_ART_SVG.strategic_operator}
          <div className="pulse"></div>
        </div>
        <div className="hero-right">
          <div className="sfa-hero-eyebrow">YOUR ARCHETYPE</div>
          <div className="sfa-hero-arch-name">{arch.name}</div>
          {secondary && (
            <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid rgba(255,90,44,0.2)' }}>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 6 }}>
                {secondaryHardTriggered ? 'SECONDARY PATTERN · ACTIVE' : 'SECONDARY TILT · NEAREST'}
              </div>
              <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 'clamp(20px,2.2vw,28px)', color: 'var(--ink)', fontWeight: 300, lineHeight: 1.2 }}>{secondary.name}</div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 12, lineHeight: 1.6, color: 'var(--ink-soft)', marginTop: 6 }}>{secondary.headline}</div>
            </div>
          )}
          <div className="sfa-hero-headline">
            Your strongest practice is <em style={{ fontStyle: 'italic', color: 'var(--ink)' }}>{FRAMEWORK.practices[top[0]].displayLong}</em>.
            Your development edge is <em style={{ fontStyle: 'italic', color: 'var(--ink)' }}>{FRAMEWORK.practices[bottom[0]].displayLong}</em>.
          </div>
        </div>
      </div>

      {/* WHEEL */}
      <div className="sfa-results-section">
        <div className="sfa-results-section-title">Your Twelve Practices</div>
        <div className="sfa-results-section-display">
          The strategic mastery framework — yours, mapped.{' '}
          <span style={{ fontFamily: 'var(--sans)', fontSize: 14, letterSpacing: '0.04em', color: 'var(--ink-mute)', fontStyle: 'italic', textTransform: 'none' }}>
            Click any segment to read its detail.
          </span>
        </div>
        <div className="sfa-wheel-stage">
          <div className="sfa-wheel-wrap">
            <WheelSVG R={R} onSelect={handleSelect} onHover={handleHover} />
          </div>
          <WheelDetail />
        </div>
        <div className="sfa-practice-tiles-secondary" style={{ display: showTiles ? 'block' : 'none' }}>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 16 }}>ALL TWELVE — INDEX</div>
          <div className="sfa-practice-grid">
            {PRACTICE_ORDER.map(k => {
              const p = FRAMEWORK.practices[k];
              const score = R.practices[k];
              return (
                <div key={k} className="sfa-practice-tile">
                  <div className="label">{FRAMEWORK.levels[p.level].num} · {FRAMEWORK.levels[p.level].short}</div>
                  <div className="name">{p.displayLong}</div>
                  <div className="score">{score}<span style={{ fontSize: 13, fontFamily: 'var(--sans)', letterSpacing: '0.2em', marginLeft: 6, color: 'var(--ink-mute)' }}>/100</span></div>
                  <div className="bar"><div className="fill" style={{ width: showTiles ? `${score}%` : 0 }}></div></div>
                  <div className="band">{bandFor(score)}</div>
                  <div className="desc">{score >= 65 ? p.high : p.low}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button className="sfa-cta-btn ghost" onClick={() => setShowTiles(v => !v)}>
            {showTiles ? 'Hide the index' : 'Show all twelve as cards'}
          </button>
        </div>
      </div>

      {/* LEVEL RINGS */}
      <div className="sfa-results-section">
        <div className="sfa-results-section-title">Your Four Levels</div>
        <div className="sfa-results-section-display">Each level is the average of three practices.</div>
        <div className="sfa-level-pulse-grid">
          {Object.entries(R.levels).map(([k, v]) => {
            const L = FRAMEWORK.levels[k];
            const circ = 2 * Math.PI * 54;
            const target = circ - (v / 100) * circ;
            return (
              <div key={k} className="sfa-level-pulse">
                <div className="sfa-level-pulse-tag">{L.num}</div>
                <div className="sfa-level-pulse-ring">
                  <svg viewBox="0 0 120 120">
                    <circle className="sfa-level-pulse-track" cx="60" cy="60" r="54"/>
                    <circle className="sfa-level-pulse-fill" cx="60" cy="60" r="54"
                      style={{ strokeDashoffset: target }}/>
                  </svg>
                  <div className="sfa-level-pulse-center"><span className="num">{v}</span><span style={{ fontSize: 14, color: 'var(--ink-mute)', marginLeft: 2 }}>%</span></div>
                </div>
                <div className="sfa-level-pulse-name">{L.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RISK GAUGES */}
      <div className="sfa-results-section">
        <div className="sfa-results-section-title">Your Three Watchouts</div>
        <div className="sfa-results-section-display">Not failures — interpretive overlays that make the pattern legible.</div>
        <div className="sfa-risk-gauge-grid">
          {Object.entries(R.risks).map(([k, v]) => {
            const rc = RISK_COPY[k];
            const band = riskBand(v);
            const copy = v <= 30 ? rc.low : v <= 60 ? rc.mod : rc.high;
            const circumference = 2 * Math.PI * 36;
            const dashOffset = circumference - (v / 100) * circumference;
            return (
              <div key={k} className="sfa-risk-gauge">
                <div className="sfa-risk-gauge-header">
                  <div className="sfa-risk-gauge-icon"><RiskIcon k={k} /></div>
                  <div className="sfa-risk-gauge-name">{rc.name}</div>
                </div>
                <div className="sfa-risk-gauge-arc">
                  <div className="sfa-risk-gauge-arc-svg">
                    <svg viewBox="0 0 80 80">
                      <circle className="sfa-risk-gauge-arc-track" cx="40" cy="40" r="36"/>
                      <circle className="sfa-risk-gauge-arc-fill" cx="40" cy="40" r="36"
                        style={{ strokeDashoffset: dashOffset }}/>
                    </svg>
                  </div>
                  <div>
                    <div className="sfa-risk-gauge-value-num">{v}<span style={{ fontSize: 14, color: 'var(--ink-mute)', fontFamily: 'var(--sans)', letterSpacing: '0.2em', marginLeft: 4, fontStyle: 'normal' }}>/100</span></div>
                    <div className="sfa-risk-gauge-value-label">{band.name}</div>
                  </div>
                </div>
                <div className="sfa-risk-gauge-body" dangerouslySetInnerHTML={{ __html: copy + `<span class="sfa-risk-gauge-q">${rc.q}</span>` }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* PATTERN PROSE */}
      <div className="sfa-results-section">
        <div className="sfa-results-section-title">Your Pattern</div>
        <div className="sfa-results-body" dangerouslySetInnerHTML={{ __html: arch.body }} />
        <div className="sfa-results-section-display" style={{ marginTop: 32 }}
          dangerouslySetInnerHTML={{ __html: arch.risk }} />
      </div>

      {/* DEVELOPMENT FOCUS */}
      <div className="sfa-results-section">
        <div className="sfa-results-section-title">Your Development Focus</div>
        <div className="sfa-results-section-display" dangerouslySetInnerHTML={{ __html: arch.focus }} />
        <div className="sfa-results-body">{arch.next}</div>
      </div>

      {/* NEXT STEPS */}
      <div className="sfa-results-section">
        <div className="sfa-results-section-title">Next Steps — Practices To Test and Trial</div>
        <div className="sfa-results-section-display">Four small, concrete experiments. Pick one. Run it. Notice what shifts.</div>
        <div className="sfa-next-steps-grid">
          {(NEXT_STEPS[archKey] || []).map((step, i) => (
            <div key={i} className="sfa-next-step-card">
              <div className="sfa-next-step-num">No. {String(i + 1).padStart(2, '0')}</div>
              <div className="sfa-next-step-icon"><StepIcon k={step.icon} /></div>
              <div className="sfa-next-step-title">{step.title}</div>
              <div className="sfa-next-step-body">{step.body}</div>
              <div className="sfa-next-step-test">— {step.test}</div>
            </div>
          ))}
        </div>
      </div>

      {/* REFLECTIONS */}
      {Object.values(reflections).some(Boolean) && (
        <div className="sfa-results-section">
          <div className="sfa-results-section-title">Your Reflections</div>
          <div className="sfa-results-section-display">What you wrote — kept and returnable.</div>
          <div className="sfa-reflection-grid">
            {[
              { key: 'reflect_midpoint_thinking', title: 'Thinking', sub: 'Midpoint — what you noticed about how you think', icon: 'question' },
              { key: 'reflect_midpoint_feeling', title: 'Feeling', sub: 'Midpoint — what you noticed about how you feel', icon: 'mirror' },
              { key: 'reflect_midpoint_behaving', title: 'Behaving', sub: 'Midpoint — what you noticed about how you behave', icon: 'notice' },
              { key: 'reflect_strengths', title: 'Strengths', sub: 'Closing — where you felt most yourself', icon: 'multiply' },
              { key: 'reflect_beliefs', title: 'Beliefs', sub: 'Closing — a belief tested by the assessment', icon: 'reframe' },
              { key: 'reflect_mindset', title: 'Mindset', sub: 'Closing — the shift that would change everything', icon: 'doors' },
              { key: 'reflect_behaviour', title: 'Behaviour', sub: 'Closing — the 90-day practice to build', icon: 'experiment' }
            ].filter(r => reflections[r.key]).map(r => (
              <div key={r.key} className="sfa-reflection-card">
                <div className="icon"><StepIcon k={r.icon} /></div>
                <div className="title">{r.title}</div>
                <div className="sub">{r.sub}</div>
                <div className="body">{reflections[r.key]}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="sfa-cta-block">
        <div className="sfa-cta-line">Strategic capability is not fixed. It can be developed. Your result is a mirror, not a verdict.</div>
        <button className="sfa-cta-btn" onClick={onRestart}>Retake the assessment</button>
        <button className="sfa-cta-btn ghost" onClick={onDownload}>Download your profile</button>
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ─────────────────────────────────────────────
const ADMIN_SECONDARY_BASE_DEFAULT = 'hidden_drifter';

function AdminPanel({ onClose, onPreview }) {
  const [tab, setTab] = useState('archetypes');
  const [secondaryBase, setSecondaryBase] = useState(ADMIN_SECONDARY_BASE_DEFAULT);
  const tabs = ['archetypes', 'skins', 'results'];

  const renderArchetypes = () => (
    <div>
      <div className="sfa-admin-section-title">Switch between archetypes</div>
      <div className="sfa-admin-section-sub">Five score-band archetypes plus six secondary pattern overlays from the framework.</div>
      <div style={{ fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 12 }}>Primary · band-based</div>
      <div className="sfa-admin-arch-grid">
        {Object.entries(ARCHETYPES).map(([key, a]) => (
          <div key={key} className="sfa-admin-arch-card" onClick={() => onPreview(key, null)}>
            <div className="tag">{a.band}</div>
            <div className="name">{a.name}</div>
            <div className="head">{a.headline}</div>
            <div className="cta">Preview result →</div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--amber)', margin: '36px 0 12px' }}>Combine secondary with primary base</div>
      <div className="sfa-admin-base-pills">
        {Object.entries(ARCHETYPES).map(([key, a]) => (
          <button key={key} className={`sfa-admin-base-pill${secondaryBase === key ? ' active' : ''}`}
            onClick={() => setSecondaryBase(key)}>{a.name}</button>
        ))}
      </div>
      <div style={{ fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--amber)', margin: '24px 0 12px' }}>Secondary · pattern overlays</div>
      <div className="sfa-admin-arch-grid">
        {Object.entries(SECONDARY_PATTERNS).map(([key, p]) => (
          <div key={key} className="sfa-admin-arch-card" onClick={() => onPreview(secondaryBase, key)}>
            <div className="tag">Secondary pattern · overlay</div>
            <div className="name">{p.name}</div>
            <div className="head">{p.headline}</div>
            <div className="cta">Preview on chosen primary →</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="sfa-admin-panel open">
      <div className="sfa-admin-topbar">
        <div className="sfa-admin-brand">
          <span className="dot"></span>
          <span>Admin · </span>
          <span className="label">The Strategic Force Assessment</span>
        </div>
        <div className="sfa-admin-tabs">
          {tabs.map(t => (
            <button key={t} className={`sfa-admin-tab${tab === t ? ' active' : ''}`}
              onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
          ))}
        </div>
        <button className="sfa-admin-close" onClick={onClose}>Close · ESC</button>
      </div>
      <div className="sfa-admin-body">
        {tab === 'archetypes' && renderArchetypes()}
        {tab === 'skins' && (
          <div>
            <div className="sfa-admin-section-title">Story skins</div>
            <div className="sfa-admin-section-sub">Skins wrap the same 12-practice assessment in different stories. The Force Trial skin is the default.</div>
            <div className="sfa-admin-arch-grid">
              <div className="sfa-admin-arch-card" style={{ cursor: 'default', borderLeft: '2px solid var(--amber)' }}>
                <div className="tag">ACTIVE · DEFAULT</div>
                <div className="name">The Strategic Force Trial</div>
                <div className="head">Cinematic space-opera prologue · The Coalition vs Commander Marrick</div>
              </div>
            </div>
          </div>
        )}
        {tab === 'results' && (
          <div>
            <div className="sfa-admin-section-title">Results history</div>
            <div className="sfa-admin-section-sub">Session results are saved locally in your browser.</div>
            <div className="sfa-admin-empty">No completed sessions in this browser yet.</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN ASSESSMENT COMPONENT ───────────────────────────────

export default function Assessment() {
  const [scenes] = useState(() => SCENES_FORCE_TRIAL);
  const [current, setCurrent] = useState(0);
  const [user, setUser] = useState({ firstName: '', lastName: '', email: '', gender: 'they' });
  const [answers, setAnswers] = useState({});
  const [reflections, setReflections] = useState({});
  const [scores, setScores] = useState(initialScores);
  const [showResults, setShowResults] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null); // { archKey, secondaryKey, R }
  const [activeScene, setActiveScene] = useState(false);
  const [isWhooshing, setIsWhooshing] = useState(false);
  const timerRef = useRef(null);
  const whooshRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorGlowRef = useRef(null);
  const canvasRef = useRef(null);
  const particlesRef = useRef(null);
  const glowPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const mousePosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const glowAnimRef = useRef(null);
  const sceneKey = useRef(0);

  // ─── Personalized scenes helper
  const getScene = useCallback((idx) => {
    const raw = scenes[idx];
    if (!raw) return null;
    const flags = getRunningFlags(scores);
    const conditional = applyConditional(raw, flags);
    return personalizeScene(conditional, user);
  }, [scenes, scores, user]);

  // ─── Progress bar
  const totalQ = scenes.filter(s => s.type === 'question' || s.type === 'end-reflection').length;
  const doneQ = scenes.slice(0, current + 1).filter(s => s.type === 'question' || s.type === 'end-reflection').length;
  const progress = (doneQ / totalQ) * 100;

  // ─── Active scene mount/unmount with animation
  useEffect(() => {
    setIsWhooshing(false);
    setActiveScene(false);
    const t = setTimeout(() => setActiveScene(true), 80);
    return () => clearTimeout(t);
  }, [current]);

  // ─── Auto-advance for timed scenes
  useEffect(() => {
    const scene = getScene(current);
    if (!scene) return;
    const autoTypes = ['narrative', 'narrative-scene', 'twist', 'crawl'];
    if (autoTypes.includes(scene.type) && scene.duration) {
      if (scene.type === 'crawl') {
        whooshRef.current = setTimeout(() => setIsWhooshing(true), Math.max(0, scene.duration - 2400));
      }
      timerRef.current = setTimeout(() => goNext(), scene.duration);
    }
    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(whooshRef.current);
    };
  }, [current, user]);

  // ─── Navigation
  const goNext = useCallback(() => {
    clearTimeout(timerRef.current);
    clearTimeout(whooshRef.current);
    if (current < scenes.length - 1) {
      sceneKey.current++;
      setCurrent(c => c + 1);
      window.scrollTo(0, 0);
    }
  }, [current, scenes.length]);

  const goBack = useCallback(() => {
    if (current <= 0) return;
    clearTimeout(timerRef.current);
    clearTimeout(whooshRef.current);
    const newIdx = current - 1;
    const newScores = rebuildScores(scenes, Object.fromEntries(Object.entries(answers).filter(([k]) => +k < newIdx)));
    setScores(newScores);
    sceneKey.current++;
    setCurrent(newIdx);
  }, [current, answers, scenes]);

  const skipScene = () => {
    clearTimeout(timerRef.current);
    clearTimeout(whooshRef.current);
    const scene = getScene(current);
    if (scene && scene.type === 'crawl' && !isWhooshing) {
      setIsWhooshing(true);
      setTimeout(() => goNext(), 1600);
    } else {
      goNext();
    }
  };

  // ─── Answer handlers
  const handleAnswer = (value, textVal) => {
    const scene = getScene(current);
    const newAnswers = { ...answers, [current]: value };
    setAnswers(newAnswers);
    const newScores = rebuildScores(scenes, newAnswers);
    setScores(newScores);
    if (scene.kind === 'short-text') {
      setReflections(prev => ({ ...prev, [`midtext_${current}`]: textVal || '' }));
    }
    goNext();
  };

  const handleMidpoint = (key, textVal) => {
    setReflections(prev => ({ ...prev, [key]: textVal }));
    goNext();
  };

  const handleReflection = (key, textVal) => {
    setReflections(prev => ({ ...prev, [key]: textVal }));
    goNext();
  };

  // ─── Results
  const openResults = () => {
    setShowResults(true);
    document.querySelector('.sfa-stage')?.style?.setProperty('display', 'none');
    document.querySelector('.sfa-results-stage')?.scrollTo(0, 0);
    // Trigger gauge/ring animations after a tick
    setTimeout(() => {
      document.querySelectorAll('.sfa-level-pulse-fill').forEach(el => {
        if (el.dataset.target) el.style.strokeDashoffset = el.dataset.target;
      });
    }, 200);
  };

  const handleRestart = () => {
    setShowResults(false);
    setCurrent(0);
    setAnswers({});
    setReflections({});
    setScores(initialScores());
    setPreviewData(null);
    sceneKey.current++;
    document.querySelector('.sfa-stage')?.style?.removeProperty('display');
    window.scrollTo(0, 0);
  };

  const handleDownload = () => {
    const R = computeResults(scores);
    const arch = ARCHETYPES[pickArchetype(R)];
    const data = {
      overall_score: R.overall, archetype: arch.name, band: arch.band,
      practices: R.practices, levels: R.levels, risks: R.risks,
      reflections, completed: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'strategic-force-assessment-result.json'; a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Admin preview
  const handlePreview = (primary, secondary) => {
    const mockR = secondary
      ? (() => {
          const base = JSON.parse(JSON.stringify(MOCK_PROFILES[primary] || MOCK_PROFILES.hidden_drifter));
          const tune = {
            architect_of_order:     () => { base.risks.control_bias = 78; },
            the_justifier:          () => { base.risks.moral_drift = 70; },
            the_calm_blade:         () => { base.risks.detachment_pressure = 72; },
            the_consensus_seeker:   () => { base.practices.collaborate_inclusively = 86; base.practices.act_decisively = 48; },
            the_decisive_commander: () => { base.practices.act_decisively = 86; base.practices.listen_deeply = 48; },
            vision_under_strain:    () => { base.practices.future_focused = 86; base.practices.master_emotions = 48; }
          };
          if (tune[secondary]) tune[secondary]();
          return base;
        })()
      : MOCK_PROFILES[primary];
    setPreviewData({ archKey: primary, secondaryKey: secondary, R: mockR });
    setAdminOpen(false);
    setShowResults(true);
    if (!user.firstName) setUser({ firstName: 'Citizen', lastName: 'Preview', email: 'preview@local', gender: 'they' });
  };

  // ─── Particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => {
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.12,
      r: Math.random() * 1.2 + 0.3,
      a: Math.random() * 0.5 + 0.1
    }));

    let raf;
    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = window.innerWidth;
        if (p.x > window.innerWidth) p.x = 0;
        if (p.y < 0) p.y = window.innerHeight;
        if (p.y > window.innerHeight) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,90,44,${p.a * 0.4})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf); };
  }, []);

  // ─── Cursor glow animation
  useEffect(() => {
    const glow = () => {
      glowPosRef.current.x += (mousePosRef.current.x - glowPosRef.current.x) * 0.08;
      glowPosRef.current.y += (mousePosRef.current.y - glowPosRef.current.y) * 0.08;
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.left = glowPosRef.current.x + 'px';
        cursorGlowRef.current.style.top = glowPosRef.current.y + 'px';
      }
      glowAnimRef.current = requestAnimationFrame(glow);
    };
    glowAnimRef.current = requestAnimationFrame(glow);
    return () => cancelAnimationFrame(glowAnimRef.current);
  }, []);

  // ─── Mouse tracking
  useEffect(() => {
    const onMove = (e) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
    };
    const onOver = (e) => {
      if (e.target.matches('button,.sfa-q-option,.sfa-q-scale-item,.sfa-q-ranking-item,.sfa-landing-cta,.sfa-cta-btn,a,textarea,.sfa-intake-gender-opt,.sfa-admin-arch-card,.sfa-admin-base-pill')) {
        cursorRef.current?.classList.add('hover');
      }
    };
    const onOut = (e) => {
      if (e.target.matches('button,.sfa-q-option,.sfa-q-scale-item,.sfa-q-ranking-item,.sfa-landing-cta,.sfa-cta-btn,a,textarea,.sfa-intake-gender-opt,.sfa-admin-arch-card,.sfa-admin-base-pill')) {
        cursorRef.current?.classList.remove('hover');
      }
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, []);

  // ─── Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && adminOpen) { setAdminOpen(false); return; }
      const scene = getScene(current);
      if (!scene) return;
      if ((e.key === 'Enter' || e.key === ' ') && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [adminOpen, current, getScene]);

  // ─── Compute results for display
  const R = previewData?.R || computeResults(scores);
  const archKey = previewData?.archKey || pickArchetype(R);
  const secondaryKey = previewData?.secondaryKey || pickSecondaryPattern(R);

  // ─── Current scene data
  const scene = getScene(current);
  const showBackBtn = current > 0 && scene && !['landing', 'intake', 'crawl', 'results-launch'].includes(scene.type);
  const showProgress = current > 0;
  const isCrawl = scene?.type === 'crawl';
  const isAutoScene = ['narrative', 'narrative-scene', 'twist', 'crawl'].includes(scene?.type);

  return (
    <div className={`sfa-root interactive${adminOpen ? ' admin-open' : ''}`}
      style={{ position: 'fixed', inset: 0 }}>
      {/* Atmosphere */}
      <div className="sfa-grain"></div>
      <div className="sfa-vignette"></div>
      <div className="sfa-gradient-wash"></div>
      <canvas ref={canvasRef} className="sfa-particles"></canvas>

      {/* Petal layer (Yi skin) */}
      <div className="sfa-petal-layer" id="sfaPetalLayer">
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="sfa-petal">
            <svg viewBox="0 0 20 20">
              <path d="M10 2 Q14 4 14 10 Q14 16 10 18 Q6 16 6 10 Q6 4 10 2 Z"/>
              <circle cx="10" cy="10" r="1.4"/>
            </svg>
          </div>
        ))}
      </div>

      {/* Custom cursor */}
      <div ref={cursorGlowRef} className="sfa-cursor-glow"></div>
      <div ref={cursorRef} className="sfa-cursor"></div>

      {/* Progress rail */}
      {showProgress && (
        <div className="sfa-progress-rail visible">
          <div className="fill" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      {/* Location tag */}
      <div className={`sfa-location-tag${showProgress && !isCrawl ? ' visible' : ''}`}>
        {scene?.locationLabel || ''}
      </div>

      {/* Back button */}
      {showBackBtn && (
        <button className="sfa-back-button visible" onClick={goBack} aria-label="Back">
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path d="M14 6 L8 12 L14 18" stroke="currentColor" strokeWidth="1.2" fill="none"/>
          </svg>
          <span>Back</span>
        </button>
      )}

      {/* Top-right logo */}
      <a className={`sfa-logo-tr${showProgress && !isCrawl ? ' visible' : ''}`}
        href="#" onClick={e => e.preventDefault()} aria-label="Mandarin">
        <svg viewBox="0 0 1500 240" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="mandarin-grad" x1="65.21" y1="148.81" x2="131.51" y2="113.83" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#ff6a1f"/>
              <stop offset="1" stopColor="#ff481d"/>
            </linearGradient>
          </defs>
          <path fill="#ff481d" d="M489.26,114.79v80.05H453.48V116.37c0-19.61-10.08-30.22-25.46-30.22-15.62,0-26.76,10.61-26.76,30.22v78.47H365.73V116.37c0-19.61-10.33-30.22-25.44-30.22-15.64,0-26.78,10.61-26.78,30.22v78.47H278l1.27-109.92-3.71-10.26,23.39-17.35,14.57,17.45c7.42-11.67,20.14-20.42,39.5-20.42,16.95,0,31.81,7.17,40.29,23.06,8-12.72,23.07-23.06,45.6-23.06,29.16,0,50.36,18.29,50.36,60.45"/>
          <path fill="#ff481d" d="M622.57,125.92c0-26-18.56-39.77-38.45-39.77s-38.44,14-38.44,39.77,18.56,39.76,38.44,39.76,38.45-13.78,38.45-39.76m-111.88,0c0-47.72,34.19-71.58,66.27-71.58,24.66,0,40.57,13.53,44,21.22h.78V57h35.53V194.84H621.76V176.29H621c-3.45,7.69-19.36,21.21-44,21.21-32.08,0-66.27-23.86-66.27-71.58"/>
          <path fill="#ff481d" d="M819.32,113.72v81.12H783.8V119.56c0-20.15-10.87-33.4-29.44-33.4-18.28,0-29.42,13.25-29.42,33.4v75.28H689.42V57h35.52V75.81c7.69-12.19,21.47-21.47,42.14-21.47,28.37,0,52.24,17.5,52.24,59.38"/>
          <path fill="#ff481d" d="M1277.28,55.4V89.34h0a51.87,51.87,0,0,0-9-.8c-26.77,0-43.47,18.56-43.47,46.14v60.17h-35.53V57h35.53v35.8c4.77-21.22,18.3-38.44,43.22-38.44a37.63,37.63,0,0,1,9.27,1"/>
          <path fill="#ff481d" d="M1301.19,194.84h35.54V57h-35.54Zm0-148.51h35.54V14.4h-35.54Z"/>
          <polygon fill="url(#mandarin-grad)" points="139.43 0 92.31 35.2 85.37 100.69 67.33 84.92 34.93 109.09 27.89 154.91 27.88 154.9 16.66 141.62 0 154.03 19.87 210 61.46 193.17 67.63 155.12 96.45 202.36 131.35 188.28 133.23 119.37 170.1 195.5 232.37 170.25 139.43 0"/>
        </svg>
      </a>

      {/* Timer ring */}
      {isAutoScene && scene?.duration && (
        <div className="sfa-timer-ring visible running" onClick={skipScene}
          style={{ '--duration': scene.duration + 'ms' }}>
          <svg viewBox="0 0 56 56">
            <circle className="track" cx="28" cy="28" r="26"/>
            <circle className="progress" cx="28" cy="28" r="26"
              style={{ animation: `sfa-ring-fill ${scene.duration}ms linear forwards` }}/>
          </svg>
          <span className="skip-label">SKIP</span>
        </div>
      )}

      {/* Bottom-left stack */}
      <div className={`sfa-bl-stack${showProgress && !isCrawl ? ' visible' : ''}`}>
        <div className="sfa-brand-mark">
          <span className="brand-dot"></span>
          <span className="brand-text">An assessment by <span className="brand-name">Mandarin</span></span>
        </div>
        <div className="sfa-bl-counter">
          <span className="label">SCENE</span>
          <span>{String(current + 1).padStart(2, '0')} · {scenes.length}</span>
        </div>
      </div>

      {/* Admin link */}
      <a className={`sfa-admin-link${showProgress ? ' visible' : ''}`}
        onClick={() => setAdminOpen(true)}>Admin</a>

      {/* Main stage */}
      <div className="sfa-stage" style={{ display: showResults ? 'none' : undefined }}>
        {scene && (
          <div key={sceneKey.current}
            className={`sfa-scene${activeScene ? ' active' : ''}${isCrawl ? ' sfa-crawl-scene' : ''}${isWhooshing ? ' whooshing' : ''}`}>
            {scene.type === 'landing' && (
              <LandingScene scene={scene} onNext={goNext} />
            )}
            {scene.type === 'intake' && (
              <IntakeScene scene={scene} onSubmit={(u) => { setUser(u); goNext(); }} />
            )}
            {scene.type === 'crawl' && (
              <CrawlScene scene={scene} />
            )}
            {scene.type === 'narrative' && (
              <NarrativeScene scene={scene} />
            )}
            {scene.type === 'narrative-scene' && (
              <NarrativeSceneQuote scene={scene} />
            )}
            {scene.type === 'question' && (
              <QuestionScene scene={scene} savedAnswer={answers[current]}
                onAnswer={handleAnswer} />
            )}
            {scene.type === 'midpoint' && (
              <MidpointScene scene={scene} onSubmit={handleMidpoint} />
            )}
            {scene.type === 'twist' && (
              <TwistScene scene={scene} />
            )}
            {scene.type === 'end-reflection' && (
              <EndReflectionScene scene={scene} onSubmit={handleReflection} />
            )}
            {scene.type === 'results-launch' && (
              <ResultsLaunchScene onShowResults={openResults} />
            )}
          </div>
        )}
      </div>

      {/* Results stage */}
      <div className={`sfa-results-stage${showResults ? ' active' : ''}`}>
        {showResults && (
          <ResultsPage
            R={R}
            archKey={archKey}
            secondaryKey={secondaryKey}
            reflections={reflections}
            onRestart={handleRestart}
            onDownload={handleDownload}
          />
        )}
      </div>

      {/* Admin */}
      {adminOpen && (
        <AdminPanel
          onClose={() => setAdminOpen(false)}
          onPreview={handlePreview}
        />
      )}
    </div>
  );
}