import React, { useState } from 'react';
import { FRAMEWORK } from '@/lib/sfa/engine';

const C = {
  orange: '#FF481D',
  black: '#1E1E23',
  white: '#FFFFFF',
  lightBg: '#F7F7F7',
  border: '#E8E8E8',
  text: '#1E1E23',
  muted: '#6B6B6B',
  inputBg: '#FAFAFA',
  panelBg: '#F4F4F4',
};

const ALL_PRACTICES = Object.entries(FRAMEWORK.practices).map(([k, v]) => ({ key: k, label: v.displayLong }));
const ALL_RISKS = Object.entries(FRAMEWORK.risks).map(([k, v]) => ({ key: k, label: v.name }));
const ALL_SCOREABLE = [...ALL_PRACTICES, ...ALL_RISKS];

const inputStyle = {
  background: C.inputBg,
  border: `1px solid ${C.border}`,
  color: C.text,
  padding: '7px 10px',
  fontSize: 13,
  fontFamily: "'Roboto', sans-serif",
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  borderRadius: 2,
};

function sceneLabel(s, i) {
  if (s.type === 'question') {
    const prompt = s.prompt || s.scaleStatement || s.scaleHigh || '';
    return prompt.length > 44 ? prompt.slice(0, 44) + '…' : prompt;
  }
  const t = Array.isArray(s.title) ? s.title.join(' ') : (s.title || '');
  const label = t || s.eyebrow || s.type;
  return label.length > 44 ? label.slice(0, 44) + '…' : label;
}

function typeIcon(s) {
  if (s.type === 'question') {
    if (s.kind === 'rating') return 'T';
    if (s.kind === 'mc') return '☰';
    if (s.kind === 'ranking') return '↕';
    if (s.kind === 'short-text') return '✎';
    return '?';
  }
  const map = { landing: '⌂', intake: '✎', crawl: '▶', narrative: '¶', 'narrative-scene': '❝', midpoint: '◎', twist: '↩', 'end-reflection': '✎', 'results-launch': '★' };
  return map[s.type] || '·';
}

