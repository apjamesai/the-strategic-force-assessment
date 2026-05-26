import React from 'react';

export default function BackButton({ visible, onBack }) {
  if (!visible) return null;
  return (
    <button className="sfa-back-button visible" onClick={onBack} aria-label="Back">
      <svg viewBox="0 0 24 24" width="14" height="14">
        <path d="M14 6 L8 12 L14 18" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      </svg>
      <span>Back</span>
    </button>
  );
}