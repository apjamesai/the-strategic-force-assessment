import React, { useState, useMemo, useEffect } from 'react';
import {
  ARCHETYPES, SECONDARY_PATTERNS,
  RULE_DEFAULTS,
} from '@/lib/sfa/engine';
import { SKINS, SKIN_LIST, getActiveSkinId, setActiveSkinId } from '@/lib/sfa/skins/index';
import QuestionEditor from '@/components/admin/QuestionEditor';

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
};

const inputStyle = {
  background: C.inputBg,
  border: `1px solid ${C.border}`,
  color: C.text,
  padding: '8px 12px',
  fontSize: 13,
  fontFamily: "'Roboto', sans-serif",
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  borderRadius: 2,
  transition: 'border-color 0.15s',
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
  borderRadius: 2,
  transition: 'background 0.15s',
};

const btnOutline = {
  background: C.white,
  border: `1px solid ${C.border}`,
  color: C.muted,
  fontFamily: "'Roboto Condensed', sans-serif",
  fontWeight: 600,
  fontSize: 10,
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  padding: '7px 14px',
  cursor: 'pointer',
  borderRadius: 2,
  transition: 'all 0.15s',
};

const ADMIN_SECONDARY_BASE_DEFAULT = 'hidden_drifter';
const TABS = [
  { key: 'archetypes', label: 'Archetypes' },
  { key: 'questions',  label: 'Questions'  },
  { key: 'rules',      label: 'Rules'      },
  { key: 'skins',      label: 'Skins'      },
  { key: 'results',    label: 'Results'    },
];

const LS = {
  rules:   'mandarin.assessment.rules',
  content: 'mandarin.assessment.content',
  scoring: 'mandarin.assessment.scoring',
};
function lsGet(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function SectionHead({ title, sub }) {
  return (
    <div style={{ marginBottom: 28, paddingBottom: 16, borderBottom: `2px solid ${C.orange}`, display: 'inline-block', width: '100%' }}>
      <h2 style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 24, color: C.text, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>{title}</h2>
      {sub && <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.55 }}>{sub}</p>}
    </div>
  );
}

function Label({ children }) {
  return <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.orange, marginBottom: 12 }}>{children}</div>;
}

