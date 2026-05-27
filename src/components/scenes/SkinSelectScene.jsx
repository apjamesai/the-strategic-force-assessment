import React, { useState } from 'react';
import { SKIN_LIST } from '@/lib/sfa/skins/index';

const LOGO_URL = 'https://media.base44.com/images/public/6a15850b10cbc3f2a02765fd/f1da5dcfe_Mandarin_Logo_Horizontal_Orange_Gradient.svg';

const C = {
  orange: '#FF481D',
  black: '#1E1E23',
  white: '#FFFFFF',
  silver: '#DBDBDB',
  lightBg: '#F7F7F7',
  border: '#E8E8E8',
  text: '#1E1E23',
  muted: '#6B6B6B',
};

const DELIVERABLES = [
  'A full score across all twelve practices',
  'Your strategic archetype and pattern',
  'Risk watchouts and blind-spot commentary',
  'A personalised development focus',
  'Four concrete next-step experiments',
  'A downloadable profile report',
];

const STATS = [
  { num: '20', unit: 'min', label: 'Estimated time' },
  { num: '36', unit: '', label: 'Questions' },
  { num: '12', unit: '', label: 'Practices mapped' },
  { num: '5', unit: '', label: 'Archetypes' },
];

export default function SkinSelectScene({ activeSkinId, onPickSkin, onNext }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: C.white,
      color: C.text,
      fontFamily: "'Roboto', sans-serif",
      overflowY: 'auto',
      cursor: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>

      {/* ── Top nav ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: C.white,
        borderBottom: `1px solid ${C.border}`,
        padding: '0 clamp(20px, 5vw, 56px)',
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 1px 0 rgba(0,0,0,0.06)',
      }}>
        <img src={LOGO_URL} alt="Mandarin" style={{ height: 32, display: 'block' }} />
        <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: C.muted, letterSpacing: '0.04em', display: 'none' }}>
          Strategic Force Assessment
        </span>
      </nav>

      {/* ── Hero — orange background ── */}
      <section style={{
        background: C.orange,
        padding: 'clamp(48px, 8vw, 96px) clamp(20px, 5vw, 56px)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Large ghost M in background */}
        <div style={{
          position: 'absolute', right: '-5%', top: '-10%',
          opacity: 0.07, pointerEvents: 'none',
          fontSize: 'min(60vw, 480px)',
          fontFamily: "'Roboto Condensed', sans-serif",
          fontWeight: 900, color: C.white,
          lineHeight: 1, userSelect: 'none',
        }}>M</div>

        <div style={{ maxWidth: 720, position: 'relative' }}>
          <div style={{
            fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 600,
            fontSize: 11, letterSpacing: '0.45em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.8)', marginBottom: 20,
          }}>
            Strategic Leadership Diagnostic
          </div>
          <h1 style={{
            fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700,
            fontSize: 'clamp(36px, 6vw, 72px)', lineHeight: 1.05,
            color: C.white, margin: '0 0 24px', letterSpacing: '-0.01em',
          }}>
            HOW DO YOU THINK,<br />DECIDE, AND LEAD?
          </h1>
          <p style={{
            fontFamily: "'Roboto', sans-serif", fontWeight: 300,
            fontSize: 'clamp(15px, 1.4vw, 18px)', lineHeight: 1.7,
            color: 'rgba(255,255,255,0.9)', maxWidth: 560, margin: 0,
          }}>
            A 36-question diagnostic mapping your strategic capability across twelve
            leadership practices — self-awareness, emotional mastery, critical thinking,
            creativity, decisiveness, collaboration, and influence.
          </p>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        borderBottom: `1px solid ${C.border}`,
      }}>
        {STATS.map(({ num, unit, label }) => (
          <div key={label} style={{
            padding: 'clamp(16px, 3vw, 28px) clamp(16px, 2vw, 24px)',
            borderRight: `1px solid ${C.border}`,
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700,
              fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1, color: C.orange,
            }}>
              {num}<span style={{ fontSize: '0.4em', color: C.muted, marginLeft: 2 }}>{unit}</span>
            </div>
            <div style={{
              fontFamily: "'Roboto', sans-serif", fontSize: 'clamp(11px, 1.2vw, 13px)',
              color: C.muted, marginTop: 6,
            }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── Main content ── */}
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        padding: 'clamp(40px, 6vw, 72px) clamp(20px, 5vw, 56px)',
        display: 'flex', flexDirection: 'column', gap: 'clamp(40px, 6vw, 64px)',
      }}>

        {/* What you'll receive */}
        <div>
          <div style={{
            fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700,
            fontSize: 10, letterSpacing: '0.45em', textTransform: 'uppercase',
            color: C.orange, marginBottom: 20,
            paddingBottom: 12, borderBottom: `2px solid ${C.orange}`, display: 'inline-block',
          }}>
            What you'll receive
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '12px 40px', marginTop: 4,
          }}>
            {DELIVERABLES.map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                <span style={{ color: C.orange, fontWeight: 700, flexShrink: 0, fontSize: 16, lineHeight: '1.5' }}>—</span>
                <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, lineHeight: 1.55, color: C.text }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Choose your narrative world */}
        <div>
          <div style={{
            fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700,
            fontSize: 10, letterSpacing: '0.45em', textTransform: 'uppercase',
            color: C.orange, marginBottom: 8,
            paddingBottom: 12, borderBottom: `2px solid ${C.orange}`, display: 'inline-block',
          }}>
            Choose your narrative world
          </div>
          <p style={{
            fontFamily: "'Roboto', sans-serif", fontSize: 14, lineHeight: 1.65,
            color: C.muted, maxWidth: 520, margin: '16px 0 24px',
          }}>
            Same questions, scored identically — set inside a different historical or cinematic universe.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {SKIN_LIST.map(skin => {
              const isActive = skin.id === activeSkinId;
              const isHov = hovered === skin.id;
              return (
                <button key={skin.id}
                  onClick={() => onPickSkin(skin.id)}
                  onMouseEnter={() => setHovered(skin.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    background: isActive ? 'rgba(255,72,29,0.06)' : isHov ? C.lightBg : C.white,
                    border: `1px solid ${isActive ? C.orange : C.border}`,
                    borderLeft: `4px solid ${isActive ? C.orange : 'transparent'}`,
                    padding: 'clamp(14px, 2vw, 18px) clamp(16px, 2vw, 24px)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                    textAlign: 'left', transition: 'all 0.15s ease', outline: 'none',
                  }}
                >
                  <div>
                    <div style={{
                      fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700,
                      fontSize: 'clamp(15px, 1.5vw, 17px)',
                      color: isActive ? C.orange : C.text, marginBottom: 4,
                    }}>
                      {skin.name}
                    </div>
                    <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: C.muted }}>{skin.tagline}</div>
                  </div>
                  {isActive && (
                    <span style={{
                      fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700,
                      fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase',
                      color: C.orange, flexShrink: 0,
                      background: 'rgba(255,72,29,0.1)', padding: '4px 10px',
                    }}>
                      Selected ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div style={{ paddingBottom: 40 }}>
          <button
            onClick={onNext}
            style={{
              background: C.orange, border: 'none', color: C.white,
              fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700,
              fontSize: 14, letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: 'clamp(14px, 2vw, 18px) clamp(32px, 5vw, 56px)',
              cursor: 'pointer', transition: 'background 0.2s',
              display: 'inline-flex', alignItems: 'center', gap: 12,
              width: '100%', maxWidth: 400, justifyContent: 'center',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#e03d18'}
            onMouseLeave={e => e.currentTarget.style.background = C.orange}
          >
            Begin the Assessment →
          </button>
          <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: C.muted, marginTop: 12 }}>
            No account required · Results available immediately
          </p>
        </div>

      </div>

      {/* ── Footer ── */}
      <div style={{
        borderTop: `1px solid ${C.border}`,
        padding: '24px clamp(20px, 5vw, 56px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
      }}>
        <img src={LOGO_URL} alt="Mandarin" style={{ height: 24 }} />
        <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: C.muted }}>
          © Mandarin {new Date().getFullYear()}
        </span>
      </div>

    </div>
  );
}