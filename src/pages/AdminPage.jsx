import React, { useState, useMemo, useEffect } from 'react';
import {
  ARCHETYPES, SECONDARY_PATTERNS, MOCK_PROFILES,
  RULE_DEFAULTS, FRAMEWORK
} from '@/lib/sfa/engine';
import { SKINS, SKIN_LIST, getActiveSkinId, setActiveSkinId } from '@/lib/sfa/skins/index';

const ADMIN_SECONDARY_BASE_DEFAULT = 'hidden_drifter';
const TABS = [
  { key: 'archetypes', label: 'Archetypes' },
  { key: 'content',    label: 'Content'    },
  { key: 'scoring',    label: 'Scoring'    },
  { key: 'rules',      label: 'Rules'      },
  { key: 'skins',      label: 'Skins'      },
  { key: 'results',    label: 'Results'    }
];

// ─── localStorage shims so admin edits persist across page loads
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

export default function AdminPage() {
  const [tab, setTab]                 = useState('archetypes');
  const [secondaryBase, setSecondaryBase] = useState(ADMIN_SECONDARY_BASE_DEFAULT);
  const [activeSkinIdState, setActiveSkinIdStateLocal] = useState(getActiveSkinId());
  const [rules, setRules]             = useState(() => lsGet(LS.rules, { ...RULE_DEFAULTS }));
  const [content, setContent]         = useState(() => lsGet(LS.content, {}));
  const [scoring, setScoring]         = useState(() => lsGet(LS.scoring, {}));

  const activeSkin = SKINS[activeSkinIdState] || SKINS.force_trial;

  // ─── Persist rule/content/scoring overrides ───────────────────────
  useEffect(() => { lsSet(LS.rules, rules); },   [rules]);
  useEffect(() => { lsSet(LS.content, content); }, [content]);
  useEffect(() => { lsSet(LS.scoring, scoring); }, [scoring]);

  const handlePreview = (primary, secondary) => {
    alert(`Preview wired: ${primary}${secondary ? ' + ' + secondary : ''}. Navigate to "/" to see the result.`);
  };

  const switchSkin = (id) => {
    setActiveSkinId(id);
    setActiveSkinIdStateLocal(id);
    // Notify any open Assessment tab to swap skin without reload
    window.dispatchEvent(new Event('sfa:skin-change'));
  };

  return (
    <div className="sfa-root" style={{ position: 'fixed', inset: 0, overflow: 'auto', cursor: 'auto' }}>
      <div className="sfa-admin-panel open" style={{ position: 'relative', height: '100vh' }}>
        <div className="sfa-admin-topbar">
          <div className="sfa-admin-brand">
            <span className="dot"></span>
            <span>Admin · </span>
            <span className="label">The Strategic Force Assessment</span>
          </div>
          <div className="sfa-admin-tabs">
            {TABS.map(t => (
              <button key={t.key} className={`sfa-admin-tab${tab === t.key ? ' active' : ''}`}
                onClick={() => setTab(t.key)}>{t.label}</button>
            ))}
          </div>
          <a href="/" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', color: 'var(--ink-mute)', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', textDecoration: 'none' }}>
            &larr; Back to Assessment
          </a>
        </div>

        <div className="sfa-admin-body">
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

