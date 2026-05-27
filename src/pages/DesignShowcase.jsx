import React from 'react';

/**
 * Design Showcase — displays all design system elements (colors, fonts, components, animations)
 * Used in SkinEditor preview iframe to let admins see all assets in one place
 */

const showcaseStyle = `
  * { box-sizing: border-box; }
  body { margin: 0; padding: 40px; font-family: var(--sans, sans-serif); background: var(--bg, #fff); color: var(--ink, #000); }
  h1, h2, h3 { font-family: var(--serif, serif); }
  .section { margin-bottom: 60px; padding-bottom: 40px; border-bottom: 1px solid var(--border, #ddd); }
  .section h2 { font-size: 32px; margin: 0 0 24px; color: var(--ink); font-weight: 300; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px; }
  .card { background: var(--panel, #f5f5f5); padding: 16px; border: 1px solid var(--border, #ddd); border-radius: 4px; }

  /* Colors section */
  .color-swatch { width: 100%; height: 100px; border-radius: 4px; margin-bottom: 8px; border: 1px solid var(--border, #ddd); }
  .color-name { font-size: 12px; font-weight: 600; margin-bottom: 4px; }
  .color-value { font-size: 11px; color: var(--ink-mute, #666); font-family: monospace; }

  /* Typography section */
  .text-sample { padding: 16px; background: var(--panel, #f5f5f5); border: 1px solid var(--border, #ddd); border-radius: 4px; margin-bottom: 12px; }
  .serif { font-family: var(--serif, serif); }
  .sans { font-family: var(--sans, sans-serif); }
  .size-96 { font-size: 96px; line-height: 1; }
  .size-72 { font-size: 72px; line-height: 1; }
  .size-48 { font-size: 48px; line-height: 1.2; }
  .size-32 { font-size: 32px; line-height: 1.2; }
  .size-24 { font-size: 24px; line-height: 1.3; }
  .size-18 { font-size: 18px; line-height: 1.5; }
  .size-16 { font-size: 16px; line-height: 1.5; }
  .size-14 { font-size: 14px; line-height: 1.6; }
  .size-13 { font-size: 13px; line-height: 1.6; }
  .size-12 { font-size: 12px; line-height: 1.6; }
  .size-11 { font-size: 11px; line-height: 1.6; }
  .size-10 { font-size: 10px; line-height: 1.6; }
  .light { font-weight: 300; }
  .regular { font-weight: 400; }
  .bold { font-weight: 600; }
  .italic { font-style: italic; }

  /* Buttons */
  .button { 
    padding: 12px 20px; 
    border: 1px solid var(--border, #ddd); 
    background: transparent; 
    color: var(--ink, #000); 
    font-family: var(--sans, sans-serif); 
    font-size: 12px; 
    cursor: pointer; 
    border-radius: 4px; 
    transition: all 0.3s;
    margin-right: 8px;
    margin-bottom: 8px;
  }
  .button:hover { background: var(--panel, #f5f5f5); }
  .button-primary { 
    background: var(--amber, #ff5a2c); 
    color: var(--primary-foreground, white); 
    border-color: var(--amber);
  }
  .button-primary:hover { opacity: 0.9; }

  /* Animations preview */
  @keyframes showcase-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  @keyframes showcase-glow {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
  .animated-float { animation: showcase-float 3s ease-in-out infinite; }
  .animated-glow { animation: showcase-glow 2s ease-in-out infinite; }
  
  /* SVG preview */
  .svg-showcase { width: 100px; height: 100px; margin: 12px; }
  svg { width: 100%; height: 100%; stroke: var(--amber, #ff5a2c); fill: none; stroke-width: 2; }

  /* Spacing reference */
  .spacing-example { display: flex; gap: 16px; margin-bottom: 12px; align-items: center; }
  .spacing-box { background: var(--amber, #ff5a2c); opacity: 0.2; border-radius: 4px; }
`;

