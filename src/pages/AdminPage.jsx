import React, { useState, useMemo, useEffect } from 'react';
import {
  ARCHETYPES, SECONDARY_PATTERNS, MOCK_PROFILES,
  RULE_DEFAULTS, FRAMEWORK
} from '@/lib/sfa/engine';
import { SKINS, SKIN_LIST, getActiveSkinId, setActiveSkinId } from '@/lib/sfa/skins/index';

/* Brand tokens */
const C = {
  orange: '#FF481D',
  black: '#1E1E23',
  blackDeep: '#0f0f12',
  white: '#FFFFFF',
  silver: '#DBDBDB',
  lightSilver: '#EEEEEE',
  muted: 'rgba(219,219,219,0.5)',
  border: 'rgba(255,255,255,0.08)',
};

/* Shared styles */
const inputStyle = {
  background: 'rgba(0,0,0,0.5)',
  border: `1px solid ${C.border}`,
  color: C.white,
  padding: '8px 12px',
  fontSize: 13,
  fontFamily: "'Roboto', sans-serif",
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  borderRadius: 0,
};
const btnGhost = {
  background: 'transparent',
  border: `1px solid ${C.border}`,
  color: C.silver,
  fontFamily: "'Roboto Condensed', sans-serif",
  fontWeight: 600,
  fontSize: 11,
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  padding: '8px 14px',
  cursor: 'pointer',
  transition: 'all 0.2s',
};
const btnOrange = {
  background: C.orange,
  border: 'none',
  color: C.white,
  fontFamily: "'Roboto Condensed', sans-serif",
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: '0.25em',
  textTransform: 'uppercase',
  padding: '9px 20px',
  cursor: 'pointer',
  transition: 'background 0.2s',
};

const ADMIN_SECONDARY_BASE_DEFAULT = 'hidden_drifter';
const TABS = [
  { key: 'archetypes', label: 'Archetypes' },
  { key: 'content',    label: 'Content'    },
  { key: 'scoring',    label: 'Scoring'    },
  { key: 'rules',      label: 'Rules'      },
  { key: 'skins',      label: 'Skins'      },
  { key: 'results',    label: 'Results'    }
];

const LS = {
  rules:   'mandarin.assessment.rules',
  content: 'mandarin.assessment.content',
  scoring: 'mandarin.assessment.scoring'
};
function lsGet(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

/* Mandarin M logomark */
function MandarinMark({ size = 28, color = C.orange }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path d="M10 88 L10 32 L32 54 L50 18 L68 54 L90 32 L90 88 Z" fill={color} />
    </svg>
  );
}

/* Section heading */
function SectionHead({ title, sub }) {
  return (
    <div style={{ marginBottom: 32, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
      <h2 style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 28, color: C.white, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>{title}</h2>
      {sub && <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, color: C.silver, margin: 0, lineHeight: 1.55 }}>{sub}</p>}
    </div>
  );
}

/* Label */
function Label({ children }) {
  return <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 600, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.orange, marginBottom: 12 }}>{children}</div>;
}

