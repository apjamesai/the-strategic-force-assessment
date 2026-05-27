import React, { useState } from 'react';
import { SKIN_LIST, getActiveSkinId, setActiveSkinId } from '@/lib/sfa/skins/index';
import { BarChart2, Brain, AlertTriangle, Target, FlaskConical, Download } from 'lucide-react';

const LOGO_URL = 'https://media.base44.com/images/public/6a15850b10cbc3f2a02765fd/f1da5dcfe_Mandarin_Logo_Horizontal_Orange_Gradient.svg';

const C = {
  orange: '#FF481D',
  white: '#FFFFFF',
  lightBg: '#F7F7F7',
  border: '#E8E8E8',
  text: '#1E1E23',
  muted: '#6B6B6B',
};

const DELIVERABLES = [
  {
    icon: BarChart2,
    title: 'Full Practice Scores',
    desc: 'A scored breakdown across all twelve leadership practices — from self-awareness to influence.',
  },
  {
    icon: Brain,
    title: 'Your Strategic Archetype',
    desc: 'A named pattern that describes how you think, decide, and lead under real conditions.',
  },
  {
    icon: AlertTriangle,
    title: 'Risk Watchouts',
    desc: 'Three blind-spot overlays that reveal where your strengths can become liabilities.',
  },
  {
    icon: Target,
    title: 'Development Focus',
    desc: 'A personalised priority area — the one lever most likely to shift your leadership range.',
  },
  {
    icon: FlaskConical,
    title: 'Next-Step Experiments',
    desc: 'Four concrete, low-cost practices to run in the next 90 days. Pick one. Run it.',
  },
  {
    icon: Download,
    title: 'Downloadable Profile',
    desc: 'Your full result as a JSON profile — ready to reference, share, or revisit.',
  },
];

const STATS = [
  { num: '20', unit: 'min', label: 'Estimated time' },
  { num: '36', unit: '', label: 'Questions' },
  { num: '12', unit: '', label: 'Practices mapped' },
  { num: '5', unit: '', label: 'Archetypes' },
];

