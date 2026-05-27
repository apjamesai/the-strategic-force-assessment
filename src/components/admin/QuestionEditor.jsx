import React, { useState } from 'react';
import { FRAMEWORK } from '@/lib/sfa/engine';

const LOGO_URL = 'https://media.base44.com/images/public/6a15850b10cbc3f2a02765fd/f1da5dcfe_Mandarin_Logo_Horizontal_Orange_Gradient.svg';

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

// ─── Scene Preview ───────────────────────────────────────────────────────────
function ScenePreview({ scene, contentOverrides, skinId }) {
  const o = (contentOverrides[skinId] || {})[scene._idx] || {};

  if (scene.type === 'question') {
    return <QuestionPreview scene={scene} />;
  }

  const title = o.title ?? (Array.isArray(scene.title) ? scene.title.join(' ') : scene.title) ?? '';
  const body = o.body ?? (Array.isArray(scene.body) ? scene.body.join(' ') : scene.body) ?? '';
  const sub = o.sub ?? scene.sub ?? '';
  const eyebrow = o.eyebrow ?? scene.eyebrow ?? '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px 48px', textAlign: 'center', gap: 16 }}>
      {eyebrow && <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontSize: 10, letterSpacing: '0.45em', textTransform: 'uppercase', color: C.orange }}>{eyebrow}</div>}
      {title && <h2 style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 'clamp(22px, 3vw, 36px)', color: C.text, margin: 0, lineHeight: 1.1 }}>{title}</h2>}
      {sub && <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, color: C.muted, margin: 0, maxWidth: 480 }}>{sub}</p>}
      {body && <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, color: C.muted, margin: 0, maxWidth: 540, lineHeight: 1.65 }}>{body}</p>}
      {!title && !body && !sub && !eyebrow && (
        <div style={{ color: C.muted, fontStyle: 'italic', fontSize: 13 }}>Scene type: {scene.type}</div>
      )}
    </div>
  );
}

function QuestionPreview({ scene }) {
  const prompt = scene.prompt || scene.scaleStatement || '';
  const context = scene.contextParagraph || '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '32px 48px', gap: 20 }}>
      {context && (
        <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: C.muted, textAlign: 'center', maxWidth: 480, margin: 0, lineHeight: 1.6 }}>{context}</p>
      )}
      {prompt && (
        <h2 style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 'clamp(18px, 2.5vw, 28px)', color: C.text, textAlign: 'center', margin: 0, maxWidth: 520, lineHeight: 1.2 }}>{prompt}</h2>
      )}

      {scene.kind === 'rating' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: '100%', maxWidth: 500 }}>
          {(scene.scaleLabels || ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree']).map((label, i) => (
            <div key={i} style={{ background: C.orange, color: C.white, padding: '14px 16px', textAlign: 'center', fontFamily: "'Roboto', sans-serif", fontSize: 13, borderRadius: 2 }}>
              {i + 1} — {label}
            </div>
          ))}
        </div>
      )}

      {scene.kind === 'mc' && Array.isArray(scene.options) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: 500 }}>
          {scene.options.map((opt, i) => (
            <div key={i} style={{ background: C.orange, color: C.white, padding: '12px 16px', fontFamily: "'Roboto', sans-serif", fontSize: 13, borderRadius: 2 }}>
              {String.fromCharCode(65 + i)}. {opt.label || opt.text || opt}
            </div>
          ))}
        </div>
      )}

      {scene.kind === 'ranking' && Array.isArray(scene.items) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: 500 }}>
          {scene.items.map((item, i) => (
            <div key={i} style={{ background: C.lightBg, border: `1px solid ${C.border}`, padding: '12px 16px', fontFamily: "'Roboto', sans-serif", fontSize: 13, borderRadius: 2, display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ color: C.muted, width: 20 }}>—</span>
              <span>{item.label || item.text || item}</span>
            </div>
          ))}
        </div>
      )}
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
          const label = opt.label || opt.text || `Option ${i + 1}`;
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
          const label = item.label || item.text || `Item ${i + 1}`;
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
      <div style={{ flex: 1, minWidth: 0, background: C.panelBg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Mini topbar */}
        <div style={{ height: 48, background: C.white, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 12 }}>
          <img src={LOGO_URL} alt="Mandarin" style={{ height: 22 }} />
          <span style={{ color: C.border, fontSize: 18 }}>|</span>
          <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: C.muted }}>
            Scene {selectedIdx + 1} of {scenes.length} · <span style={{ color: C.orange, fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700 }}>{selected?.type}</span>
          </span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {selected && <ScenePreview scene={selected} contentOverrides={content} skinId={skinId} />}
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