export default function AdminPage() {
  const [tab, setTab]                 = useState('archetypes');
  const [secondaryBase, setSecondaryBase] = useState(ADMIN_SECONDARY_BASE_DEFAULT);
  const [activeSkinIdState, setActiveSkinIdStateLocal] = useState(getActiveSkinId());
  const [rules, setRules]             = useState(() => lsGet(LS.rules, { ...RULE_DEFAULTS }));
  const [content, setContent]         = useState(() => lsGet(LS.content, {}));
  const [scoring, setScoring]         = useState(() => lsGet(LS.scoring, {}));

  const activeSkin = SKINS[activeSkinIdState] || SKINS.force_trial;

  useEffect(() => { lsSet(LS.rules, rules); },   [rules]);
  useEffect(() => { lsSet(LS.content, content); }, [content]);
  useEffect(() => { lsSet(LS.scoring, scoring); }, [scoring]);

  const handlePreview = (primary, secondary) => {
    alert(`Preview wired: ${primary}${secondary ? ' + ' + secondary : ''}. Navigate to "/" to see the result.`);
  };

  const switchSkin = (id) => {
    setActiveSkinId(id);
    setActiveSkinIdStateLocal(id);
    window.dispatchEvent(new Event('sfa:skin-change'));
  };

  return (
    <div style={{ background: C.blackDeep, minHeight: '100vh', color: C.white, fontFamily: "'Roboto', sans-serif", cursor: 'auto' }}>

      {/* Top bar */}
      <div style={{
        background: C.black, borderBottom: `3px solid ${C.orange}`,
        padding: '0 32px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <MandarinMark size={26} color={C.orange} />
          <span style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 18, color: C.white, letterSpacing: '0.04em' }}>mandarin</span>
          <span style={{ color: C.muted, margin: '0 8px', fontSize: 18 }}>|</span>
          <span style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 600, fontSize: 12, letterSpacing: '0.35em', textTransform: 'uppercase', color: C.silver }}>Admin Panel</span>
        </div>
        <a href="/"
          style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 600, fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: C.silver, textDecoration: 'none', padding: '8px 16px', border: `1px solid ${C.border}`, transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.orange; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.silver; }}
        >
          ← Back to Assessment
        </a>
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>

        {/* Sidebar nav */}
        <div style={{
          width: 200, flexShrink: 0,
          background: C.black,
          borderRight: `1px solid ${C.border}`,
          paddingTop: 32,
          position: 'sticky', top: 64, height: 'calc(100vh - 64px)', overflowY: 'auto',
        }}>
          {TABS.map(t => (
            <button key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '14px 24px',
                background: tab === t.key ? `rgba(255,72,29,0.12)` : 'transparent',
                borderLeft: `3px solid ${tab === t.key ? C.orange : 'transparent'}`,
                border: 'none',
                borderLeft: `3px solid ${tab === t.key ? C.orange : 'transparent'}`,
                color: tab === t.key ? C.white : C.silver,
                fontFamily: "'Roboto Condensed', sans-serif",
                fontWeight: tab === t.key ? 700 : 400,
                fontSize: 13,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Main content area */}
        <div style={{ flex: 1, padding: '40px 48px', overflowY: 'auto', maxWidth: 1200 }}>
          {tab === 'archetypes' && <ArchetypesTab onPreview={handlePreview} secondaryBase={secondaryBase} setSecondaryBase={setSecondaryBase} />}
          {tab === 'content'    && <ContentTab activeSkin={activeSkin} content={content} setContent={setContent} />}
          {tab === 'scoring'    && <ScoringTab activeSkin={activeSkin} scoring={scoring} setScoring={setScoring} />}
          {tab === 'rules'      && <RulesTab rules={rules} setRules={setRules} />}
          {tab === 'skins'      && <SkinsTab activeSkinIdState={activeSkinIdState} switchSkin={switchSkin} />}
          {tab === 'results'    && <ResultsTab />}
        </div>
      </div>
    </div>
  );
}

/* ── Archetypes tab ──────────────────────────────────────────── */
function ArchetypesTab({ onPreview, secondaryBase, setSecondaryBase }) {
  return (
    <div>
      <SectionHead title="Archetypes" sub="Five score-band archetypes plus six secondary pattern overlays." />

      <Label>Primary · band-based</Label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 1, background: C.border, marginBottom: 32 }}>
        {Object.entries(ARCHETYPES).map(([key, a]) => (
          <div key={key}
            onClick={() => onPreview(key, null)}
            style={{ background: C.black, padding: '22px 20px', cursor: 'pointer', borderLeft: `3px solid transparent`, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderLeftColor = C.orange; e.currentTarget.style.background = `rgba(255,72,29,0.06)`; }}
            onMouseLeave={e => { e.currentTarget.style.borderLeftColor = 'transparent'; e.currentTarget.style.background = C.black; }}
          >
            <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 600, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.orange, marginBottom: 8 }}>{a.band}</div>
            <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 18, color: C.white, marginBottom: 6 }}>{a.name}</div>
            <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: C.silver, lineHeight: 1.5, marginBottom: 12 }}>{a.headline}</div>
            <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted }}>Preview result →</div>
          </div>
        ))}
      </div>

      <Label>Secondary patterns — choose base archetype first</Label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {Object.entries(ARCHETYPES).map(([key, a]) => (
          <button key={key}
            onClick={() => setSecondaryBase(key)}
            style={{
              ...btnGhost,
              borderColor: secondaryBase === key ? C.orange : C.border,
              color: secondaryBase === key ? C.orange : C.silver,
              background: secondaryBase === key ? 'rgba(255,72,29,0.08)' : 'transparent',
            }}
          >{a.name}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 1, background: C.border }}>
        {Object.entries(SECONDARY_PATTERNS).map(([key, p]) => (
          <div key={key}
            onClick={() => onPreview(secondaryBase, key)}
            style={{ background: C.black, padding: '22px 20px', cursor: 'pointer', borderLeft: `3px solid transparent`, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderLeftColor = C.orange; e.currentTarget.style.background = `rgba(255,72,29,0.06)`; }}
            onMouseLeave={e => { e.currentTarget.style.borderLeftColor = 'transparent'; e.currentTarget.style.background = C.black; }}
          >
            <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.muted, marginBottom: 8 }}>Secondary overlay</div>
            <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 18, color: C.white, marginBottom: 6 }}>{p.name}</div>
            <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: C.silver, lineHeight: 1.5, marginBottom: 12 }}>{p.headline}</div>
            <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted }}>Preview on chosen primary →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Content tab ─────────────────────────────────────────────── */