export default function AdminPage() {
  const [tab, setTab] = useState('archetypes');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [secondaryBase, setSecondaryBase] = useState(ADMIN_SECONDARY_BASE_DEFAULT);
  const [activeSkinIdState, setActiveSkinIdStateLocal] = useState(getActiveSkinId());
  const [rules, setRules]   = useState(() => lsGet(LS.rules, { ...RULE_DEFAULTS }));
  const [content, setContent] = useState(() => lsGet(LS.content, {}));
  const [scoring, setScoring] = useState(() => lsGet(LS.scoring, {}));

  const activeSkin = SKINS[activeSkinIdState] || SKINS.force_trial;

  useEffect(() => { lsSet(LS.rules, rules); }, [rules]);
  useEffect(() => { lsSet(LS.content, content); }, [content]);
  useEffect(() => { lsSet(LS.scoring, scoring); }, [scoring]);

  const handlePreview = (primary, secondary) => {
    alert(`Preview: ${primary}${secondary ? ' + ' + secondary : ''}. Navigate to "/" to see the result.`);
  };

  const switchSkin = (id) => {
    setActiveSkinId(id);
    setActiveSkinIdStateLocal(id);
    window.dispatchEvent(new Event('sfa:skin-change'));
  };

  const setTabAndClose = (key) => {
    setTab(key);
    setMobileNavOpen(false);
  };

  return (
    <div style={{ background: C.lightBg, minHeight: '100vh', color: C.text, fontFamily: "'Roboto', sans-serif", cursor: 'auto' }}>

      {/* ── Top bar ── */}
      <div style={{
        background: C.white,
        borderBottom: `1px solid ${C.border}`,
        padding: '0 clamp(16px, 3vw, 32px)',
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img src={LOGO_URL} alt="Mandarin" style={{ height: 30 }} />
          <span style={{ color: C.border, fontSize: 20, fontWeight: 200 }}>|</span>
          <span style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 600, fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted }}>
            Admin
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Mobile nav toggle */}
          <button
            onClick={() => setMobileNavOpen(v => !v)}
            style={{ ...btnOutline, display: 'none' }}
            className="admin-mobile-toggle"
          >
            ☰ Menu
          </button>
          <a href="/"
            style={{
              fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 10,
              letterSpacing: '0.35em', textTransform: 'uppercase', color: C.orange,
              textDecoration: 'none', padding: '8px 16px',
              border: `1px solid ${C.orange}`, borderRadius: 2, transition: 'all 0.15s',
            }}
          >
            ← Assessment
          </a>
        </div>
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>

        {/* ── Sidebar ── */}
        <aside style={{
          width: 200, flexShrink: 0,
          background: C.white,
          borderRight: `1px solid ${C.border}`,
          paddingTop: 24,
          position: 'sticky', top: 64, height: 'calc(100vh - 64px)', overflowY: 'auto',
        }}>
          <div style={{ padding: '0 16px 12px', fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.muted }}>
            Navigation
          </div>
          {TABS.map(t => (
            <button key={t.key}
              onClick={() => setTabAndClose(t.key)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '12px 20px',
                background: tab === t.key ? 'rgba(255,72,29,0.07)' : 'transparent',
                borderLeft: `3px solid ${tab === t.key ? C.orange : 'transparent'}`,
                border: 'none',
                borderLeft: `3px solid ${tab === t.key ? C.orange : 'transparent'}`,
                color: tab === t.key ? C.orange : C.text,
                fontFamily: "'Roboto Condensed', sans-serif",
                fontWeight: tab === t.key ? 700 : 400,
                fontSize: 13,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </aside>

        {/* ── Content ── */}
        {tab === 'questions' ? (
          <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
            <QuestionEditor
              activeSkin={activeSkin}
              content={content} setContent={setContent}
              scoring={scoring} setScoring={setScoring}
            />
          </div>
        ) : (
          <main style={{ flex: 1, padding: 'clamp(24px, 4vw, 40px) clamp(20px, 4vw, 48px)', overflowY: 'auto', minWidth: 0 }}>
            {tab === 'archetypes' && <ArchetypesTab onPreview={handlePreview} secondaryBase={secondaryBase} setSecondaryBase={setSecondaryBase} />}
            {tab === 'rules'      && <RulesTab rules={rules} setRules={setRules} />}
            {tab === 'skins'      && <SkinsTab activeSkinIdState={activeSkinIdState} switchSkin={switchSkin} />}
            {tab === 'results'    && <ResultsTab />}
          </main>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .admin-mobile-toggle { display: inline-flex !important; }
        }
      `}</style>
    </div>
  );
}

/* ── Archetypes ── */
function ArchetypesTab({ onPreview, secondaryBase, setSecondaryBase }) {
  return (
    <div>
      <SectionHead title="Archetypes" sub="Five score-band archetypes plus six secondary pattern overlays. Click any card to preview that result." />

      <Label>Primary · Band-based</Label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 36 }}>
        {Object.entries(ARCHETYPES).map(([key, a]) => (
          <ArchCard key={key} tag={a.band} name={a.name} desc={a.headline} cta="Preview result →" onClick={() => onPreview(key, null)} />
        ))}
      </div>

      <Label>Secondary · Choose base archetype first</Label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {Object.entries(ARCHETYPES).map(([key, a]) => (
          <button key={key} onClick={() => setSecondaryBase(key)}
            style={{
              fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 600, fontSize: 11,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              padding: '7px 14px', cursor: 'pointer', borderRadius: 2, transition: 'all 0.15s',
              background: secondaryBase === key ? C.orange : C.white,
              border: `1px solid ${secondaryBase === key ? C.orange : C.border}`,
              color: secondaryBase === key ? C.white : C.text,
            }}
          >{a.name}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {Object.entries(SECONDARY_PATTERNS).map(([key, p]) => (
          <ArchCard key={key} tag="Secondary overlay" name={p.name} desc={p.headline} cta="Preview on chosen primary →" onClick={() => onPreview(secondaryBase, key)} />
        ))}
      </div>
    </div>
  );
}

function ArchCard({ tag, name, desc, cta, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? 'rgba(255,72,29,0.04)' : C.white,
        border: `1px solid ${hov ? C.orange : C.border}`,
        borderTop: `3px solid ${hov ? C.orange : C.border}`,
        padding: '18px 16px', cursor: 'pointer', borderRadius: 2, transition: 'all 0.15s',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}
    >
      <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.orange }}>{tag}</div>
      <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 16, color: C.text }}>{name}</div>
      <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: C.muted, lineHeight: 1.5, flex: 1 }}>{desc}</div>
      <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: hov ? C.orange : C.muted, marginTop: 4 }}>{cta}</div>
    </div>
  );
}



/* ── Rules ── */
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
      <SectionHead title="Rules" sub="Tune score thresholds that drive archetype selection, band labelling, and secondary-pattern triggering." />
      <button onClick={() => setRules({ ...RULE_DEFAULTS })} style={btnOutline}>Reset to defaults</button>
      {Object.entries(sections).map(([title, entries]) => entries.length > 0 && (
        <div key={title} style={{ marginTop: 28 }}>
          <Label>{title}</Label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
            {entries.map(([k, v]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 10, alignItems: 'center', background: C.white, padding: '8px 12px', border: `1px solid ${C.border}`, borderRadius: 2 }}>
                <label style={{ color: C.text, fontSize: 12, fontFamily: "'Roboto', sans-serif" }}>{k}</label>
                <input type="number" value={v}
                  onChange={e => setRules(prev => ({ ...prev, [k]: Number(e.target.value) }))}
                  style={{ ...inputStyle, textAlign: 'center' }} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Skins ── */
function SkinsTab({ activeSkinIdState, switchSkin }) {
  const [customSkins, setCustomSkins] = useState(() => lsGet('mandarin.assessment.skins', {}));
  const [editingSkinId, setEditingSkinId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', tagline: '', theme: {} });
  const [showNewForm, setShowNewForm] = useState(false);

  const allSkins = { ...SKINS, ...customSkins };
  
  const themeFields = [
    { key: 'bg', label: 'Background', type: 'color' },
    { key: 'panel', label: 'Panel', type: 'color' },
    { key: 'ink', label: 'Text (ink)', type: 'color' },
    { key: 'amber', label: 'Accent (amber)', type: 'color' },
    { key: 'brand-orange', label: 'Brand Orange', type: 'color' },
    { key: 'serif', label: 'Serif Font', type: 'text' },
    { key: 'sans', label: 'Sans Font', type: 'text' },
  ];

  const startEdit = (skinId) => {
    const skin = allSkins[skinId];
    setEditForm({ 
      name: skin.name, 
      tagline: skin.tagline,
      theme: skin.theme || {}
    });
    setEditingSkinId(skinId);
  };

  const saveEdit = () => {
    if (!editForm.name.trim()) return;
    const updated = { 
      ...customSkins, 
      [editingSkinId]: { 
        ...allSkins[editingSkinId], 
        name: editForm.name,
        tagline: editForm.tagline,
        theme: editForm.theme 
      } 
    };
    setCustomSkins(updated);
    lsSet('mandarin.assessment.skins', updated);
    setEditingSkinId(null);
  };

  const createNewSkin = () => {
    if (!editForm.name.trim()) return;
    const newId = `custom_${Date.now()}`;
    const newSkin = {
      id: newId,
      name: editForm.name,
      tagline: editForm.tagline,
      scenes: SKINS.force_trial.scenes,
      theme: editForm.theme || { ...SKINS.force_trial.theme },
    };
    const updated = { ...customSkins, [newId]: newSkin };
    setCustomSkins(updated);
    lsSet('mandarin.assessment.skins', updated);
    setShowNewForm(false);
    setEditForm({ name: '', tagline: '', theme: {} });
  };

  const deleteSkin = (skinId) => {
    if (!customSkins[skinId]) return;
    const updated = { ...customSkins };
    delete updated[skinId];
    setCustomSkins(updated);
    lsSet('mandarin.assessment.skins', updated);
  };

  return (
    <div>
      <SectionHead title="Skins" sub="Each skin wraps the same 12-practice assessment in a different narrative universe." />

      {/* Edit modal */}
      {editingSkinId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflow: 'auto' }}>
          <div style={{ background: C.white, borderRadius: 4, padding: 28, width: '90%', maxWidth: 600, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', margin: '20px auto' }}>
            <h3 style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 20, textTransform: 'uppercase' }}>Edit Skin</h3>
            
            {/* Basic info */}
            <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.orange, marginBottom: 12 }}>Basic Info</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 6 }}>Name</label>
                  <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 6 }}>Tagline</label>
                  <textarea value={editForm.tagline} onChange={e => setEditForm({ ...editForm, tagline: e.target.value })} style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} />
                </div>
              </div>
            </div>

            {/* Theme variables */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.orange, marginBottom: 12 }}>Theme Variables</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {themeFields.map(field => (
                  <div key={field.key}>
                    <label style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 4 }}>{field.label}</label>
                    {field.type === 'color' ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input 
                          type="color" 
                          value={editForm.theme[field.key] || ''} 
                          onChange={e => setEditForm({ ...editForm, theme: { ...editForm.theme, [field.key]: e.target.value } })}
                          style={{ width: 40, height: 36, border: `1px solid ${C.border}`, borderRadius: 2, cursor: 'pointer' }}
                        />
                        <input 
                          type="text" 
                          value={editForm.theme[field.key] || ''} 
                          onChange={e => setEditForm({ ...editForm, theme: { ...editForm.theme, [field.key]: e.target.value } })}
                          style={{ ...inputStyle, flex: 1, fontSize: 11 }}
                          placeholder="#000000"
                        />
                      </div>
                    ) : (
                      <input 
                        type="text" 
                        value={editForm.theme[field.key] || ''} 
                        onChange={e => setEditForm({ ...editForm, theme: { ...editForm.theme, [field.key]: e.target.value } })}
                        style={inputStyle}
                        placeholder={field.key === 'serif' ? "'Georgia', serif" : "'Inter', sans-serif"}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={saveEdit} style={btnOrange}>Save</button>
              <button onClick={() => setEditingSkinId(null)} style={btnOutline}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* New skin modal */}
      {showNewForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflow: 'auto' }}>
          <div style={{ background: C.white, borderRadius: 4, padding: 28, width: '90%', maxWidth: 600, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', margin: '20px auto' }}>
            <h3 style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 20, textTransform: 'uppercase' }}>New Skin</h3>
            
            {/* Basic info */}
            <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.orange, marginBottom: 12 }}>Basic Info</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 6 }}>Name</label>
                  <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} placeholder="e.g., Space Odyssey" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 6 }}>Tagline</label>
                  <textarea value={editForm.tagline} onChange={e => setEditForm({ ...editForm, tagline: e.target.value })} placeholder="e.g., Explore leadership in the cosmos" style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} />
                </div>
              </div>
            </div>

            {/* Theme variables */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.orange, marginBottom: 12 }}>Theme Variables</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {themeFields.map(field => (
                  <div key={field.key}>
                    <label style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 4 }}>{field.label}</label>
                    {field.type === 'color' ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input 
                          type="color" 
                          value={editForm.theme[field.key] || '#000000'} 
                          onChange={e => setEditForm({ ...editForm, theme: { ...editForm.theme, [field.key]: e.target.value } })}
                          style={{ width: 40, height: 36, border: `1px solid ${C.border}`, borderRadius: 2, cursor: 'pointer' }}
                        />
                        <input 
                          type="text" 
                          value={editForm.theme[field.key] || ''} 
                          onChange={e => setEditForm({ ...editForm, theme: { ...editForm.theme, [field.key]: e.target.value } })}
                          style={{ ...inputStyle, flex: 1, fontSize: 11 }}
                          placeholder="#000000"
                        />
                      </div>
                    ) : (
                      <input 
                        type="text" 
                        value={editForm.theme[field.key] || ''} 
                        onChange={e => setEditForm({ ...editForm, theme: { ...editForm.theme, [field.key]: e.target.value } })}
                        style={inputStyle}
                        placeholder={field.key === 'serif' ? "'Georgia', serif" : "'Inter', sans-serif"}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={createNewSkin} style={btnOrange}>Create</button>
              <button onClick={() => { setShowNewForm(false); setEditForm({ name: '', tagline: '', theme: {} }); }} style={btnOutline}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
        {Object.entries(allSkins).map(([key, skin]) => {
          const isActive = key === activeSkinIdState;
          const isCustom = !!customSkins[key];
          return (
            <div key={key} style={{
              background: C.white,
              border: `1px solid ${isActive ? C.orange : C.border}`,
              borderTop: `3px solid ${isActive ? C.orange : C.border}`,
              padding: '20px 18px', borderRadius: 2,
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  {isActive && <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.orange, marginBottom: 4 }}>Active</div>}
                  {isCustom && <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.muted, marginBottom: 4 }}>Custom</div>}
                </div>
              </div>
              <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 17, color: C.text }}>{skin.name}</div>
              <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.5, flex: 1 }}>{skin.tagline}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button style={{ ...btnOutline, flex: 1, fontSize: 9 }} onClick={() => startEdit(key)}>Edit</button>
                {!isActive && (
                  <button style={btnOrange} onClick={() => switchSkin(key)}>
                    Use
                  </button>
                )}
                {isCustom && (
                  <button style={{ ...btnOutline, color: '#ff6b6b', borderColor: '#ffb3b3' }} onClick={() => deleteSkin(key)}>Delete</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={() => setShowNewForm(true)} style={btnOrange}>+ New Skin</button>
        <a href="/admin/image-studio"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, ...btnOutline, textDecoration: 'none' }}>
          Image Studio →
        </a>
      </div>
    </div>
  );
}

/* ── Results ── */
function ResultsTab() {
  return (
    <div>
      <SectionHead title="Results" sub="Session results are saved locally in your browser." />
      <p style={{ color: C.muted, fontStyle: 'italic', fontSize: 13 }}>No completed sessions in this browser yet.</p>
    </div>
  );
}