import React from 'react';

/**
 * Mandarin logo. Renders the geometric brand mark (orange triangle/lozenge)
 * + the "mandarin" wordmark as inline SVG. The wordmark is drawn as a
 * <text> element so it does not depend on having every glyph vectorised.
 */
export default function LogoTopRight({ visible }) {
  return (
    <a
      className={`sfa-logo-tr${visible ? ' visible' : ''}`}
      href="#"
      onClick={e => e.preventDefault()}
      aria-label="Mandarin"
    >
      <svg viewBox="0 0 360 60" xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', height: '100%', width: 'auto' }}>
        <defs>
          <linearGradient id="mandarin-grad" x1="0" y1="60" x2="60" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ff6a1f"/>
            <stop offset="1" stopColor="#ff481d"/>
          </linearGradient>
        </defs>
        {/* Geometric mark, condensed to a 60x60 box */}
        <g transform="translate(2,4) scale(0.235)">
          <polygon fill="url(#mandarin-grad)" points="139.43 0 92.31 35.2 85.37 100.69 67.33 84.92 34.93 109.09 27.89 154.91 27.88 154.9 16.66 141.62 0 154.03 19.87 210 61.46 193.17 67.63 155.12 96.45 202.36 131.35 188.28 133.23 119.37 170.1 195.5 232.37 170.25 139.43 0"/>
        </g>
        {/* Wordmark, rendered as text */}
        <text x="78" y="42"
          fill="#ff481d"
          fontFamily="var(--sans), Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          fontSize="42"
          fontWeight="700"
          letterSpacing="-1">
          mandarin
        </text>
      </svg>
    </a>
  );
}