function ContentTab({ activeSkin, content, setContent }) {
  const skinId = activeSkin.id;
  const overrides = content[skinId] || {};
  const scenes = activeSkin.scenes || [];

  const updateScene = (idx, field, value) => {
    setContent(prev => ({
      ...prev,
      [skinId]: { ...(prev[skinId] || {}), [idx]: { ...((prev[skinId] || {})[idx] || {}), [field]: value } }
    }));
  };

  const clearScene = (idx) => {
    setContent(prev => {
      const next = { ...(prev[skinId] || {}) };
      delete next[idx];
      return { ...prev, [skinId]: next };
    });
  };

  const editableScenes = scenes
    .map((s, i) => ({ s, i }))
    .filter(({ s }) => ['landing','crawl','narrative','narrative-scene','midpoint','twist','end-reflection','results-launch','intake'].includes(s.type));

  return (
    <div>
      <SectionHead title="Content" sub={`Override scene copy for ${activeSkin.name}. Edits are saved per-skin in this browser.`} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {editableScenes.map(({ s, i }) => {
          const o = overrides[i] || {};
          return (
            <div key={i} style={{ border: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 600, fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: C.orange }}>
                  {i + 1}. {s.type}{s.locationLabel ? ` · ${s.locationLabel}` : ''}
                </span>
                {overrides[i] && <button onClick={() => clearScene(i)} style={btnGhost}>Reset</button>}
              </div>
              <div style={{ padding: 16 }}>
                {Array.isArray(s.title) && <Field label="Title (space-separated words)" value={o.title ?? s.title.join(' ')} onChange={v => updateScene(i, 'title', v)} />}
                {typeof s.title === 'string' && <Field label="Title" value={o.title ?? s.title} onChange={v => updateScene(i, 'title', v)} />}
                {s.sub  && <Field label="Sub"  value={o.sub  ?? s.sub}  onChange={v => updateScene(i, 'sub',  v)} />}
                {s.note && <Field label="Note" value={o.note ?? s.note} onChange={v => updateScene(i, 'note', v)} multiline />}
                {s.eyebrow && <Field label="Eyebrow" value={o.eyebrow ?? s.eyebrow} onChange={v => updateScene(i, 'eyebrow', v)} />}
                {Array.isArray(s.body) && <Field label="Body (lines, separated by ¶)" value={o.body ?? s.body.join(' ¶ ')} onChange={v => updateScene(i, 'body', v)} multiline />}
                {Array.isArray(s.paragraphs) && <Field label="Paragraphs (separated by ¶)" value={o.paragraphs ?? s.paragraphs.join(' ¶ ')} onChange={v => updateScene(i, 'paragraphs', v)} multiline />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Scoring tab ─────────────────────────────────────────────── */
function ScoringTab({ activeSkin, scoring, setScoring }) {
  const skinId = activeSkin.id;
  const overrides = scoring[skinId] || {};
  const questions = (activeSkin.scenes || []).map((s, i) => ({ s, i })).filter(({ s }) => s.type === 'question');

  return (
    <div>
      <SectionHead title="Scoring" sub={`Adjust per-option score values for each question in ${activeSkin.name}.`} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {questions.map(({ s, i }) => (
          <div key={i} style={{ border: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 600, fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: C.orange }}>
                Q{i + 1} · {s.qType || 'choice'} · {s.practice || s.risk || ''}
              </span>
              <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: C.silver, fontStyle: 'italic', marginTop: 6 }}>{s.prompt || s.scaleHigh || ''}</div>
            </div>
            <div style={{ padding: 16 }}>
              {Array.isArray(s.options) && s.options.map((opt, oi) => {
                const baseScore = typeof opt.score === 'object' ? Object.entries(opt.score).map(([k, v]) => `${k}=${v}`).join(', ') : (opt.score ?? '');
                const overrideKey = `${i}.${oi}`;
                const value = overrides[overrideKey] ?? baseScore;
                return (
                  <div key={oi} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 8 }}>
                    <div style={{ color: C.muted, fontSize: 13, paddingTop: 8 }}>{opt.label || opt.text || (typeof opt === 'string' ? opt : JSON.stringify(opt))}</div>
                    <input type="text" value={value}
                      onChange={e => setScoring(prev => ({ ...prev, [skinId]: { ...(prev[skinId] || {}), [overrideKey]: e.target.value } }))}
                      style={inputStyle} />
                  </div>
                );
              })}
              {Array.isArray(s.scaleScores) && (
                <div style={{ color: C.muted, fontSize: 12, fontFamily: "'Roboto', sans-serif" }}>Scale scoring: {JSON.stringify(s.scaleScores)}</div>
              )}
            </div>
          </div>
        ))}
        {questions.length === 0 && <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: C.muted, fontStyle: 'italic' }}>No question scenes in this skin.</div>}
      </div>
    </div>
  );
}

/* ── Rules tab ───────────────────────────────────────────────── */
function RulesTab({ rules, setRules }) {
  const sections = useMemo(() => {
    const out = { 'Force Multiplier': [], 'Archetype bands': [], 'Practice bands': [], 'Risk bands': [], 'Secondary pattern triggers': [] };
    Object.entries(rules).forEach(([k, v]) => {
      if (k.startsWith('fm_'))                              out['Force Multiplier'].push([k, v]);
      else if (k.startsWith('band_'))                       out['Archetype bands'].push([k, v]);
      else if (k.startsWith('practice_'))                   out['Practice bands'].push([k, v]);
      else if (k.startsWith('risk_'))                       out['Risk bands'].push([k, v]);
      else if (k.startsWith('secondary_') || k.startsWith('so_')) out['Secondary pattern triggers'].push([k, v]);
      else                                                  out['Force Multiplier'].push([k, v]);
    });
    return out;
  }, [rules]);

  return (
    <div>
      <SectionHead title="Rules" sub="Tune the score thresholds that drive archetype selection, band labelling, and secondary-pattern triggering." />
      <button onClick={() => setRules({ ...RULE_DEFAULTS })} style={btnGhost}>Reset to defaults</button>
      {Object.entries(sections).map(([title, entries]) => entries.length > 0 && (
        <div key={title} style={{ marginTop: 32 }}>
          <Label>{title}</Label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            {entries.map(([k, v]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 10, alignItems: 'center' }}>
                <label style={{ color: C.silver, fontSize: 12, fontFamily: "'Roboto', sans-serif" }}>{k}</label>
                <input type="number" value={v}
                  onChange={e => setRules(prev => ({ ...prev, [k]: Number(e.target.value) }))}
                  style={inputStyle} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Skins tab ───────────────────────────────────────────────── */
function SkinsTab({ activeSkinIdState, switchSkin }) {
  return (
    <div>
      <SectionHead title="Skins" sub="Skins wrap the same 12-practice assessment in different narrative universes." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 1, background: C.border, marginBottom: 32 }}>
        {SKIN_LIST.map(skin => {
          const isActive = skin.id === activeSkinIdState;
          return (
            <div key={skin.id} style={{
              background: isActive ? 'rgba(255,72,29,0.1)' : C.black,
              padding: '24px 20px',
              borderLeft: `4px solid ${isActive ? C.orange : 'transparent'}`,
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              {isActive && <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.orange }}>Active</div>}
              <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 18, color: C.white }}>{skin.name}</div>
              <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: C.silver, lineHeight: 1.5, flex: 1 }}>{skin.tagline}</div>
              {!isActive && (
                <button style={btnOrange} onClick={() => switchSkin(skin.id)}
                  onMouseEnter={e => e.currentTarget.style.background = '#e03d18'}
                  onMouseLeave={e => e.currentTarget.style.background = C.orange}
                >Use this skin</button>
              )}
            </div>
          );
        })}
      </div>
      <a href="/admin/image-studio"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 20px', background: C.orange, color: C.white, fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', textDecoration: 'none' }}>
        Open Image Studio →
      </a>
    </div>
  );
}

/* ── Results tab ─────────────────────────────────────────────── */
function ResultsTab() {
  return (
    <div>
      <SectionHead title="Results" sub="Session results are saved locally in your browser." />
      <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, color: C.muted, fontStyle: 'italic', paddingTop: 16 }}>No completed sessions in this browser yet.</div>
    </div>
  );
}

/* ── Field helper ────────────────────────────────────────────── */
function Field({ label, value, onChange, multiline }) {
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div style={{ display: 'grid', gap: 4, marginBottom: 12 }}>
      <label style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 600, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: C.muted }}>{label}</label>
      <Tag value={value || ''} onChange={e => onChange(e.target.value)}
        rows={multiline ? 3 : undefined}
        style={{ ...inputStyle, minHeight: multiline ? 80 : undefined }} />
    </div>
  );
}