export default function WelcomePage() {
  const [activeSkinId, setActiveSkinIdState] = useState(getActiveSkinId);
  const [hovered, setHovered] = useState(null);

  const pickSkin = (id) => {
    setActiveSkinId(id);
    setActiveSkinIdState(id);
    window.dispatchEvent(new Event('sfa:skin-change'));
  };

  const begin = () => {
    window.location.href = '/assessment';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: C.white,
      color: C.text,
      fontFamily: "'Roboto', sans-serif",
      cursor: 'auto',
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: C.white,
        borderBottom: `1px solid ${C.border}`,
        padding: '0 clamp(20px, 5vw, 56px)',
        height: 64,
        display: 'flex', alignItems: 'center',
        boxShadow: '0 1px 0 rgba(0,0,0,0.06)',
      }}>
        <img src={LOGO_URL} alt="Mandarin" style={{ height: 32, display: 'block' }} />
      </nav>

      {/* Hero — solid orange, no decorations */}
      <section style={{
        background: C.orange,
        padding: 'clamp(48px, 8vw, 96px) clamp(20px, 5vw, 56px)',
      }}>
        <div style={{ maxWidth: 720 }}>
          <div style={{
            fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 600,
            fontSize: 11, letterSpacing: '0.45em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.75)', marginBottom: 20,
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

      {/* Stats bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        borderBottom: `1px solid ${C.border}`,
        background: C.white,
      }}>
        {STATS.map(({ num, unit, label }) => (
          <div key={label} style={{
            padding: 'clamp(16px, 3vw, 28px) clamp(12px, 2vw, 24px)',
            borderRight: `1px solid ${C.border}`,
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700,
              fontSize: 'clamp(26px, 4vw, 44px)', lineHeight: 1, color: C.orange,
            }}>
              {num}<span style={{ fontSize: '0.45em', color: C.muted, marginLeft: 2 }}>{unit}</span>
            </div>
            <div style={{
              fontFamily: "'Roboto', sans-serif", fontSize: 'clamp(11px, 1.2vw, 13px)',
              color: C.muted, marginTop: 6,
            }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{
        maxWidth: 1000, margin: '0 auto',
        padding: 'clamp(40px, 6vw, 72px) clamp(20px, 5vw, 56px)',
        display: 'flex', flexDirection: 'column', gap: 'clamp(40px, 6vw, 56px)',
      }}>

        {/* What you'll receive */}
        <div>
          <p style={{
            fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700,
            fontSize: 10, letterSpacing: '0.45em', textTransform: 'uppercase',
            color: C.orange, margin: '0 0 8px',
          }}>
            What you'll receive
          </p>
          <p style={{
            fontFamily: "'Roboto', sans-serif", fontSize: 14, lineHeight: 1.65,
            color: C.muted, maxWidth: 500, margin: '0 0 24px',
          }}>
            Six outputs generated from your responses — practical, specific, and immediately actionable.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 12,
          }}>
            {DELIVERABLES.map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{
                display: 'flex', alignItems: 'flex-start', gap: 16,
                padding: '20px 20px',
                border: `1px solid ${C.border}`,
                background: C.white,
                borderRadius: 4,
              }}>
                <div style={{
                  width: 40, height: 40, flexShrink: 0,
                  background: 'rgba(255,72,29,0.08)',
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={20} color={C.orange} strokeWidth={1.5} />
                </div>
                <div>
                  <div style={{
                    fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700,
                    fontSize: 15, color: C.text, marginBottom: 4,
                  }}>
                    {title}
                  </div>
                  <div style={{
                    fontFamily: "'Roboto', sans-serif", fontSize: 13,
                    lineHeight: 1.6, color: C.muted,
                  }}>
                    {desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Choose narrative world */}
        <div>
          <p style={{
            fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700,
            fontSize: 10, letterSpacing: '0.45em', textTransform: 'uppercase',
            color: C.orange, margin: '0 0 8px',
          }}>
            Choose your narrative world
          </p>
          <p style={{
            fontFamily: "'Roboto', sans-serif", fontSize: 14, lineHeight: 1.65,
            color: C.muted, maxWidth: 500, margin: '0 0 20px',
          }}>
            Same 36 questions, scored identically — set inside a different historical or cinematic universe.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {SKIN_LIST.map(skin => {
              const isActive = skin.id === activeSkinId;
              const isHov = hovered === skin.id;
              return (
                <button key={skin.id}
                  onClick={() => pickSkin(skin.id)}
                  onMouseEnter={() => setHovered(skin.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    background: isActive ? 'rgba(255,72,29,0.05)' : isHov ? C.lightBg : C.white,
                    border: `1px solid ${isActive ? C.orange : C.border}`,
                    borderLeft: `4px solid ${isActive ? C.orange : 'transparent'}`,
                    padding: 'clamp(12px, 2vw, 16px) clamp(14px, 2vw, 20px)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                    textAlign: 'left', transition: 'all 0.15s ease', outline: 'none',
                  }}
                >
                  <div>
                    <div style={{
                      fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700,
                      fontSize: 'clamp(14px, 1.5vw, 16px)',
                      color: isActive ? C.orange : C.text, marginBottom: 2,
                    }}>
                      {skin.name}
                    </div>
                    <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: C.muted }}>{skin.tagline}</div>
                  </div>
                  {isActive && (
                    <span style={{
                      fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700,
                      fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
                      color: C.orange, flexShrink: 0,
                      background: 'rgba(255,72,29,0.08)', padding: '4px 10px',
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
            onClick={begin}
            style={{
              background: C.orange, border: 'none', color: C.white,
              fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700,
              fontSize: 14, letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: 'clamp(14px, 2vw, 18px) clamp(32px, 5vw, 48px)',
              cursor: 'pointer', transition: 'background 0.2s',
              display: 'inline-flex', alignItems: 'center', gap: 12,
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#e03d18'}
            onMouseLeave={e => e.currentTarget.style.background = C.orange}
          >
            Begin the Assessment →
          </button>
          <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: C.muted, marginTop: 12, margin: '12px 0 0' }}>
            No account required · Results available immediately
          </p>
        </div>

      </div>

      {/* Footer */}
      <div style={{
        borderTop: `1px solid ${C.border}`,
        padding: '24px clamp(20px, 5vw, 56px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        background: C.white,
      }}>
        <img src={LOGO_URL} alt="Mandarin" style={{ height: 24 }} />
        <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: C.muted }}>
          © Mandarin {new Date().getFullYear()}
        </span>
      </div>

    </div>
  );
}