import React from 'react';
import { SKIN_LIST, setActiveSkinId } from '@/lib/sfa/skins/index';

/**
 * SkinSelectScene — the very first screen.
 * Mandarin brand colours (white / orange / black).
 * Explains what the assessment is, then lets the user pick a skin/theme.
 */
export default function SkinSelectScene({ activeSkinId, onPickSkin, onNext }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#0c0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '6vh 6vw',
      overflowY: 'auto',
    }}>
      <div style={{ maxWidth: 860, width: '100%', display: 'flex', flexDirection: 'column', gap: 56 }}>

        {/* Brand mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
            background: '#ff481d', boxShadow: '0 0 10px rgba(255,72,29,0.7)'
          }} />
          <span style={{ fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.45em', textTransform: 'uppercase', color: '#b3a994' }}>
            Mandarin
          </span>
        </div>

        {/* Hero text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 11, letterSpacing: '0.5em', textTransform: 'uppercase', color: '#ff5a2c' }}>
            The Strategic Force Assessment
          </div>
          <h1 style={{
            fontFamily: 'var(--serif)', fontWeight: 300, fontSize: 'clamp(38px, 6vw, 72px)',
            lineHeight: 1.05, letterSpacing: '-0.015em', color: '#ece5d7', margin: 0
          }}>
            How do you think, decide,<br />
            and lead under pressure?
          </h1>
          <p style={{
            fontFamily: 'var(--sans)', fontSize: 'clamp(14px, 1.1vw, 16px)',
            lineHeight: 1.75, fontWeight: 300, color: '#b3a994', maxWidth: 620
          }}>
            A 36-question diagnostic that maps your strategic capability across twelve
            leadership practices — spanning self-awareness, emotional mastery, curiosity,
            critical thinking, creativity, decisiveness, collaboration, and influence.
          </p>
        </div>

        {/* What to expect */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 1, background: 'rgba(255,90,44,0.08)', border: '1px solid rgba(255,90,44,0.1)'
        }}>
          {[
            { num: '20', unit: 'minutes', label: 'Est. completion time' },
            { num: '36', unit: 'questions', label: 'Across four levels' },
            { num: '12', unit: 'practices', label: 'Mapped and scored' },
            { num: '5', unit: 'archetypes', label: 'To reveal your pattern' },
          ].map(({ num, unit, label }) => (
            <div key={unit} style={{
              background: '#0c0a0a', padding: '28px 24px',
              display: 'flex', flexDirection: 'column', gap: 8
            }}>
              <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 42, lineHeight: 1, color: '#ff5a2c', fontWeight: 300 }}>
                {num}<span style={{ fontSize: 16, color: '#6b6354', marginLeft: 4 }}>{unit}</span>
              </div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 11, letterSpacing: '0.05em', color: '#b3a994' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* What you get */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: '#ff5a2c', borderTop: '1px solid rgba(255,90,44,0.2)', paddingTop: 24 }}>
            What you'll receive
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px 32px' }}>
            {[
              'A full score across all twelve practices',
              'Your strategic archetype and pattern',
              'Risk watchouts and blind-spot commentary',
              'A personalised development focus',
              'Four concrete experiments to run next',
              'A downloadable profile report',
            ].map(item => (
              <div key={item} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ color: '#ff5a2c', marginTop: 3, flexShrink: 0, fontSize: 12 }}>—</span>
                <span style={{ fontFamily: 'var(--sans)', fontSize: 13, lineHeight: 1.6, color: '#d6cdb9', fontWeight: 300 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Theme selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: '#ff5a2c', borderTop: '1px solid rgba(255,90,44,0.2)', paddingTop: 24 }}>
            Choose your narrative world
          </div>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 13, lineHeight: 1.65, color: '#b3a994', fontWeight: 300, maxWidth: 540, margin: 0 }}>
            The same 36 questions, scored identically — set inside a different historical or cinematic universe.
            Choose the world that resonates with you.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'rgba(255,90,44,0.06)', border: '1px solid rgba(255,90,44,0.1)' }}>
            {SKIN_LIST.map(skin => {
              const isActive = skin.id === activeSkinId;
              return (
                <button key={skin.id}
                  onClick={() => onPickSkin(skin.id)}
                  style={{
                    background: isActive ? 'rgba(255,90,44,0.1)' : '#0c0a0a',
                    border: 'none',
                    borderLeft: isActive ? '2px solid #ff5a2c' : '2px solid transparent',
                    padding: '20px 24px',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 20,
                    textAlign: 'left', transition: 'all 0.4s ease',
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,90,44,0.04)'; e.currentTarget.style.borderLeftColor = 'rgba(255,90,44,0.4)'; }}}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = '#0c0a0a'; e.currentTarget.style.borderLeftColor = 'transparent'; }}}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 18, color: isActive ? '#ff5a2c' : '#ece5d7', fontWeight: 300, marginBottom: 4 }}>
                      {skin.name}
                    </div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: '#b3a994', letterSpacing: '0.02em' }}>
                      {skin.tagline}
                    </div>
                  </div>
                  {isActive && (
                    <span style={{ fontFamily: 'var(--sans)', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#ff5a2c', flexShrink: 0 }}>Selected</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '4vh' }}>
          <button
            onClick={onNext}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 18,
              padding: '18px 40px',
              border: '1px solid rgba(255,90,44,0.45)',
              background: 'rgba(255,90,44,0.06)',
              color: '#ece5d7',
              fontFamily: 'var(--sans)', fontSize: 11, letterSpacing: '0.45em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.6s ease', fontWeight: 400,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,90,44,0.14)'; e.currentTarget.style.borderColor = '#ff5a2c'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,90,44,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,90,44,0.45)'; }}
          >
            Begin the assessment
            <span style={{ display: 'inline-block', width: 32, height: 1, background: '#ff5a2c', position: 'relative' }}>
              <span style={{ position: 'absolute', right: 0, top: -3, width: 7, height: 7, borderRight: '1px solid #ff5a2c', borderTop: '1px solid #ff5a2c', transform: 'rotate(45deg)' }} />
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}