// ─── SFA design tokens ───────────────────────────────────────────────────────
const SFA = {
  bg:        '#0c0a0a',
  panel:     '#1e1e23',
  ink:       '#ece5d7',
  inkSoft:   '#d6cdb9',
  inkMute:   '#b3a994',
  inkDim:    '#6b6354',
  amber:     '#ff5a2c',
  amberDeep: '#c93a16',
  serif:     '"Cormorant Garamond", "EB Garamond", Georgia, serif',
  sans:      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

// ─── Scene Preview ───────────────────────────────────────────────────────────
function ScenePreview({ scene }) {
  const wrapStyle = {
    background: SFA.bg,
    width: '100%',
    height: '100%',
    minHeight: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 56px',
    boxSizing: 'border-box',
    overflowY: 'auto',
    position: 'relative',
  };

  // Location tag
  const LocationTag = ({ label }) => label ? (
    <div style={{
      position: 'absolute', top: 28, left: 40,
      fontFamily: SFA.sans, fontSize: 10, letterSpacing: '0.4em',
      textTransform: 'uppercase', color: '#e6dfd1', opacity: 0.85,
      display: 'flex', alignItems: 'center', gap: 0,
    }}>
      <span style={{ display: 'inline-block', width: 24, height: 1, background: SFA.amber, marginRight: 12, verticalAlign: 'middle' }} />
      {label}
    </div>
  ) : null;

  if (scene.type === 'question') {
    return <QuestionPreview scene={scene} wrapStyle={wrapStyle} LocationTag={LocationTag} />;
  }

  if (scene.type === 'narrative' || scene.type === 'narrative-scene') {
    return <NarrativePreview scene={scene} wrapStyle={wrapStyle} LocationTag={LocationTag} />;
  }

  if (scene.type === 'landing') {
    return <LandingPreview scene={scene} wrapStyle={wrapStyle} LocationTag={LocationTag} />;
  }

  if (scene.type === 'midpoint' || scene.type === 'end-reflection') {
    return <ReflectionPreview scene={scene} wrapStyle={wrapStyle} LocationTag={LocationTag} />;
  }

  if (scene.type === 'twist') {
    return <TwistPreview scene={scene} wrapStyle={wrapStyle} LocationTag={LocationTag} />;
  }

  // Generic fallback for crawl, intake, results-launch, etc.
  const title = Array.isArray(scene.title) ? scene.title.join(' ') : (scene.title || '');
  const eyebrow = scene.eyebrow || scene.type;
  return (
    <div style={wrapStyle}>
      <LocationTag label={scene.locationLabel} />
      <div style={{ textAlign: 'center', maxWidth: 640 }}>
        {eyebrow && <div style={{ fontFamily: SFA.sans, fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: SFA.amber, marginBottom: 24 }}>{eyebrow}</div>}
        {title && <h2 style={{ fontFamily: SFA.serif, fontWeight: 300, fontSize: 'clamp(28px,3.5vw,52px)', color: SFA.ink, margin: 0, lineHeight: 1.08, letterSpacing: '-0.015em' }}>{title}</h2>}
        {scene.sub && <p style={{ fontFamily: SFA.sans, fontSize: 14, color: SFA.inkSoft, margin: '24px 0 0', lineHeight: 1.65, fontWeight: 300 }}>{scene.sub}</p>}
        {!title && !eyebrow && <div style={{ color: SFA.inkDim, fontStyle: 'italic', fontSize: 14 }}>Scene type: {scene.type}</div>}
      </div>
    </div>
  );
}

function LandingPreview({ scene, wrapStyle, LocationTag }) {
  const titleWords = Array.isArray(scene.title) ? scene.title : [scene.title || ''];
  return (
    <div style={wrapStyle}>
      <LocationTag label={scene.locationLabel} />
      <div style={{ textAlign: 'center', maxWidth: 800 }}>
        <div style={{ fontFamily: SFA.sans, fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: SFA.amber, marginBottom: 32 }}>
          {scene.locationLabel}
        </div>
        <h1 style={{
          fontFamily: SFA.serif, fontWeight: 300, fontSize: 'clamp(48px,7vw,96px)',
          lineHeight: 0.92, letterSpacing: '-0.025em', color: SFA.ink, margin: 0,
        }} dangerouslySetInnerHTML={{ __html: titleWords.join(' ') }} />
        {scene.sub && (
          <p style={{ fontFamily: SFA.sans, fontSize: 12, letterSpacing: '0.45em', textTransform: 'uppercase', color: SFA.inkMute, marginTop: 28, fontWeight: 400 }}>{scene.sub}</p>
        )}
        <div style={{
          marginTop: 48, display: 'inline-flex', alignItems: 'center', gap: 18,
          padding: '18px 32px', border: '1px solid rgba(255,90,44,0.35)',
          background: 'rgba(255,90,44,0.04)', color: SFA.ink,
          fontFamily: SFA.sans, fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase',
        }}>
          {scene.cta || 'Begin the assessment'}
          <span style={{ display: 'inline-block', width: 32, height: 1, background: SFA.amber, position: 'relative' }} />
        </div>
      </div>
    </div>
  );
}

function NarrativePreview({ scene, wrapStyle, LocationTag }) {
  const bodyWords = Array.isArray(scene.body) ? scene.body.join(' ') : (scene.body || '');
  const bodyAfter = scene.bodyAfter || [];
  const isQuote = scene.type === 'narrative-scene';

  return (
    <div style={wrapStyle}>
      <LocationTag label={scene.locationLabel} />
      <div style={{ maxWidth: 680, width: '100%' }}>
        {scene.eyebrow && (
          <div style={{ fontFamily: SFA.sans, fontSize: 11, letterSpacing: '0.5em', textTransform: 'uppercase', color: SFA.amber, marginBottom: 28 }}>{scene.eyebrow}</div>
        )}
        {isQuote ? (
          <>
            <div style={{ width: 60, height: 1, background: SFA.amber, marginBottom: 32 }} />
            <blockquote style={{
              fontFamily: SFA.serif, fontStyle: 'italic',
              fontSize: 'clamp(24px,3vw,42px)', fontWeight: 300,
              lineHeight: 1.22, color: SFA.ink, margin: 0,
            }} dangerouslySetInnerHTML={{ __html: scene.quote || '' }} />
            {scene.speaker && (
              <div style={{ fontFamily: SFA.sans, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: SFA.amber, marginTop: 28 }}>
                — {scene.speaker}
              </div>
            )}
          </>
        ) : (
          <>
            <h2 style={{
              fontFamily: SFA.serif, fontWeight: 300,
              fontSize: 'clamp(28px,4.5vw,64px)', lineHeight: 1.02,
              letterSpacing: '-0.015em', color: SFA.ink, margin: '0 0 28px',
            }} dangerouslySetInnerHTML={{ __html: bodyWords }} />
            {bodyAfter.map((line, i) => (
              <p key={i} style={{ fontFamily: SFA.sans, fontSize: 'clamp(13px,1.2vw,16px)', lineHeight: 1.7, fontWeight: 300, color: SFA.inkSoft, margin: '0 0 12px', maxWidth: 560 }}
                dangerouslySetInnerHTML={{ __html: line }} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function QuestionPreview({ scene, wrapStyle, LocationTag }) {
  const prompt = scene.prompt || scene.scaleStatement || '';
  const setup = scene.setup || scene.contextParagraph || '';
  const labels = scene.labels || scene.scaleLabels || ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'];
  const LETTERS = 'abcde fghijklmnopqrstuvwxyz'.split('').filter(l => l.trim());

  return (
    <div style={wrapStyle}>
      <LocationTag label={scene.locationLabel} />
      <div style={{ width: '100%', maxWidth: 680 }}>
        {/* Q meta */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontFamily: SFA.sans, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: SFA.amber }}>
            {scene.locationLabel}
          </div>
          <div style={{ fontFamily: SFA.sans, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: SFA.inkMute }}>
            {scene.kind}
          </div>
        </div>

        {/* Setup */}
        {setup && (
          <p style={{ fontFamily: SFA.sans, fontSize: 13, lineHeight: 1.65, fontWeight: 300, color: SFA.inkSoft, margin: '0 0 20px', letterSpacing: '0.01em' }}
            dangerouslySetInnerHTML={{ __html: setup }} />
        )}

        {/* Prompt */}
        {prompt && (
          <h2 style={{
            fontFamily: SFA.serif, fontSize: 'clamp(22px,2.8vw,38px)', fontWeight: 300,
            lineHeight: 1.22, letterSpacing: '-0.005em', color: SFA.ink, margin: '0 0 36px',
          }} dangerouslySetInnerHTML={{ __html: prompt }} />
        )}

        {/* Rating */}
        {scene.kind === 'rating' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {labels.map((label, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 20,
                padding: '16px 22px',
                border: '1px solid rgba(255,255,255,0.05)',
                background: 'rgba(255,255,255,0.01)',
                fontFamily: SFA.sans, fontSize: 13, lineHeight: 1.5, fontWeight: 300, color: SFA.inkSoft,
              }}>
                <span style={{ fontFamily: SFA.serif, fontSize: 20, fontStyle: 'italic', color: SFA.amber, flexShrink: 0, width: 22 }}>{i + 1}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* MC */}
        {scene.kind === 'mc' && Array.isArray(scene.options) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {scene.options.map((opt, i) => {
              const text = opt.copy || opt.label || opt.text || (typeof opt === 'string' ? opt : '');
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 22,
                  padding: '18px 24px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  background: 'rgba(255,255,255,0.01)',
                  fontFamily: SFA.sans, fontSize: 13, lineHeight: 1.55, fontWeight: 300, color: SFA.inkSoft,
                }}>
                  <span style={{ fontFamily: SFA.serif, fontSize: 20, fontStyle: 'italic', color: SFA.amber, flexShrink: 0, width: 22, lineHeight: 1, paddingTop: 2 }}>
                    {LETTERS[i]}
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: text }} />
                </div>
              );
            })}
          </div>
        )}

        {/* Ranking */}
        {scene.kind === 'ranking' && Array.isArray(scene.items) && (
          <>
            <div style={{ fontFamily: SFA.sans, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#e6dfd1', marginBottom: 14 }}>
              Drag to rank · first to last
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {scene.items.map((item, i) => {
                const text = item.label || item.text || (typeof item === 'string' ? item : '');
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 18,
                    padding: '16px 22px',
                    border: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(255,255,255,0.01)',
                    fontFamily: SFA.sans, fontSize: 13, lineHeight: 1.5, fontWeight: 300, color: SFA.inkSoft,
                  }}>
                    <span style={{ fontFamily: SFA.serif, fontSize: 24, fontStyle: 'italic', color: SFA.inkDim, width: 32, flexShrink: 0, lineHeight: 1 }}>—</span>
                    <span>{text}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Short text */}
        {scene.kind === 'short-text' && (
          <div style={{ borderBottom: '1px solid rgba(255,90,44,0.3)', paddingBottom: 16 }}>
            <div style={{ fontFamily: SFA.serif, fontSize: 20, fontStyle: 'italic', color: SFA.inkDim, fontWeight: 300 }}>
              {scene.placeholder || 'Write freely…'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ReflectionPreview({ scene, wrapStyle, LocationTag }) {
  return (
    <div style={wrapStyle}>
      <LocationTag label={scene.locationLabel} />
      <div style={{ maxWidth: 640, width: '100%' }}>
        {scene.eyebrow && (
          <div style={{ fontFamily: SFA.sans, fontSize: 11, letterSpacing: '0.5em', textTransform: 'uppercase', color: SFA.amber, marginBottom: 28 }}>{scene.eyebrow}</div>
        )}
        {scene.intro && (
          <p style={{ fontFamily: SFA.sans, fontSize: 13, lineHeight: 1.7, color: SFA.inkSoft, margin: '0 0 28px', fontWeight: 300 }} dangerouslySetInnerHTML={{ __html: scene.intro }} />
        )}
        <h2 style={{
          fontFamily: SFA.serif, fontSize: 'clamp(22px,2.8vw,38px)', fontWeight: 300,
          lineHeight: 1.25, color: SFA.ink, margin: '0 0 32px',
        }} dangerouslySetInnerHTML={{ __html: scene.prompt || '' }} />
        <div style={{ borderBottom: '1px solid rgba(255,90,44,0.3)', paddingBottom: 16 }}>
          <div style={{ fontFamily: SFA.serif, fontSize: 18, fontStyle: 'italic', color: SFA.inkDim, fontWeight: 300 }}>
            {scene.placeholder || 'Write freely…'}
          </div>
        </div>
        {scene.hint && (
          <div style={{ fontFamily: SFA.sans, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#e6dfd1', marginTop: 14 }}>{scene.hint}</div>
        )}
      </div>
    </div>
  );
}

function TwistPreview({ scene, wrapStyle, LocationTag }) {
  const body = Array.isArray(scene.body) ? scene.body : [];
  return (
    <div style={wrapStyle}>
      <LocationTag label={scene.locationLabel} />
      <div style={{ maxWidth: 680, width: '100%' }}>
        {body.map((line, i) => (
          <p key={i} style={{ fontFamily: SFA.serif, fontSize: 'clamp(18px,2.2vw,30px)', lineHeight: 1.35, fontWeight: 300, color: SFA.ink, margin: '0 0 0.8em' }}
            dangerouslySetInnerHTML={{ __html: line }} />
        ))}
        {scene.quote && (
          <>
            <div style={{ width: 60, height: 1, background: SFA.amber, margin: '32px 0 28px' }} />
            <blockquote style={{
              fontFamily: SFA.serif, fontStyle: 'italic',
              fontSize: 'clamp(20px,2.4vw,34px)', fontWeight: 300,
              lineHeight: 1.25, color: SFA.ink, margin: 0,
            }} dangerouslySetInnerHTML={{ __html: scene.quote }} />
            {scene.speaker && (
              <div style={{ fontFamily: SFA.sans, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: SFA.amber, marginTop: 22 }}>
                — {scene.speaker}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Right Panel — QUESTION tab ──────────────────────────────────────────────
function QuestionPanel({ scene, contentOverrides, skinId, setContent }) {
  const idx = scene._idx;
  const o = (contentOverrides[skinId] || {})[idx] || {};

  const update = (field, value) => {
    setContent(prev => ({
      ...prev,
      [skinId]: { ...(prev[skinId] || {}), [idx]: { ...((prev[skinId] || {})[idx] || {}), [field]: value } }
    }));
  };

  const isQuestion = scene.type === 'question';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 0' }}>
      {isQuestion && (
        <>
          <Field label="Prompt / Statement" value={o.prompt ?? scene.prompt ?? scene.scaleStatement ?? ''} onChange={v => update('prompt', v)} multiline />
          {scene.contextParagraph !== undefined && (
            <Field label="Context paragraph" value={o.contextParagraph ?? scene.contextParagraph ?? ''} onChange={v => update('contextParagraph', v)} multiline />
          )}
          {scene.locationLabel !== undefined && (
            <Field label="Location label" value={o.locationLabel ?? scene.locationLabel ?? ''} onChange={v => update('locationLabel', v)} />
          )}
        </>
      )}

      {!isQuestion && (
        <>
          {(scene.title !== undefined || Array.isArray(scene.title)) && (
            <Field label="Title" value={o.title ?? (Array.isArray(scene.title) ? scene.title.join(' ') : scene.title) ?? ''} onChange={v => update('title', v)} multiline />
          )}
          {scene.eyebrow !== undefined && (
            <Field label="Eyebrow" value={o.eyebrow ?? scene.eyebrow ?? ''} onChange={v => update('eyebrow', v)} />
          )}
          {scene.sub !== undefined && (
            <Field label="Sub" value={o.sub ?? scene.sub ?? ''} onChange={v => update('sub', v)} multiline />
          )}
          {scene.note !== undefined && (
            <Field label="Note" value={o.note ?? scene.note ?? ''} onChange={v => update('note', v)} multiline />
          )}
          {Array.isArray(scene.body) && (
            <Field label="Body (lines, ¶ separated)" value={o.body ?? scene.body.join(' ¶ ') ?? ''} onChange={v => update('body', v)} multiline />
          )}
          {Array.isArray(scene.paragraphs) && (
            <Field label="Paragraphs (¶ separated)" value={o.paragraphs ?? scene.paragraphs.join(' ¶ ') ?? ''} onChange={v => update('paragraphs', v)} multiline />
          )}
          {scene.locationLabel !== undefined && (
            <Field label="Location label" value={o.locationLabel ?? scene.locationLabel ?? ''} onChange={v => update('locationLabel', v)} />
          )}
        </>
      )}

      {/* Reset button */}
      {(contentOverrides[skinId] || {})[idx] && (
        <button onClick={() => setContent(prev => {
          const next = { ...(prev[skinId] || {}) };
          delete next[idx];
          return { ...prev, [skinId]: next };
        })} style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 600, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', padding: '7px 14px', cursor: 'pointer', borderRadius: 2, alignSelf: 'flex-start' }}>
          Reset to default
        </button>
      )}
    </div>
  );
}

// ─── Right Panel — ANSWERS tab ───────────────────────────────────────────────
function AnswersPanel({ scene, scoring, skinId, setScoring }) {
  if (scene.type !== 'question') {
    return <div style={{ padding: '24px 0', color: C.muted, fontStyle: 'italic', fontSize: 13 }}>No answer scoring for this scene type.</div>;
  }

  const idx = scene._idx;
  const skinScoring = scoring[skinId] || {};

  const getOverride = (key) => skinScoring[`${idx}.${key}`];
  const setOverride = (key, val) => {
    setScoring(prev => ({ ...prev, [skinId]: { ...(prev[skinId] || {}), [`${idx}.${key}`]: val } }));
  };

  if (scene.kind === 'rating') {
    const labels = scene.scaleLabels || ['Strongly disagree', 'Disagree', 'Neutral / Inconsistent', 'Agree', 'Strongly agree'];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '16px 0' }}>
        {labels.map((label, i) => {
          const baseScoring = scene.scoring?.[i + 1] || {};
          const overrideKey = `rating.${i + 1}`;
          const override = getOverride(overrideKey);
          // Parse current values: start from base, override with stored
          const current = override ? JSON.parse(override) : baseScoring;

          return (
            <AnswerScoreBlock
              key={i}
              label={`${i + 1} — ${label}`}
              scoreObj={current}
              baseScoreObj={baseScoring}
              onChange={obj => setOverride(overrideKey, JSON.stringify(obj))}
            />
          );
        })}
      </div>
    );
  }

  if (scene.kind === 'mc' && Array.isArray(scene.options)) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '16px 0' }}>
        {scene.options.map((opt, i) => {
          const label = opt.label || opt.text || (typeof opt === 'string' ? opt : `Option ${i + 1}`);
          const baseScoring = typeof opt.score === 'object' ? opt.score : {};
          const overrideKey = `mc.${i}`;
          const override = getOverride(overrideKey);
          const current = override ? JSON.parse(override) : baseScoring;
          return (
            <AnswerScoreBlock
              key={i}
              label={`${String.fromCharCode(65 + i)} — ${label}`}
              scoreObj={current}
              baseScoreObj={baseScoring}
              onChange={obj => setOverride(overrideKey, JSON.stringify(obj))}
            />
          );
        })}
      </div>
    );
  }

  if (scene.kind === 'ranking' && Array.isArray(scene.items)) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '16px 0' }}>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 8, lineHeight: 1.5 }}>
          Ranking scores are weighted by position. Edit the base score per item below.
        </div>
        {scene.items.map((item, i) => {
          const label = item.label || item.text || (typeof item === 'string' ? item : `Item ${i + 1}`);
          const baseScoring = typeof item.score === 'object' ? item.score : {};
          const overrideKey = `ranking.${i}`;
          const override = getOverride(overrideKey);
          const current = override ? JSON.parse(override) : baseScoring;
          return (
            <AnswerScoreBlock
              key={i}
              label={label}
              scoreObj={current}
              baseScoreObj={baseScoring}
              onChange={obj => setOverride(overrideKey, JSON.stringify(obj))}
            />
          );
        })}
      </div>
    );
  }

  return <div style={{ padding: '16px 0', color: C.muted, fontStyle: 'italic', fontSize: 13 }}>No scoreable answers for this question type.</div>;
}

function AnswerScoreBlock({ label, scoreObj, baseScoreObj, onChange }) {
  const [expanded, setExpanded] = useState(false);
  const nonZero = Object.entries(scoreObj).filter(([, v]) => v !== 0);

  const update = (key, val) => {
    onChange({ ...scoreObj, [key]: Number(val) });
  };

  const addScoring = (key) => {
    if (!scoreObj[key]) onChange({ ...scoreObj, [key]: 0 });
  };

  const hasOverrides = JSON.stringify(scoreObj) !== JSON.stringify(baseScoreObj);

  return (
    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, cursor: 'pointer' }}
        onClick={() => setExpanded(v => !v)}
      >
        <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.text }}>
          {label}
        </div>
        <span style={{ fontSize: 11, color: C.muted }}>{expanded ? '▲' : '▼'}</span>
      </div>

      {/* Summary when collapsed */}
      {!expanded && nonZero.length === 0 && (
        <div style={{ fontSize: 12, color: C.muted, fontStyle: 'italic' }}>No scores assigned</div>
      )}
      {!expanded && nonZero.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {nonZero.map(([k, v]) => {
            const prac = FRAMEWORK.practices[k] || FRAMEWORK.risks[k];
            const shortLabel = prac ? (prac.name || k) : k;
            return (
              <div key={k} style={{ background: 'rgba(255,72,29,0.08)', border: `1px solid rgba(255,72,29,0.2)`, borderRadius: 12, padding: '3px 10px', fontSize: 11, color: C.orange, fontFamily: "'Roboto', sans-serif" }}>
                {shortLabel}: {v > 0 ? `+${v}` : v}
              </div>
            );
          })}
        </div>
      )}

      {/* Expanded scoring fields */}
      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 4 }}>Scores</div>
          {ALL_SCOREABLE.filter(({ key }) => scoreObj[key] !== undefined).map(({ key, label: sLabel }) => (
            <div key={key} style={{ display: 'grid', gridTemplateColumns: '1fr 72px', gap: 8, alignItems: 'center' }}>
              <div style={{ fontSize: 12, color: C.text, fontFamily: "'Roboto', sans-serif" }}>{sLabel}</div>
              <input
                type="number"
                value={scoreObj[key] ?? 0}
                onChange={e => update(key, e.target.value)}
                style={{ ...inputStyle, textAlign: 'center', padding: '5px 8px' }}
              />
            </div>
          ))}

          {/* Add scoring dropdown */}
          <select
            onChange={e => { if (e.target.value) { addScoring(e.target.value); e.target.value = ''; } }}
            style={{ ...inputStyle, color: C.muted, marginTop: 4 }}
            defaultValue=""
          >
            <option value="">+ Add scoring dimension</option>
            {ALL_SCOREABLE.filter(({ key }) => scoreObj[key] === undefined).map(({ key, label: sLabel }) => (
              <option key={key} value={key}>{sLabel}</option>
            ))}
          </select>

          {hasOverrides && (
            <button
              onClick={() => onChange(baseScoreObj)}
              style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 600, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', padding: '5px 10px', cursor: 'pointer', borderRadius: 2, alignSelf: 'flex-start', marginTop: 4 }}
            >
              Reset
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main exported component ─────────────────────────────────────────────────
export default function QuestionEditor({ activeSkin, content, setContent, scoring, setScoring }) {
  const skinId = activeSkin.id;
  const scenes = (activeSkin.scenes || []).map((s, i) => ({ ...s, _idx: i }));

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [rightTab, setRightTab] = useState('question'); // 'question' | 'answers'

  const selected = scenes[selectedIdx];

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden', background: C.white }}>

      {/* ── Left: scene list ── */}
      <div style={{ width: 200, flexShrink: 0, borderRight: `1px solid ${C.border}`, overflowY: 'auto', background: C.white }}>
        <div style={{ padding: '12px 16px 8px', fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.muted, borderBottom: `1px solid ${C.border}` }}>
          Scenes
        </div>
        {scenes.map((s, i) => {
          const isActive = i === selectedIdx;
          const isQ = s.type === 'question';
          return (
            <button key={i} onClick={() => setSelectedIdx(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', textAlign: 'left',
                padding: '9px 14px',
                background: isActive ? 'rgba(255,72,29,0.07)' : 'transparent',
                borderLeft: `3px solid ${isActive ? C.orange : 'transparent'}`,
                border: 'none',
                borderBottom: `1px solid ${C.border}`,
                cursor: 'pointer',
                transition: 'background 0.1s',
              }}
            >
              <span style={{ width: 18, height: 18, flexShrink: 0, background: isQ ? 'rgba(255,72,29,0.12)' : C.lightBg, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: isQ ? C.orange : C.muted, fontWeight: 700 }}>
                {typeIcon(s)}
              </span>
              <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: isActive ? C.orange : C.text, lineHeight: 1.35, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {sceneLabel(s, i)}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Centre: preview ── */}
      <div style={{ flex: 1, minWidth: 0, background: SFA.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        {/* Thin status bar */}
        <div style={{ height: 36, background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,90,44,0.12)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 10, flexShrink: 0 }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,90,44,0.8)' }}>
            {selected?.type}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 14 }}>·</span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.2em', color: 'rgba(236,229,215,0.4)', textTransform: 'uppercase' }}>
            {selectedIdx + 1} / {scenes.length}
          </span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
          {selected && <ScenePreview scene={selected} />}
        </div>
      </div>

      {/* ── Right: editor panel ── */}
      <div style={{ width: 280, flexShrink: 0, borderLeft: `1px solid ${C.border}`, background: C.white, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
          {['question', 'answers'].map(t => (
            <button key={t} onClick={() => setRightTab(t)}
              style={{
                flex: 1, padding: '13px 8px',
                background: 'transparent',
                border: 'none',
                borderBottom: `2px solid ${rightTab === t ? C.orange : 'transparent'}`,
                color: rightTab === t ? C.orange : C.muted,
                fontFamily: "'Roboto Condensed', sans-serif",
                fontWeight: 700, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Panel content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 24px' }}>
          {selected && rightTab === 'question' && (
            <QuestionPanel scene={selected} contentOverrides={content} skinId={skinId} setContent={setContent} />
          )}
          {selected && rightTab === 'answers' && (
            <AnswersPanel scene={selected} scoring={scoring} skinId={skinId} setScoring={setScoring} />
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, multiline }) {
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div style={{ display: 'grid', gap: 4 }}>
      <label style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: C.muted }}>{label}</label>
      <Tag value={value || ''} onChange={e => onChange(e.target.value)}
        rows={multiline ? 3 : undefined}
        style={{ ...inputStyle, minHeight: multiline ? 68 : undefined, resize: multiline ? 'vertical' : undefined }} />
    </div>
  );
}