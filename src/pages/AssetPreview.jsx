import React, { useEffect, useState } from 'react';
import { SKINS, getActiveSkinId } from '@/lib/sfa/skins/index';

/**
 * AssetPreview — displays all asset types (colors, typography, buttons, SVGs, animations)
 * from the active skin in a single organized view. Used in SkinEditor for live verification.
 */
export default function AssetPreview() {
  const [theme, setTheme] = useState({});
  const [activeSkinId, setActiveSkinId] = useState(getActiveSkinId());

  const skin = SKINS[activeSkinId] || SKINS.force_trial;
  const baseTheme = skin.theme || {};

  // Merge root CSS vars into state for live updates
  useEffect(() => {
    const root = document.documentElement;
    const merged = {};
    Object.entries(baseTheme).forEach(([k, v]) => {
      const key = k.startsWith('--') ? k.slice(2) : k;
      merged[key] = getComputedStyle(root).getPropertyValue(`--${key}`).trim() || v;
    });
    setTheme(merged);
  }, [baseTheme]);

  // Listen for skin changes from SkinEditor
  useEffect(() => {
    const handleSkinChange = () => setActiveSkinId(getActiveSkinId());
    window.addEventListener('sfa:skin-change', handleSkinChange);
    return () => window.removeEventListener('sfa:skin-change', handleSkinChange);
  }, []);

  const getCSSVar = (key) => getComputedStyle(document.documentElement).getPropertyValue(`--${key}`).trim();

  return (
    <div style={{ background: getCSSVar('--bg') || '#0c0a0a', color: getCSSVar('--ink') || '#ece5d7', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <h1 style={{ fontSize: 48, marginBottom: 8, fontStyle: 'italic' }}>Asset Preview</h1>
        <p style={{ fontSize: 14, opacity: 0.6, marginBottom: 40 }}>All design system assets for: <strong>{skin.name}</strong></p>

        {/* Colors */}
        <section style={{ marginBottom: 60 }}>
          <h2 style={{ fontSize: 28, marginBottom: 20, borderBottom: '1px solid rgba(255,90,44,0.2)', paddingBottom: 10 }}>Colors</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
            {['amber', 'brand-orange', 'brand-tangerine', 'ink', 'ink-soft', 'ink-mute', 'ink-label', 'ink-dim', 'bg', 'panel'].map(key => {
              const val = getCSSVar(`--${key}`);
              return (
                <div key={key}>
                  <div style={{
                    width: '100%', height: 60, borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)',
                    background: val, marginBottom: 8,
                  }} />
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>--{key}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{val}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Typography */}
        <section style={{ marginBottom: 60 }}>
          <h2 style={{ fontSize: 28, marginBottom: 20, borderBottom: '1px solid rgba(255,90,44,0.2)', paddingBottom: 10 }}>Typography</h2>
          
          {/* Fonts */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 16, marginBottom: 16, opacity: 0.8 }}>Fonts</h3>
            <div style={{ display: 'grid', gap: 20 }}>
              {['serif', 'sans'].map(type => (
                <div key={type}>
                  <div style={{ fontSize: 12, color: 'rgba(255,90,44,0.8)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>--{type}</div>
                  <div style={{
                    fontFamily: getCSSVar(`--${type}`),
                    fontSize: 20,
                    lineHeight: 1.5,
                    padding: 16,
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 4,
                  }}>
                    The quick brown fox jumps over the lazy dog
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Font sizes */}
          <div>
            <h3 style={{ fontSize: 16, marginBottom: 16, opacity: 0.8 }}>Sizes</h3>
            <div style={{ display: 'grid', gap: 16 }}>
              {['display', 'heading', 'body', 'label', 'eyebrow'].map(type => {
                const sizeVal = getCSSVar(`--size-${type}`);
                return (
                  <div key={type}>
                    <div style={{ fontSize: 11, color: 'rgba(255,90,44,0.8)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>size-{type}</div>
                    <div style={{
                      fontSize: sizeVal || 16,
                      padding: 12,
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: 4,
                    }}>
                      This text is {sizeVal || 'unset'} ({type})
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Components */}
        <section style={{ marginBottom: 60 }}>
          <h2 style={{ fontSize: 28, marginBottom: 20, borderBottom: '1px solid rgba(255,90,44,0.2)', paddingBottom: 10 }}>Components</h2>
          
          {/* Buttons */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 16, marginBottom: 16, opacity: 0.8 }}>Buttons</h3>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button style={{
                padding: '12px 24px',
                background: getCSSVar('--amber'),
                color: getCSSVar('--bg'),
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>Primary Button</button>
              <button style={{
                padding: '12px 24px',
                background: 'transparent',
                color: getCSSVar('--ink'),
                border: `1px solid ${getCSSVar('--amber')}`,
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>Outline Button</button>
              <button style={{
                padding: '12px 24px',
                background: 'transparent',
                color: getCSSVar('--ink-mute'),
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>Ghost Button</button>
            </div>
          </div>

          {/* Cards */}
          <div>
            <h3 style={{ fontSize: 16, marginBottom: 16, opacity: 0.8 }}>Cards</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{
                  background: getCSSVar('--panel'),
                  border: '1px solid rgba(255,90,44,0.15)',
                  borderRadius: 4,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}>
                  <div style={{ fontSize: 10, color: getCSSVar('--amber'), letterSpacing: '0.05em', textTransform: 'uppercase' }}>Card Tag</div>
                  <h4 style={{ fontSize: 18, margin: 0 }}>Card Title {i}</h4>
                  <p style={{ fontSize: 13, color: getCSSVar('--ink-soft'), margin: 0, lineHeight: 1.5 }}>
                    This is example card content. Use cards to organize related information and actions.
                  </p>
                  <button style={{
                    marginTop: 8,
                    padding: '8px 12px',
                    background: 'transparent',
                    color: getCSSVar('--amber'),
                    border: `1px solid ${getCSSVar('--amber')}`,
                    borderRadius: 2,
                    cursor: 'pointer',
                    fontSize: 10,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}>Learn More →</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Animations */}
        <section>
          <h2 style={{ fontSize: 28, marginBottom: 20, borderBottom: '1px solid rgba(255,90,44,0.2)', paddingBottom: 10 }}>Animations</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { name: 'Fade', style: { animation: 'fadeInOut 2s ease-in-out infinite' } },
              { name: 'Pulse', style: { animation: 'pulse 2s ease-in-out infinite' } },
              { name: 'Slide', style: { animation: 'slideIn 2s ease-in-out infinite' } },
            ].map(anim => (
              <div key={anim.name} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 4, padding: 20, textAlign: 'center' }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: getCSSVar('--amber'),
                  margin: '0 auto 12px',
                  ...anim.style,
                }} />
                <div style={{ fontSize: 12, color: getCSSVar('--ink-soft') }}>{anim.name}</div>
              </div>
            ))}
          </div>
          <style>{`
            @keyframes fadeInOut { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
            @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
            @keyframes slideIn { 0% { transform: translateX(-20px); } 50% { transform: translateX(20px); } 100% { transform: translateX(-20px); } }
          `}</style>
        </section>
      </div>
    </div>
  );
}