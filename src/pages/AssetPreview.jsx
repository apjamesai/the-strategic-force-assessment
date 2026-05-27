import React, { useEffect, useState, useCallback } from 'react';
import { SKINS, getActiveSkinId } from '@/lib/sfa/skins/index';

/**
 * AssetPreview — comprehensive showcase of ALL assessment components
 * Shows every UI element, input type, question format, and visual pattern used throughout
 */

export default function AssetPreview() {
  const [activeSkinId, setActiveSkinId] = useState(getActiveSkinId());
  const [styleUpdate, setStyleUpdate] = useState(0);
  const skin = SKINS[activeSkinId] || SKINS.force_trial;

  // Listen for skin changes and CSS variable updates
  useEffect(() => {
    const handleSkinChange = () => setActiveSkinId(getActiveSkinId());
    const handleStyleChange = () => setStyleUpdate(v => v + 1);
    
    window.addEventListener('sfa:skin-change', handleSkinChange);
    
    // Watch for style changes on root element
    const observer = new MutationObserver(() => setStyleUpdate(v => v + 1));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
    
    return () => {
      window.removeEventListener('sfa:skin-change', handleSkinChange);
      observer.disconnect();
    };
  }, []);

  // Get theme value from inline styles first, then computed styles
  const getThemeValue = useCallback((key) => {
    const k = key.startsWith('--') ? key : `--${key}`;
    try {
      // Try inline styles first (live edits set here)
      let val = document.documentElement.style.getPropertyValue(k).trim();
      if (val) return val;
      // Fall back to computed styles
      val = getComputedStyle(document.documentElement).getPropertyValue(k).trim();
      return val || undefined;
    } catch {
      return undefined;
    }
  }, [styleUpdate]);

  const Section = ({ title, children }) => (
    <section style={{ marginBottom: 60 }}>
      <h2 style={{ fontSize: 28, marginBottom: 24, borderBottom: `1px solid ${getThemeValue('amber')}40`, paddingBottom: 12, color: getThemeValue('ink') }}>{title}</h2>
      {children}
    </section>
  );

  const Label = ({ children }) => (
    <div style={{ fontSize: 10, color: getThemeValue('amber'), letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 600 }}>{children}</div>
  );

  return (
    <div style={{ background: getThemeValue('bg'), color: getThemeValue('ink'), minHeight: '100vh', padding: '40px' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* Header */}
        <h1 style={{ fontSize: 48, marginBottom: 8, fontStyle: 'italic', fontFamily: getThemeValue('serif') }}>Asset Preview</h1>
        <p style={{ fontSize: 14, opacity: 0.6, marginBottom: 50 }}>Complete component library for: <strong>{skin.name}</strong></p>

        {/* Colors */}
        <Section title="Colors">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
            {['amber', 'brand-orange', 'brand-tangerine', 'ink', 'ink-soft', 'ink-mute', 'ink-label', 'ink-dim', 'bg', 'panel'].map(key => {
              const val = getThemeValue(key);
              return (
                <div key={key}>
                  <div style={{
                    width: '100%', height: 80, borderRadius: 4, border: `1px solid ${getThemeValue('ink')}20`,
                    background: val, marginBottom: 10,
                  }} />
                  <div style={{ fontSize: 11, color: getThemeValue('ink-soft') }}>--{key}</div>
                  <div style={{ fontSize: 9, color: getThemeValue('ink-mute'), fontFamily: 'monospace', wordBreak: 'break-all' }}>{val}</div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Typography */}
        <Section title="Typography">
          <div style={{ marginBottom: 40 }}>
            <Label>Fonts</Label>
            <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
              {['serif', 'sans'].map(type => (
                <div key={type}>
                  <div style={{ fontSize: 11, color: getThemeValue('amber'), marginBottom: 8, textTransform: 'uppercase', fontWeight: 600 }}>--{type}</div>
                  <div style={{
                    fontFamily: getThemeValue(type),
                    fontSize: 22,
                    lineHeight: 1.6,
                    padding: 20,
                    background: getThemeValue('panel'),
                    borderRadius: 4,
                    border: `1px solid ${getThemeValue('ink')}10`,
                  }}>
                    The quick brown fox jumps over the lazy dog
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Font Sizes in Context</Label>
            <div style={{ display: 'grid', gap: 14 }}>
              {[
                { name: 'Display/Hero (h1)', size: 'display', text: 'Strategic Force Assessment' },
                { name: 'Heading (h2/h3)', size: 'heading', text: 'This is a section heading' },
                { name: 'Body Text', size: 'body', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.' },
                { name: 'Label/Small', size: 'label', text: 'Label text or metadata' },
                { name: 'Eyebrow/Caption', size: 'eyebrow', text: 'EYEBROW · UPPER' },
              ].map(item => {
                const sizeVal = getThemeValue(`size-${item.size}`);
                return (
                  <div key={item.size}>
                    <div style={{ fontSize: 10, color: getThemeValue('ink-mute'), marginBottom: 6 }}>{item.name} ({sizeVal})</div>
                    <div style={{
                      fontSize: sizeVal || 16,
                      lineHeight: 1.5,
                      padding: 16,
                      background: getThemeValue('panel'),
                      borderRadius: 4,
                      border: `1px solid ${getThemeValue('ink')}10`,
                      fontFamily: item.size === 'eyebrow' ? getThemeValue('sans') : getThemeValue('serif'),
                      fontStyle: item.size === 'display' || item.size === 'heading' ? 'italic' : 'normal',
                    }}>
                      {item.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Section>

        {/* Question Types & Inputs */}
        <Section title="Question Types &amp; Inputs">
          <div style={{ marginBottom: 32 }}>
            <Label>Multiple Choice Options</Label>
            <div style={{ display: 'grid', gap: 1, border: `1px solid ${getThemeValue('ink')}20`, background: `${getThemeValue('amber')}08` }}>
              {['A)', 'B)', 'C)'].map((letter, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 20, padding: '18px 24px',
                  background: i === 1 ? `${getThemeValue('amber')}10` : getThemeValue('bg'),
                  borderLeft: i === 1 ? `2px solid ${getThemeValue('amber')}` : 'none',
                  borderColor: i === 1 ? getThemeValue('amber') : `${getThemeValue('ink')}05`,
                  cursor: 'pointer', transition: 'all 0.3s',
                }}>
                  <span style={{ fontSize: 18, fontFamily: getThemeValue('serif'), fontStyle: 'italic', color: getThemeValue('amber'), flexShrink: 0 }}>{letter}</span>
                  <span style={{ fontSize: 14, color: getThemeValue('ink-soft') }}>Option text goes here with supporting context</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <Label>Rating Scale (1-5)</Label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, border: `1px solid ${getThemeValue('ink')}20`, background: `${getThemeValue('amber')}08` }}>
              {[1, 2, 3, 4, 5].map(num => (
                <div key={num} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '20px 12px',
                  background: num === 3 ? `${getThemeValue('amber')}10` : getThemeValue('bg'),
                  borderColor: `${getThemeValue('ink')}05`,
                  cursor: 'pointer',
                }}>
                  <div style={{ fontSize: 28, fontFamily: getThemeValue('serif'), fontStyle: 'italic', color: getThemeValue('amber') }}>{num}</div>
                  <div style={{ fontSize: 9, color: getThemeValue('ink-label'), letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.2 }}>
                    {num === 1 ? 'Strongly\nDisagree' : num === 5 ? 'Strongly\nAgree' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <Label>Ranking / Drag-Drop Items</Label>
            <div style={{ display: 'grid', gap: 10 }}>
              {['First Priority', 'Second Priority', 'Third Priority'].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
                  background: getThemeValue('panel'),
                  border: `1px solid ${getThemeValue('ink')}10`,
                  borderRadius: 4,
                  cursor: 'grab',
                }}>
                  <div style={{ fontSize: 20, fontFamily: getThemeValue('serif'), fontStyle: 'italic', color: getThemeValue('amber'), minWidth: 30 }}>{i + 1}</div>
                  <div style={{ fontSize: 14, color: getThemeValue('ink-soft') }}>{item}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <Label>Text Input / Textarea</Label>
            <textarea
              placeholder="Enter response here..."
              style={{
                width: '100%', minHeight: 100,
                background: getThemeValue('bg'),
                border: `1px solid ${getThemeValue('amber')}50`,
                borderBottom: `2px solid ${getThemeValue('amber')}`,
                color: getThemeValue('ink'),
                fontFamily: getThemeValue('serif'),
                fontSize: 18,
                padding: '12px 0',
                outline: 'none',
                fontStyle: 'italic',
                fontWeight: 300,
              }}
            />
            <div style={{ fontSize: 10, color: getThemeValue('ink-label'), marginTop: 8, letterSpacing: '0.1em' }}>CHARACTER COUNT: 0/500</div>
          </div>

          <div>
            <Label>Submit Button (Ready State)</Label>
            <button style={{
              padding: '14px 28px',
              background: `${getThemeValue('amber')}F0`,
              border: `1px solid ${getThemeValue('amber')}`,
              color: getThemeValue('bg'),
              fontFamily: getThemeValue('sans'),
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              borderRadius: 2,
              transition: 'all 0.3s',
            }}>Continue → <span style={{ display: 'inline-block', marginLeft: 8, width: 20, height: 1, background: getThemeValue('bg') }} /></button>
          </div>
        </Section>

        {/* Cards & Panels */}
        <Section title="Cards &amp; Panels">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {['Practice Tile', 'Info Card', 'Result Card'].map((title, i) => (
              <div key={i} style={{
                background: getThemeValue('panel'),
                border: `1px solid ${getThemeValue('ink')}15`,
                borderRadius: 4,
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}>
                <div style={{ fontSize: 9, color: getThemeValue('amber'), letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>Card Type</div>
                <h4 style={{ fontSize: 18, margin: 0, fontFamily: getThemeValue('serif'), fontStyle: 'italic', color: getThemeValue('ink') }}>{title}</h4>
                <p style={{ fontSize: 12, color: getThemeValue('ink-soft'), margin: 0, lineHeight: 1.6 }}>
                  Card content with supporting description. This can contain metrics, labels, or narrative text.
                </p>
                <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: `1px solid ${getThemeValue('ink')}10` }}>
                  <div style={{ fontSize: 10, color: getThemeValue('amber'), fontFamily: getThemeValue('serif'), fontStyle: 'italic' }}>Metric or status</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Assessment-Specific Components */}
        <Section title="Assessment Components">
          <div style={{ marginBottom: 32 }}>
            <Label>Scene Metadata Header</Label>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '0 0 12px', borderBottom: `1px solid ${getThemeValue('ink')}15`,
              marginBottom: 20,
            }}>
              <div>
                <div style={{ fontSize: 10, color: getThemeValue('amber'), letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>Scene 5 of 12</div>
                <div style={{ fontSize: 10, color: getThemeValue('ink-mute'), letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>Practice Scene</div>
              </div>
              <div style={{ fontSize: 10, color: getThemeValue('ink-mute'), letterSpacing: '0.05em', textTransform: 'uppercase' }}>Time: 2:45</div>
            </div>
            <h3 style={{ fontSize: 22, margin: '0 0 16px', fontFamily: getThemeValue('serif'), fontStyle: 'italic', color: getThemeValue('ink') }}>Main scene question or prompt text goes here</h3>
          </div>

          <div style={{ marginBottom: 32 }}>
            <Label>Progress Indicators</Label>
            <div style={{ display: 'grid', gap: 16 }}>
              {[
                { label: 'Linear Progress Bar', percent: 45 },
                { label: 'Completed %', percent: 75 },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ fontSize: 11, color: getThemeValue('ink-mute'), marginBottom: 8 }}>{item.label}</div>
                  <div style={{ height: 2, background: `${getThemeValue('ink')}15`, borderRadius: 1, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${item.percent}%`,
                      background: `linear-gradient(to right, ${getThemeValue('brand-orange')}, ${getThemeValue('brand-tangerine')})`,
                      boxShadow: `0 0 8px ${getThemeValue('amber')}80`,
                    }} />
                  </div>
                  <div style={{ fontSize: 10, color: getThemeValue('ink-mute'), marginTop: 4 }}>{item.percent}%</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Badge / Pill Tags</Label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Leadership', 'Strategic', 'Resilience', 'Communication', 'Adaptability'].map(tag => (
                <div key={tag} style={{
                  padding: '6px 12px',
                  background: `${getThemeValue('amber')}20`,
                  border: `1px solid ${getThemeValue('amber')}60`,
                  color: getThemeValue('amber'),
                  fontSize: 11,
                  fontWeight: 600,
                  borderRadius: 100,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}>
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Animations & Effects */}
        <Section title="Animations &amp; Effects">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 20 }}>
            {[
              { name: 'Glow', animation: 'asset-glow 2s ease-in-out infinite' },
              { name: 'Pulse', animation: 'asset-pulse 2s ease-in-out infinite' },
              { name: 'Float', animation: 'asset-float 3s ease-in-out infinite' },
              { name: 'Shimmer', animation: 'asset-shimmer 3s ease-in-out infinite' },
            ].map(anim => (
              <div key={anim.name} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: getThemeValue('amber'),
                  margin: '0 auto 12px',
                  animation: anim.animation,
                  boxShadow: `0 0 20px ${getThemeValue('amber')}60`,
                }} />
                <div style={{ fontSize: 12, color: getThemeValue('ink-soft'), fontWeight: 600 }}>{anim.name}</div>
              </div>
            ))}
          </div>
          <style>{`
            @keyframes asset-glow { 0%, 100% { opacity: 0.6; box-shadow: 0 0 10px ${getThemeValue('amber')}40; } 50% { opacity: 1; box-shadow: 0 0 30px ${getThemeValue('amber')}80; } }
            @keyframes asset-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
            @keyframes asset-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
            @keyframes asset-shimmer { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
          `}</style>
        </Section>

      </div>
    </div>
  );
}