export default function DesignShowcase() {
  // Extract CSS variables from root element for display
  const getCSSVar = (varName) => {
    try {
      const val = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      return val || 'undefined';
    } catch {
      return 'undefined';
    }
  };

  const colors = [
    { name: 'Primary', key: '--primary', desc: 'Main brand color' },
    { name: 'Amber/Accent', key: '--amber', desc: 'Primary accent' },
    { name: 'Background', key: '--bg', desc: 'Main background' },
    { name: 'Panel', key: '--panel', desc: 'Card/panel background' },
    { name: 'Ink (text)', key: '--ink', desc: 'Primary text' },
    { name: 'Ink Soft', key: '--ink-soft', desc: 'Secondary text' },
    { name: 'Ink Mute', key: '--ink-mute', desc: 'Muted text' },
    { name: 'Border', key: '--border', desc: 'Border color' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--sans, sans-serif)' }}>
      <style>{showcaseStyle}</style>
      
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: 48, margin: '0 0 40px', fontFamily: 'var(--serif)' }}>Design System Showcase</h1>

        {/* Colors */}
        <div className="section">
          <h2>Colors</h2>
          <div className="grid">
            {colors.map(c => {
              const val = getCSSVar(c.key);
              // Determine if it's HSL or hex
              const isHSL = val.includes('hsl');
              let displayVal = val;
              let bgColor = 'transparent';
              
              if (isHSL) {
                bgColor = `hsl(${val})`;
              } else {
                bgColor = val;
              }

              return (
                <div key={c.key} className="card">
                  <div className="color-swatch" style={{ background: bgColor }} />
                  <div className="color-name">{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginBottom: 8 }}>{c.desc}</div>
                  <div className="color-value">{c.key}</div>
                  <div className="color-value" style={{ fontSize: 10, opacity: 0.6 }}>{displayVal}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Typography */}
        <div className="section">
          <h2>Typography</h2>
          
          <h3 style={{ fontSize: 18, margin: '20px 0 12px', fontWeight: 400 }}>Serif Font (Display)</h3>
          <div className="text-sample serif size-96">96px</div>
          <div className="text-sample serif size-72">72px</div>
          <div className="text-sample serif size-48">48px</div>
          <div className="text-sample serif size-32">32px</div>
          <div className="text-sample serif size-24">24px</div>
          
          <h3 style={{ fontSize: 18, margin: '24px 0 12px', fontWeight: 400 }}>Sans Font (Body)</h3>
          <div className="text-sample sans size-18 light">18px Light</div>
          <div className="text-sample sans size-16 regular">16px Regular</div>
          <div className="text-sample sans size-14">14px Regular</div>
          <div className="text-sample sans size-13">13px Regular</div>
          <div className="text-sample sans size-12">12px Regular</div>
          <div className="text-sample sans size-11">11px Regular</div>
          <div className="text-sample sans size-10 bold" style={{ letterSpacing: '0.4em', textTransform: 'uppercase' }}>10px Bold Caps</div>

          <h3 style={{ fontSize: 18, margin: '24px 0 12px', fontWeight: 400 }}>Text Combinations</h3>
          <div className="text-sample">
            <div className="serif size-32 italic">32px Serif Italic</div>
            <div className="sans size-13" style={{ color: 'var(--ink-mute)', marginTop: 8 }}>13px Sans Regular · Supplementary text</div>
          </div>
        </div>

        {/* Components */}
        <div className="section">
          <h2>Components</h2>
          
          <h3 style={{ fontSize: 14, margin: '0 0 12px', fontWeight: 600 }}>Buttons</h3>
          <div style={{ marginBottom: 20 }}>
            <button className="button">Secondary</button>
            <button className="button button-primary">Primary</button>
            <button className="button" style={{ opacity: 0.5, pointerEvents: 'none' }}>Disabled</button>
          </div>

          <h3 style={{ fontSize: 14, margin: '20px 0 12px', fontWeight: 600 }}>Text Styles</h3>
          <div className="card">
            <div style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 12 }}>Eyebrow / Label</div>
            <div style={{ fontSize: 28, fontFamily: 'var(--serif)', fontWeight: 300, marginBottom: 12, fontStyle: 'italic' }}>Heading (28px Serif)</div>
            <div style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--ink-soft)' }}>Body text example. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</div>
          </div>
        </div>

        {/* Animations */}
        <div className="section">
          <h2>Animations</h2>
          <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="card animated-float" style={{ width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'default' }}>
                <div style={{ fontSize: 48 }}>↑</div>
              </div>
              <div style={{ fontSize: 12, marginTop: 8 }}>Float Animation</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="card animated-glow" style={{ width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--amber)', opacity: 0.2 }} />
              <div style={{ fontSize: 12, marginTop: 8 }}>Glow Animation</div>
            </div>
          </div>
        </div>

        {/* SVG & Icons */}
        <div className="section">
          <h2>SVG Assets</h2>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <svg className="svg-showcase" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" />
              <line x1="10" y1="50" x2="90" y2="50" />
              <line x1="50" y1="10" x2="50" y2="90" />
            </svg>
            <svg className="svg-showcase" viewBox="0 0 100 100">
              <path d="M 20 80 Q 50 20 80 80" />
              <circle cx="20" cy="80" r="4" fill="var(--amber)" />
              <circle cx="80" cy="80" r="4" fill="var(--amber)" />
            </svg>
            <svg className="svg-showcase" viewBox="0 0 100 100">
              <rect x="10" y="10" width="80" height="80" rx="10" />
              <line x1="30" y1="30" x2="70" y2="70" />
              <line x1="70" y1="30" x2="30" y2="70" />
            </svg>
          </div>
        </div>

        {/* Spacing & Sizing Reference */}
        <div className="section">
          <h2>Spacing Reference</h2>
          <div className="spacing-example">
            <div style={{ fontSize: 12, minWidth: 40 }}>4px</div>
            <div className="spacing-box" style={{ width: 4, height: 20 }} />
          </div>
          <div className="spacing-example">
            <div style={{ fontSize: 12, minWidth: 40 }}>8px</div>
            <div className="spacing-box" style={{ width: 8, height: 20 }} />
          </div>
          <div className="spacing-example">
            <div style={{ fontSize: 12, minWidth: 40 }}>16px</div>
            <div className="spacing-box" style={{ width: 16, height: 20 }} />
          </div>
          <div className="spacing-example">
            <div style={{ fontSize: 12, minWidth: 40 }}>24px</div>
            <div className="spacing-box" style={{ width: 24, height: 20 }} />
          </div>
          <div className="spacing-example">
            <div style={{ fontSize: 12, minWidth: 40 }}>32px</div>
            <div className="spacing-box" style={{ width: 32, height: 20 }} />
          </div>
        </div>
      </div>
    </div>
  );
}