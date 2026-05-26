import React from 'react';

const btnStyle = {
  background: 'rgba(0,0,0,0.4)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.18)',
  color: 'var(--ink-label)',
  fontFamily: 'var(--sans)',
  fontSize: 10,
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  padding: '10px 16px',
  cursor: 'pointer',
  transition: 'color 0.4s ease, border-color 0.4s ease, background 0.4s ease',
  lineHeight: 1,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontWeight: 500,
};

// Skip is rendered by TimerRing already, do not duplicate it here.
export default function NavStrip({ visible, showBack, onBack, onForward }) {
  if (!visible) return null;

  const handleHover = (e) => {
    e.currentTarget.style.color = 'var(--amber)';
    e.currentTarget.style.borderColor = 'rgba(255,90,44,0.5)';
    e.currentTarget.style.background = 'rgba(255,90,44,0.08)';
  };
  const handleOut = (e) => {
    e.currentTarget.style.color = 'var(--ink-label)';
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
    e.currentTarget.style.background = 'rgba(0,0,0,0.4)';
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '5vh',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 56,
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      pointerEvents: 'auto',
    }}>
      {showBack && (
        <button style={btnStyle} onClick={onBack}
          onMouseEnter={handleHover} onMouseLeave={handleOut} aria-label="Back">
          <span>&larr;</span><span>BACK</span>
        </button>
      )}
      <button style={btnStyle} onClick={onForward}
        onMouseEnter={handleHover} onMouseLeave={handleOut} aria-label="Forward">
        <span>FORWARD</span><span>&rarr;</span>
      </button>
    </div>
  );
}
