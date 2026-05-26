import React from 'react';

export default function BLStack({ visible, current, total }) {
  return (
    <div className={`sfa-bl-stack${visible ? ' visible' : ''}`}>
      <div className="sfa-brand-mark">
        <span className="brand-dot"></span>
        <span className="brand-name">an assessment by <em>Mandarin</em></span>
      </div>
      <div className="sfa-bl-counter">
        <span className="label">SCENE</span>
        <span>{String(current + 1).padStart(2, '0')} · {total}</span>
      </div>
    </div>
  );
}