import React from 'react';
import { SKIN_LIST } from '@/lib/sfa/skins/index';

/* Mandarin M logomark SVG */
function MandarinMark({ size = 32, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path d="M10 88 L10 32 L32 54 L50 18 L68 54 L90 32 L90 88 Z" fill={color} />
    </svg>
  );
}

/* Brand colours */
const C = {
  orange: '#FF481D',
  black: '#1E1E23',
  white: '#FFFFFF',
  silver: '#DBDBDB',
  lightSilver: '#EEEEEE',
};

const stat = (num, unit, label) => (
  <div key={unit} style={{
    background: C.black, padding: '28px 24px', borderBottom: `1px solid rgba(255,255,255,0.06)`
  }}>
    <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 48, lineHeight: 1, color: C.orange }}>
      {num}<span style={{ fontSize: 18, color: C.silver, marginLeft: 4, fontWeight: 400 }}>{unit}</span>
    </div>
    <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: C.silver, marginTop: 6 }}>{label}</div>
  </div>
);

export default function SkinSelectScene({ activeSkinId, onPickSkin, onNext }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: C.black,
      color: C.white,
      fontFamily: "'Roboto', sans-serif",
      overflowY: 'auto',
      cursor: 'auto',
    }}>
      {/* Top nav bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: C.black,
        borderBottom: `3px solid ${C.orange}`,
        padding: '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <MandarinMark size={28} color={C.orange} />
          <span style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: '0.05em', color: C.white }}>
            mandarin
          </span>
        </div>
        <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: C.silver, letterSpacing: '0.05em' }}>
          Strategic Force Assessment
        </div>
      </div>

      {/* Hero — orange background */}
      <div style={{
        background: C.orange,
        padding: '64px 40px 56px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Large faded M mark */}
        <div style={{ position: 'absolute', right: -40, top: -20, opacity: 0.12, pointerEvents: 'none' }}>
          <MandarinMark size={320} color={C.white} />
        </div>
        <div style={{ maxWidth: 760, position: 'relative' }}>
          <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 600, fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', marginBottom: 20 }}>
            Strategic Leadership Diagnostic
          </div>
          <h1 style={{
            fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700,
            fontSize: 'clamp(40px, 7vw, 80px)', lineHeight: 1.0,
            color: C.white, margin: '0 0 24px', letterSpacing: '-0.01em',
          }}>
            HOW DO YOU THINK,<br />DECIDE, AND LEAD?
          </h1>
          <p style={{
            fontFamily: "'Roboto', sans-serif", fontWeight: 400,
            fontSize: 'clamp(15px, 1.4vw, 18px)', lineHeight: 1.65,
            color: 'rgba(255,255,255,0.88)', maxWidth: 580, margin: 0
          }}>
            A 36-question diagnostic that maps your strategic capability across twelve
            leadership practices — spanning self-awareness, emotional mastery, critical
            thinking, creativity, decisiveness, collaboration, and influence.
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        background: 'rgba(0,0,0,0.3)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {[
          { num: '20', unit: 'min', label: 'Estimated completion' },
          { num: '36', unit: '', label: 'Questions across 4 levels' },
          { num: '12', unit: '', label: 'Practices mapped & scored' },
          { num: '5', unit: '', label: 'Archetypes to reveal' },
        ].map(({ num, unit, label }) => stat(num, unit, label))}
      </div>

      {/* Content */}
      <div style={{ padding: '48px 40px', maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 56 }}>

        {/* What you'll receive */}
        <div>
          <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '0.45em', textTransform: 'uppercase', color: C.orange, marginBottom: 24 }}>
            What you'll receive
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px 40px' }}>
            {[
              'A full score across all twelve practices',
              'Your strategic archetype and pattern',
              'Risk watchouts and blind-spot commentary',
              'A personalised development focus',
              'Four concrete experiments to run next',
              'A downloadable profile report',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <span style={{ color: C.orange, fontWeight: 700, flexShrink: 0, marginTop: 2, fontSize: 14 }}>—</span>
                <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, lineHeight: 1.6, color: C.silver, fontWeight: 300 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: `3px solid ${C.orange}`, width: 60 }} />

        {/* Theme selection */}
        <div>
          <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '0.45em', textTransform: 'uppercase', color: C.orange, marginBottom: 8 }}>
            Choose your narrative world
          </div>
          <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, lineHeight: 1.65, color: C.silver, fontWeight: 300, maxWidth: 560, margin: '0 0 24px' }}>
            Same 36 questions, scored identically — set inside a different historical or cinematic universe. Choose the world that resonates with you.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {SKIN_LIST.map(skin => {
              const isActive = skin.id === activeSkinId;
              return (
                <button key={skin.id}
                  onClick={() => onPickSkin(skin.id)}
                  style={{
                    background: isActive ? 'rgba(255,72,29,0.12)' : 'rgba(255,255,255,0.03)',
                    border: 'none',
                    borderLeft: `4px solid ${isActive ? C.orange : 'transparent'}`,
                    padding: '18px 24px',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
                    textAlign: 'left', transition: 'all 0.2s ease',
                    outline: 'none',
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderLeftColor = 'rgba(255,72,29,0.5)'; }}}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderLeftColor = 'transparent'; }}}
                >
                  <div>
                    <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 17, color: isActive ? C.orange : C.white, marginBottom: 4 }}>
                      {skin.name}
                    </div>
                    <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: C.silver, fontWeight: 300 }}>
                      {skin.tagline}
                    </div>
                  </div>
                  {isActive && (
                    <span style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: C.orange, flexShrink: 0 }}>
                      Selected ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', paddingBottom: 40 }}>
          <button
            onClick={onNext}
            style={{
              background: C.orange,
              border: 'none',
              color: C.white,
              fontFamily: "'Roboto Condensed', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '18px 48px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#e03d18'}
            onMouseLeave={e => e.currentTarget.style.background = C.orange}
          >
            Begin the Assessment →
          </button>
        </div>

      </div>
    </div>
  );
}