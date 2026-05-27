import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SKINS } from '@/lib/sfa/skins/index';

const C = {
  orange: '#FF481D',
  white: '#FFFFFF',
  border: '#E8E8E8',
  text: '#1E1E23',
  muted: '#6B6B6B',
  inputBg: '#FAFAFA',
  lightBg: '#F7F7F7',
};

const inputStyle = {
  background: C.inputBg,
  border: `1px solid ${C.border}`,
  color: C.text,
  padding: '7px 10px',
  fontSize: 12,
  fontFamily: "'Roboto', sans-serif",
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  borderRadius: 2,
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
};

function getThemeKeys(skinId, allSkins, formTheme, isNew) {
  const baseSkin = isNew ? SKINS.force_trial : (allSkins[skinId] || SKINS.force_trial);
  const rawBase = baseSkin.theme || {};
  const strippedBase = {};
  Object.entries(rawBase).forEach(([k, v]) => {
    strippedBase[k.startsWith('--') ? k.slice(2) : k] = v;
  });
  const merged = { ...strippedBase, ...formTheme };
  return Object.keys(merged)
    .filter(key => !key.includes('Import') && !key.includes('fontImport'))
    .sort()
    .map(key => {
      const isColor = /(amber|brand|ink|bg|panel|color)/i.test(key) && !/(serif|sans|font|ease)/i.test(key);
      const label = key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      return { key, label: `${label} (--${key})`, type: isColor ? 'color' : 'text' };
    });
}

function stripTheme(rawTheme) {
  const out = {};
  Object.entries(rawTheme || {}).forEach(([k, v]) => {
    out[k.startsWith('--') ? k.slice(2) : k] = v;
  });
  return out;
}

function repackTheme(themeForm) {
  const out = {};
  Object.entries(themeForm).forEach(([k, v]) => {
    if (v === '' || v === undefined) return;
    out[k.startsWith('--') ? k : `--${k}`] = v;
  });
  return out;
}

export default function SkinEditor({ skinId, allSkins, onSave, onCancel, isNew }) {
  const baseSkin = isNew ? SKINS.force_trial : (allSkins[skinId] || SKINS.force_trial);
  const [form, setForm] = useState(() => ({
    name: isNew ? '' : (baseSkin.name || ''),
    tagline: isNew ? '' : (baseSkin.tagline || ''),
    theme: stripTheme(isNew ? SKINS.force_trial.theme : baseSkin.theme),
  }));

  const iframeRef = useRef(null);
  const [iframeReady, setIframeReady] = useState(false);
  // Track which scene index to show in the preview
  const [previewScene, setPreviewScene] = useState(0);

  // Apply CSS vars live into the iframe whenever theme form changes
  const applyThemeToIframe = useCallback((themeForm) => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;
    const root = iframe.contentDocument.documentElement;
    Object.entries(themeForm).forEach(([k, v]) => {
      if (v) root.style.setProperty(`--${k}`, v);
    });
  }, []);

  useEffect(() => {
    if (iframeReady) applyThemeToIframe(form.theme);
  }, [form.theme, iframeReady, applyThemeToIframe]);

  const handleIframeLoad = () => {
    setIframeReady(true);
    applyThemeToIframe(form.theme);
  };

  const updateTheme = (key, val) => {
    setForm(prev => ({ ...prev, theme: { ...prev.theme, [key]: val } }));
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave({ name: form.name, tagline: form.tagline, theme: repackTheme(form.theme) });
  };

  const themeFields = getThemeKeys(skinId, allSkins, form.theme, isNew);

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>

      {/* ── Left: editor ── */}
      <div style={{ width: 380, flexShrink: 0, display: 'flex', flexDirection: 'column', borderRight: `1px solid ${C.border}`, background: C.white, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 13, color: C.text, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {isNew ? 'New Skin' : 'Edit Skin'}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onCancel} style={btnOutline}>Cancel</button>
            <button onClick={handleSave} style={btnOrange}>{isNew ? 'Create' : 'Save'}</button>
          </div>
        </div>

        {/* Scrollable fields */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Basic info */}
          <div>
            <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.orange, marginBottom: 12 }}>Basic Info</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 4 }}>Name</label>
                <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} placeholder="e.g., Space Odyssey" />
              </div>
              <div>
                <label style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 4 }}>Tagline</label>
                <textarea value={form.tagline} onChange={e => setForm(p => ({ ...p, tagline: e.target.value }))} style={{ ...inputStyle, minHeight: 52, resize: 'vertical' }} placeholder="Brief description…" />
              </div>
            </div>
          </div>

          {/* Theme variables */}
          <div>
            <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.orange, marginBottom: 12 }}>
              Theme Variables
              <span style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 400, fontSize: 9, letterSpacing: '0.02em', color: C.muted, marginLeft: 8, textTransform: 'none' }}>— live preview updates instantly</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {themeFields.map(field => {
                const val = form.theme[field.key] ?? '';
                const isHex = /^#[0-9a-fA-F]{3,8}$/.test(val.trim());
                const showPicker = field.type === 'color' && (isHex || val === '');
                return (
                  <div key={field.key}>
                    <label style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 7, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 3 }}>{field.label}</label>
                    {showPicker ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <input type="color"
                          value={isHex ? val : '#000000'}
                          onChange={e => updateTheme(field.key, e.target.value)}
                          style={{ width: 36, height: 32, border: `1px solid ${C.border}`, borderRadius: 2, cursor: 'pointer', flexShrink: 0 }}
                        />
                        <input type="text" value={val}
                          onChange={e => updateTheme(field.key, e.target.value)}
                          style={{ ...inputStyle, flex: 1, fontSize: 11, padding: '5px 8px' }} placeholder="#000000"
                        />
                      </div>
                    ) : (
                      <input type="text" value={val}
                        onChange={e => updateTheme(field.key, e.target.value)}
                        style={{ ...inputStyle, fontSize: 11, padding: '5px 8px' }}
                        placeholder={field.key.includes('serif') ? "'Georgia', serif" : field.key.includes('sans') ? "'Inter', sans-serif" : '…'}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: live preview iframe ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0c0a0a', overflow: 'hidden' }}>
        {/* Preview header */}
        <div style={{ height: 36, background: 'rgba(0,0,0,0.6)', borderBottom: '1px solid rgba(255,90,44,0.2)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12, flexShrink: 0 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5a2c', boxShadow: '0 0 8px rgba(255,90,44,0.7)' }} />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,90,44,0.7)' }}>Live Preview</span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, letterSpacing: '0.2em', color: 'rgba(236,229,215,0.3)', marginLeft: 'auto' }}>Colors update in real time · Save to persist</span>
        </div>
        <iframe
          ref={iframeRef}
          src="/"
          onLoad={handleIframeLoad}
          style={{ flex: 1, border: 'none', width: '100%' }}
          title="Assessment Preview"
        />
      </div>
    </div>
  );
}