import React from 'react';

const btnStyle = {
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.08)',
  color: 'var(--ink-label)',
  fontFamily: 'var(--sans)',
  fontSize: 10,
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  padding: '8px 14px',
  cursor: 'pointer',
  transition: 'color 0.4s ease, border-color 0.4s ease',
  lineHeight: 1,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
};

export default function NavStrip({ visible, showBack, showSkip, onBack, onSkip, onForward }) {
  if (!visible) return null;

  const handleHover = (e) => { e.currentTarget.style.color = 'var(--amber)'; e.currentTarget.style.borderColor = 'rgba(255,90,44,0.4)'; };
  const handleOut = (e) => { e.currentTarget.style.color = 'var(--ink-label)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; };

  return (
    <div style={{
      position: 'fixed',
      bottom: '5vh',
      right: '5vw',
      zIndex: 56,
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      pointerEvents: 'auto',
    }}>
      {showBack && (
        <button style={btnStyle} onClick={onBack}
          onMouseEnter={handleHover} onMouseLeave={handleOut} aria-label="Back">
          ←
        </button>
      )}
      {showSkip && (
        <button style={btnStyle} onClick={onSkip}
          onMouseEnter={handleHover} onMouseLeave={handleOut} aria-label="Skip">
          Skip
        </button>
      )}
      <button style={btnStyle} onClick={onForward}
        onMouseEnter={handleHover} onMouseLeave={handleOut} aria-label="Forward">
        →
      </button>
    </div>
  );
}