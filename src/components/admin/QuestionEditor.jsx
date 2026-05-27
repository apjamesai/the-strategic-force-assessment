import React, { useState, useMemo } from 'react';
import { FRAMEWORK } from '@/lib/sfa/engine';
import SfaPreview from './SfaPreview';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

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

// ─── SFA bg for centre panel chrome ──────────────────────────────────────────
const SFA_BG = '#0c0a0a';

function ScenePreview({ scene, skinTheme, overrides }) {
  // Merge content overrides into the scene so SfaPreview sees live edits
  const merged = useMemo(() => {
    if (!overrides) return scene;
    const o = overrides;
    const s = { ...scene };
    // Simple field overrides
    const simpleFields = ['locationLabel','eyebrow','sub','note','cta','title','body','quote','speaker','prompt','setup','placeholder','hint','intro','preamble','episode','practice'];
    simpleFields.forEach(f => { if (o[f] !== undefined) s[f] = o[f]; });
    // body / title as array
    if (o.title) s.title = o.title.split(' ');
    if (o.body) s.body = o.body.split(' ');
    // bodyAfter paragraphs
    if (scene.bodyAfter) {
      s.bodyAfter = scene.bodyAfter.map((l, i) => o[`bodyAfter_${i}`] !== undefined ? o[`bodyAfter_${i}`] : l);
    }
    // body lines for twist
    if (scene.type === 'twist' && scene.body) {
      s.body = scene.body.map((l, i) => o[`body_${i}`] !== undefined ? o[`body_${i}`] : l);
    }
    // crawl paragraphs
    if (scene.paragraphs) {
      s.paragraphs = scene.paragraphs.map((p, i) => o[`para_${i}`] !== undefined ? o[`para_${i}`] : p);
    }
    // rating labels
    if (scene.kind === 'rating' && scene.labels) {
      s.labels = scene.labels.map((l, i) => o[`label_${i}`] !== undefined ? o[`label_${i}`] : l);
    }
    // mc option copy
    if (scene.kind === 'mc' && scene.options) {
      s.options = scene.options.map((opt, i) => o[`option_${i}`] !== undefined ? { ...opt, copy: o[`option_${i}`] } : opt);
    }
    // ranking item labels
    if (scene.kind === 'ranking' && scene.items) {
      s.items = scene.items.map((item, i) => o[`item_${i}`] !== undefined ? { ...item, label: o[`item_${i}`] } : item);
    }
    return s;
  }, [scene, overrides]);

  return <SfaPreview scene={merged} skinTheme={skinTheme} />;
}

