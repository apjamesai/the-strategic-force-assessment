import React from 'react';

export default function LocationTag({ label, visible }) {
  return (
    <div className={`sfa-location-tag${visible && label ? ' visible' : ''}`}>
      {label}
    </div>
  );
}