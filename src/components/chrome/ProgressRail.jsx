import React from 'react';

export default function ProgressRail({ visible, percent }) {
  return (
    <div className={`sfa-progress-rail${visible ? ' visible' : ''}`}>
      <div className="fill" style={{ width: `${percent}%` }} />
    </div>
  );
}