// ─── Right Panel — CONTENT tab ───────────────────────────────────────────────
function QuestionPanel({ scene, contentOverrides, skinId, setContent }) {
  const idx = scene._idx;
  const o = (contentOverrides[skinId] || {})[idx] || {};

  const update = (field, value) => {
    setContent(prev => ({
      ...prev,
      [skinId]: { ...(prev[skinId] || {}), [idx]: { ...((prev[skinId] || {})[idx] || {}), [field]: value } }
    }));
  };

  const hasOverrides = !!(contentOverrides[skinId] || {})[idx];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '16px 0' }}>

      {/* ── All scene types: location label ── */}
      {scene.locationLabel !== undefined && (
        <Field label="Location label" value={o.locationLabel ?? scene.locationLabel ?? ''} onChange={v => update('locationLabel', v)} />
      )}

      {/* ── LANDING ── */}
      {scene.type === 'landing' && <>
        <Field label="Title (words, space-separated)" value={o.title ?? (Array.isArray(scene.title) ? scene.title.join(' ') : scene.title) ?? ''} onChange={v => update('title', v)} multiline />
        <Field label="Sub (small caps below title)" value={o.sub ?? scene.sub ?? ''} onChange={v => update('sub', v)} multiline />
        <Field label="Note (framing note)" value={o.note ?? scene.note ?? ''} onChange={v => update('note', v)} multiline />
        <Field label="CTA button" value={o.cta ?? scene.cta ?? ''} onChange={v => update('cta', v)} />
      </>}

      {/* ── INTAKE ── */}
      {scene.type === 'intake' && <>
        <Field label="Eyebrow" value={o.eyebrow ?? scene.eyebrow ?? ''} onChange={v => update('eyebrow', v)} />
        <Field label="Title" value={o.title ?? scene.title ?? ''} onChange={v => update('title', v)} multiline />
        <Field label="Sub" value={o.sub ?? scene.sub ?? ''} onChange={v => update('sub', v)} multiline />
      </>}

      {/* ── CRAWL ── */}
      {scene.type === 'crawl' && <>
        <Field label="Preamble" value={o.preamble ?? scene.preamble ?? ''} onChange={v => update('preamble', v)} />
        <Field label="Title (words, space-separated)" value={o.title ?? (Array.isArray(scene.title) ? scene.title.join(' ') : scene.title) ?? ''} onChange={v => update('title', v)} />
        <Field label="Episode label" value={o.episode ?? scene.episode ?? ''} onChange={v => update('episode', v)} />
        {scene.paragraphs?.map((p, i) => (
          <Field key={i} label={`Paragraph ${i + 1}`} value={o[`para_${i}`] ?? p} onChange={v => update(`para_${i}`, v)} multiline />
        ))}
      </>}

      {/* ── NARRATIVE ── */}
      {scene.type === 'narrative' && <>
        <Field label="Eyebrow (act label)" value={o.eyebrow ?? scene.eyebrow ?? ''} onChange={v => update('eyebrow', v)} />
        <Field label="Body headline (words, space-separated)" value={o.body ?? (Array.isArray(scene.body) ? scene.body.join(' ') : scene.body) ?? ''} onChange={v => update('body', v)} />
        {(scene.bodyAfter || []).map((line, i) => (
          <Field key={i} label={`Body paragraph ${i + 1}`} value={o[`bodyAfter_${i}`] ?? line} onChange={v => update(`bodyAfter_${i}`, v)} multiline />
        ))}
      </>}

      {/* ── NARRATIVE-SCENE (quote) ── */}
      {scene.type === 'narrative-scene' && <>
        <Field label="Quote" value={o.quote ?? scene.quote ?? ''} onChange={v => update('quote', v)} multiline />
        <Field label="Speaker" value={o.speaker ?? scene.speaker ?? ''} onChange={v => update('speaker', v)} />
      </>}

      {/* ── TWIST ── */}
      {scene.type === 'twist' && <>
        {(scene.body || []).map((line, i) => (
          <Field key={i} label={`Body line ${i + 1}`} value={o[`body_${i}`] ?? line} onChange={v => update(`body_${i}`, v)} multiline />
        ))}
        <Field label="Quote" value={o.quote ?? scene.quote ?? ''} onChange={v => update('quote', v)} multiline />
        <Field label="Speaker" value={o.speaker ?? scene.speaker ?? ''} onChange={v => update('speaker', v)} />
      </>}

      {/* ── MIDPOINT ── */}
      {scene.type === 'midpoint' && <>
        <Field label="Eyebrow" value={o.eyebrow ?? scene.eyebrow ?? ''} onChange={v => update('eyebrow', v)} />
        {scene.showIntro && <Field label="Intro paragraph" value={o.intro ?? scene.intro ?? ''} onChange={v => update('intro', v)} multiline />}
        <Field label="Prompt" value={o.prompt ?? scene.prompt ?? ''} onChange={v => update('prompt', v)} multiline />
        <Field label="Placeholder (textarea ghost text)" value={o.placeholder ?? scene.placeholder ?? ''} onChange={v => update('placeholder', v)} />
        <Field label="Hint" value={o.hint ?? scene.hint ?? ''} onChange={v => update('hint', v)} />
      </>}

      {/* ── END-REFLECTION ── */}
      {scene.type === 'end-reflection' && <>
        <Field label="Eyebrow" value={o.eyebrow ?? scene.eyebrow ?? ''} onChange={v => update('eyebrow', v)} />
        {scene.intro !== undefined && <Field label="Intro paragraph" value={o.intro ?? scene.intro ?? ''} onChange={v => update('intro', v)} multiline />}
        <Field label="Prompt" value={o.prompt ?? scene.prompt ?? ''} onChange={v => update('prompt', v)} multiline />
        <Field label="Placeholder" value={o.placeholder ?? scene.placeholder ?? ''} onChange={v => update('placeholder', v)} />
      </>}

      {/* ── QUESTION ── */}
      {scene.type === 'question' && <>
        <Field label="Practice label" value={o.practice ?? scene.practice ?? ''} onChange={v => update('practice', v)} />
        <Field label="Setup (context italic text)" value={o.setup ?? scene.setup ?? ''} onChange={v => update('setup', v)} multiline />
        <Field label="Prompt / Question" value={o.prompt ?? scene.prompt ?? ''} onChange={v => update('prompt', v)} multiline />

        {/* Rating: editable labels */}
        {scene.kind === 'rating' && (scene.labels || []).map((label, i) => (
          <Field key={i} label={`Scale label ${i + 1}`} value={o[`label_${i}`] ?? label} onChange={v => update(`label_${i}`, v)} />
        ))}

        {/* MC: editable option copy */}
        {scene.kind === 'mc' && (scene.options || []).map((opt, i) => (
          <Field key={i} label={`Option ${String.fromCharCode(65 + i)}`} value={o[`option_${i}`] ?? opt.copy ?? opt.label ?? ''} onChange={v => update(`option_${i}`, v)} multiline />
        ))}

        {/* Ranking: editable item labels */}
        {scene.kind === 'ranking' && (scene.items || []).map((item, i) => (
          <Field key={i} label={`Item ${i + 1}`} value={o[`item_${i}`] ?? item.label ?? ''} onChange={v => update(`item_${i}`, v)} multiline />
        ))}

        {/* Short-text */}
        {scene.kind === 'short-text' && <>
          <Field label="Placeholder" value={o.placeholder ?? scene.placeholder ?? ''} onChange={v => update('placeholder', v)} />
          <Field label="Hint" value={o.hint ?? scene.hint ?? ''} onChange={v => update('hint', v)} />
        </>}
      </>}

      {/* Reset button */}
      {hasOverrides && (
        <button onClick={() => setContent(prev => {
          const next = { ...(prev[skinId] || {}) };
          delete next[idx];
          return { ...prev, [skinId]: next };
        })} style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 600, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', padding: '7px 14px', cursor: 'pointer', borderRadius: 2, alignSelf: 'flex-start', marginTop: 4 }}>
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
          const label = opt.copy || opt.label || opt.text || (typeof opt === 'string' ? opt : `Option ${i + 1}`);
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

function NewQuestionModal({ onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: C.white, borderRadius: 4, padding: 28, width: 320, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
        <h2 style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 18, color: C.text, marginBottom: 20, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
          Add Question
        </h2>
        <div style={{ display: 'grid', gap: 8, marginBottom: 20 }}>
          {['mc', 'rating', 'ranking', 'short-text'].map(t => (
            <button key={t} onClick={() => { alert(`Create new ${t} question – TODO`); onClose(); }}
              style={{
                padding: '12px 14px',
                background: 'transparent',
                border: `1px solid ${C.border}`,
                borderTop: `2px solid ${C.orange}`,
                color: C.text,
                fontFamily: "'Roboto Condensed', sans-serif",
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,72,29,0.07)'; e.currentTarget.style.borderColor = C.orange; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = C.border; }}
            >
              {t === 'mc' ? 'Multiple Choice' : t === 'rating' ? 'Rating Scale' : t === 'ranking' ? 'Ranking' : 'Short Text'}
            </button>
          ))}
        </div>
        <button onClick={onClose}
          style={{
            width: '100%',
            padding: '10px 14px',
            background: 'transparent',
            border: `1px solid ${C.border}`,
            color: C.muted,
            fontFamily: "'Roboto Condensed', sans-serif",
            fontWeight: 600,
            fontSize: 10,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = C.text; e.currentTarget.style.borderColor = C.text; }}
          onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border; }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Main exported component ─────────────────────────────────────────────────
export default function QuestionEditor({ activeSkin, content, setContent, scoring, setScoring }) {
  const skinId = activeSkin.id;
  const scenes = (activeSkin.scenes || []).map((s, i) => ({ ...s, _idx: i }));

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [rightTab, setRightTab] = useState('question'); // 'question' | 'answers'
  const [showNewQuestionModal, setShowNewQuestionModal] = useState(false);

  const selected = scenes[selectedIdx];

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.index === destination.index) return;
    // TODO: reorder scenes in parent
  };

  return (
    <>
      {showNewQuestionModal && <NewQuestionModal onClose={() => setShowNewQuestionModal(false)} />}
      <div style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden', background: C.white }}>

        {/* ── Left: scene list ── */}
      <div style={{ width: 200, flexShrink: 0, borderRight: `1px solid ${C.border}`, background: C.white, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '12px 16px 8px', fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.muted, borderBottom: `1px solid ${C.border}` }}>
          Questions
        </div>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="scenes">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps} style={{ flex: 1, overflowY: 'auto', background: snapshot.isDraggingOver ? 'rgba(255,72,29,0.04)' : 'transparent' }}>
                {scenes.map((s, i) => {
                  const isActive = i === selectedIdx;
                  const isQ = s.type === 'question';
                  return (
                    <Draggable key={i} draggableId={`scene-${i}`} index={i}>
                      {(provided, snapshot) => (
                        <button ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                          onClick={() => setSelectedIdx(i)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            width: '100%', textAlign: 'left',
                            padding: '9px 14px',
                            background: isActive ? 'rgba(255,72,29,0.07)' : snapshot.isDragging ? 'rgba(255,72,29,0.04)' : 'transparent',
                            borderLeft: `3px solid ${isActive ? C.orange : 'transparent'}`,
                            border: 'none',
                            borderBottom: `1px solid ${C.border}`,
                            cursor: 'grab',
                            transition: 'background 0.1s',
                            ...provided.draggableProps.style,
                          }}
                        >
                          <span style={{ width: 18, height: 18, flexShrink: 0, background: isQ ? 'rgba(255,72,29,0.12)' : C.lightBg, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: isQ ? C.orange : C.muted, fontWeight: 700 }}>
                            {typeIcon(s)}
                          </span>
                          <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: isActive ? C.orange : C.text, lineHeight: 1.35, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {sceneLabel(s, i)}
                          </span>
                        </button>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <button onClick={() => setShowNewQuestionModal(true)}
          style={{
            width: '100%', padding: '14px 16px', textAlign: 'center',
            background: 'transparent', border: `1px solid ${C.border}`, borderTop: `2px solid ${C.orange}`,
            color: C.orange, fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 600, fontSize: 11,
            letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,72,29,0.07)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          + New Question
        </button>
      </div>

      {/* ── Centre: preview ── */}
      <div style={{ flex: 1, minWidth: 0, background: activeSkin.theme?.['--bg'] || SFA_BG, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        {/* Thin status bar */}
        <div style={{ height: 36, background: 'rgba(0,0,0,0.5)', borderBottom: `1px solid ${activeSkin.theme?.['--amber'] || '#ff5a2c'}22`, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 10, flexShrink: 0 }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,90,44,0.8)' }}>
            {selected?.type}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 14 }}>·</span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.2em', color: 'rgba(236,229,215,0.4)', textTransform: 'uppercase' }}>
            {selectedIdx + 1} / {scenes.length}
          </span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
          {selected && <ScenePreview scene={selected} skinTheme={activeSkin.theme} overrides={(content[skinId] || {})[selectedIdx]} />}
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
    </>
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