import React from 'react';

export default function TimerRing({ visible, running, duration, onSkip }) {
  return (
    <div
      className={`sfa-timer-ring${visible ? ' visible' : ''}${running ? ' running' : ''}`}
      onClick={onSkip}
      title="Skip"
    >
      <svg viewBox="0 0 56 56">
        <circle className="track" cx="28" cy="28" r="26" />
        <circle
          className="progress"
          cx="28"
          cy="28"
          r="26"
          style={{ animationDuration: `${duration}ms` }}
        />
      </svg>
      <span className="skip-label">SKIP</span>
    </div>
  );
}