// ─── Archetype previews ──────────────────────────────────────
function ArchetypesTab({ onPreview, secondaryBase, setSecondaryBase }) {
  return (
    <div>
      <div className="sfa-admin-section-title">Switch between archetypes</div>
      <div className="sfa-admin-section-sub">Five score-band archetypes plus six secondary pattern overlays.</div>

      <div style={{ fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 12 }}>Primary · band-based</div>
      <div className="sfa-admin-arch-grid">
        {Object.entries(ARCHETYPES).map(([key, a]) => (
          <div key={key} className="sfa-admin-arch-card" onClick={() => onPreview(key, null)}>
            <div className="tag">{a.band}</div>
            <div className="name">{a.name}</div>
            <div className="head">{a.headline}</div>
            <div className="cta">Preview result &rarr;</div>
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
            <div className="cta">Preview on chosen primary &rarr;</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Content editor (scene text overrides) ────────────────────
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
    .filter(({ s }) => ['landing', 'crawl', 'narrative', 'narrative-scene', 'midpoint', 'twist', 'end-reflection', 'results-launch', 'intake'].includes(s.type));

  return (
    <div>
      <div className="sfa-admin-section-title">Content editor</div>
      <div className="sfa-admin-section-sub">Override scene copy for {activeSkin.name}. Edits are saved per-skin in this browser.</div>
      <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
        {editableScenes.map(({ s, i }) => {
          const o = overrides[i] || {};
          return (
            <div key={i} style={{ border: '1px solid rgba(255,255,255,0.08)', padding: 16, background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--amber)' }}>
                  {i + 1}. {s.type}{s.locationLabel ? ` · ${s.locationLabel}` : ''}
                </div>
                {overrides[i] && <button onClick={() => clearScene(i)} style={btnGhost}>reset</button>}
              </div>
              {Array.isArray(s.title) && (
                <Field label="Title (space-separated words)"
                  value={(o.title ?? s.title.join(' '))}
                  onChange={v => updateScene(i, 'title', v)} />
              )}
              {typeof s.title === 'string' && (
                <Field label="Title"
                  value={o.title ?? s.title}
                  onChange={v => updateScene(i, 'title', v)} />
              )}
              {s.sub  && <Field label="Sub"  value={o.sub  ?? s.sub}  onChange={v => updateScene(i, 'sub',  v)} />}
              {s.note && <Field label="Note" value={o.note ?? s.note} onChange={v => updateScene(i, 'note', v)} multiline />}
              {s.eyebrow && <Field label="Eyebrow" value={o.eyebrow ?? s.eyebrow} onChange={v => updateScene(i, 'eyebrow', v)} />}
              {Array.isArray(s.body) && <Field label="Body (lines, separated by ¶)" value={o.body ?? s.body.join(' ¶ ')} onChange={v => updateScene(i, 'body', v)} multiline />}
              {Array.isArray(s.paragraphs) && <Field label="Paragraphs (separated by ¶)" value={o.paragraphs ?? s.paragraphs.join(' ¶ ')} onChange={v => updateScene(i, 'paragraphs', v)} multiline />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Scoring editor (per-question / per-option scoring) ───────
function ScoringTab({ activeSkin, scoring, setScoring }) {
  const skinId = activeSkin.id;
  const overrides = scoring[skinId] || {};
  const questions = (activeSkin.scenes || []).map((s, i) => ({ s, i })).filter(({ s }) => s.type === 'question');

  return (
    <div>
      <div className="sfa-admin-section-title">Scoring editor</div>
      <div className="sfa-admin-section-sub">Adjust per-option score values for each question in {activeSkin.name}.</div>
      <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
        {questions.map(({ s, i }) => (
          <div key={i} style={{ border: '1px solid rgba(255,255,255,0.08)', padding: 16, background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 12 }}>
              Q{i + 1} · {s.qType || 'choice'} · {s.practice || s.risk || ''}
            </div>
            <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--ink-soft)', marginBottom: 12 }}>{s.prompt || s.scaleHigh || ''}</div>
            {Array.isArray(s.options) && s.options.map((opt, oi) => {
              const baseScore = typeof opt.score === 'object' ? Object.entries(opt.score).map(([k, v]) => `${k}=${v}`).join(', ') : (opt.score ?? '');
              const overrideKey = `${i}.${oi}`;
              const value = overrides[overrideKey] ?? baseScore;
              return (
                <div key={oi} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 8 }}>
                  <div style={{ color: 'var(--ink-mute)', fontSize: 13 }}>{opt.label || opt.text || opt}</div>
                  <input type="text" value={value}
                    onChange={e => setScoring(prev => ({ ...prev, [skinId]: { ...(prev[skinId] || {}), [overrideKey]: e.target.value } }))}
                    style={inputStyle}
                  />
                </div>
              );
            })}
            {Array.isArray(s.scaleScores) && (
              <div style={{ color: 'var(--ink-mute)', fontSize: 12 }}>Scale scoring: {JSON.stringify(s.scaleScores)}</div>
            )}
          </div>
        ))}
        {questions.length === 0 && <div style={emptyStyle}>No question scenes in this skin.</div>}
      </div>
    </div>
  );
}

// ─── Rules editor (RULE_DEFAULTS overrides) ───────────────────
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

  const reset = () => setRules({ ...RULE_DEFAULTS });

  return (
    <div>
      <div className="sfa-admin-section-title">Rules editor</div>
      <div className="sfa-admin-section-sub">Tune the score thresholds that drive archetype selection, band labelling, and secondary-pattern triggering.</div>
      <button onClick={reset} style={{ ...btnGhost, marginTop: 12 }}>Reset to defaults</button>

      {Object.entries(sections).map(([title, entries]) => entries.length > 0 && (
        <div key={title} style={{ marginTop: 32 }}>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 12 }}>{title}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {entries.map(([k, v]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 10, alignItems: 'center' }}>
                <label style={{ color: 'var(--ink-mute)', fontSize: 12, fontFamily: 'var(--sans)' }}>{k}</label>
                <input type="number" value={v}
                  onChange={e => setRules(prev => ({ ...prev, [k]: Number(e.target.value) }))}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Skins tab ────────────────────────────────────────────────
function SkinsTab({ activeSkinIdState, switchSkin }) {
  return (
    <div>
      <div className="sfa-admin-section-title">Story skins</div>
      <div className="sfa-admin-section-sub">Skins wrap the same 12-practice assessment in different narrative universes.</div>
      <div className="sfa-admin-arch-grid">
        {SKIN_LIST.map(skin => {
          const isActive = skin.id === activeSkinIdState;
          return (
            <div key={skin.id} className="sfa-admin-arch-card"
              style={isActive ? { cursor: 'default', borderLeft: '2px solid var(--amber)' } : {}}>
              {isActive && <div className="tag">ACTIVE</div>}
              <div className="name">{skin.name}</div>
              <div className="head">{skin.tagline}</div>
              {!isActive && (
                <button className="sfa-admin-btn" style={{ marginTop: 8 }}
                  onClick={() => switchSkin(skin.id)}>
                  Use this skin
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 24 }}>
        <a href="/admin/image-studio"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '12px 20px', border: '1px solid rgba(255,90,44,0.4)', color: 'var(--ink)', fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', textDecoration: 'none' }}>
          Open Image Studio &rarr;
        </a>
      </div>
    </div>
  );
}

// ─── Results tab ──────────────────────────────────────────────
function ResultsTab() {
  return (
    <div>
      <div className="sfa-admin-section-title">Results history</div>
      <div className="sfa-admin-section-sub">Session results are saved locally in your browser.</div>
      <div className="sfa-admin-empty" style={emptyStyle}>No completed sessions in this browser yet.</div>
    </div>
  );
}

// ─── Field helper ─────────────────────────────────────────────
function Field({ label, value, onChange, multiline }) {
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div style={{ display: 'grid', gap: 4, marginBottom: 12 }}>
      <label style={{ fontFamily: 'var(--sans)', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>{label}</label>
      <Tag value={value || ''} onChange={e => onChange(e.target.value)}
        rows={multiline ? 3 : undefined}
        style={{ ...inputStyle, fontFamily: multiline ? 'var(--serif)' : 'var(--sans)', minHeight: multiline ? 80 : undefined }} />
    </div>
  );
}

const inputStyle = {
  background: 'rgba(0,0,0,0.4)',
  border: '1px solid rgba(255,255,255,0.12)',
  color: 'var(--ink)',
  padding: '8px 10px',
  fontSize: 13,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box'
};
const btnGhost = {
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.12)',
  color: 'var(--ink-mute)',
  fontFamily: 'var(--sans)',
  fontSize: 10,
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  padding: '6px 10px',
  cursor: 'pointer'
};
const emptyStyle = {
  fontFamily: 'var(--sans)',
  fontSize: 13,
  color: 'var(--ink-mute)',
  fontStyle: 'italic',
  marginTop: 24
};
