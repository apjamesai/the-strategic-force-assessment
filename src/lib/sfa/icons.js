// ────────────────────────────────────────────
// PRACTICE ICONS — minimal line glyphs (SVG string snippets for innerHTML)
// ────────────────────────────────────────────
export const PRACTICE_ICONS = {
  understand_self:   '<circle cx="12" cy="12" r="9"/><path d="M3 14 q9 -4 18 0"/><circle cx="12" cy="12" r="3" fill="currentColor"/>',
  master_emotions:   '<path d="M2 12 q3 -6 5 0 q3 6 5 0 q3 -6 5 0 q3 6 5 0"/>',
  embed_practices:   '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="3" r="1.4" fill="currentColor"/><circle cx="21" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="21" r="1.4" fill="currentColor"/><circle cx="3" cy="12" r="1.4" fill="currentColor"/>',
  be_curious:        '<path d="M9 9 q0 -4 3 -4 t3 4 q0 2 -3 3.5 q0 1 0 2"/><circle cx="12" cy="18" r="0.8" fill="currentColor"/>',
  listen_deeply:     '<path d="M7 13 q-2 -1 -2 -4 q0 -4 4 -5 q6 -1 8 4 q1 4 -2 7 q-1 1 -2 3 q-1 2 -3 1 q-2 -1 -1 -3"/>',
  think_critically:  '<path d="M12 3 v18 M5 8 l7 -3 l7 3 M5 8 l3 5 a3 3 0 0 1 -6 0 z M19 8 l3 5 a3 3 0 0 1 -6 0 z"/>',
  unlock_creativity: '<path d="M12 3 v3 M5 7 l2 2 M3 14 h3 M19 7 l-2 2 M21 14 h-3 M9 16 q-1 -3 3 -7 q4 4 3 7 q-1 2 -3 2 t-3 -2 z M10 19 h4"/>',
  manage_uncertainty:'<path d="M4 8 q3 -3 6 -3 q4 0 6 3 q2 3 0 6 q-2 3 -6 3 q-3 0 -6 -3"/><circle cx="20" cy="14" r="1.4" fill="currentColor"/>',
  future_focused:    '<circle cx="12" cy="12" r="3"/><path d="M12 3 v3 M12 18 v3 M3 12 h3 M18 12 h3 M5 5 l2 2 M17 17 l2 2 M5 19 l2 -2 M17 7 l2 -2"/>',
  act_decisively:    '<path d="M4 12 h12 M11 7 l5 5 l-5 5"/><circle cx="20" cy="12" r="1.5"/>',
  collaborate_inclusively: '<circle cx="12" cy="6" r="2.2"/><circle cx="5" cy="16" r="2.2"/><circle cx="19" cy="16" r="2.2"/><path d="M9 16 h6 M11 8 l-4 6 M13 8 l4 6"/>',
  influence_effortlessly: '<circle cx="5" cy="12" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><circle cx="13" cy="12" r="2"/><path d="M7 12 h4 M15 12 l3 -5 M15 12 l3 5"/>'
};

export const RISK_ICONS = {
  control_bias:        '<rect x="4" y="10" width="16" height="10" rx="1"/><path d="M8 10 v-3 a4 4 0 0 1 8 0 v3"/>',
  moral_drift:         '<path d="M12 3 v18 M4 9 h16 M6 9 l-2 4 a3 3 0 0 0 6 0 z M18 9 l-2 4 a3 3 0 0 0 6 0 z"/>',
  detachment_pressure: '<circle cx="12" cy="12" r="9"/><path d="M8 10 q1.5 -1 3 0 M13 10 q1.5 -1 3 0 M9 16 q3 -1 6 0"/>'
};

export const STEP_ICONS = {
  notice:    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3" fill="currentColor"/>',
  pause:     '<rect x="6" y="5" width="3" height="14"/><rect x="15" y="5" width="3" height="14"/>',
  invite:    '<circle cx="9" cy="9" r="3"/><circle cx="17" cy="14" r="2"/><path d="M3 19 q3 -5 8 -5 M14 19 q1.5 -3 4 -3"/>',
  reframe:   '<rect x="4" y="6" width="16" height="12"/><path d="M4 10 h16 M9 6 v12"/>',
  horizon:   '<path d="M2 18 h20"/><circle cx="12" cy="12" r="4"/><path d="M2 14 h20"/>',
  decide:    '<path d="M5 12 l4 4 l10 -10"/>',
  experiment:'<path d="M9 3 v6 l-5 10 q-1 2 1 2 h14 q2 0 1 -2 l-5 -10 v-6 M8 3 h8"/>',
  multiply:  '<circle cx="12" cy="12" r="2"/><circle cx="5" cy="5" r="1.5"/><circle cx="19" cy="5" r="1.5"/><circle cx="5" cy="19" r="1.5"/><circle cx="19" cy="19" r="1.5"/><path d="M12 12 l-7 -7 M12 12 l7 -7 M12 12 l-7 7 M12 12 l7 7"/>',
  question:  '<path d="M9 9 q0 -4 3 -4 t3 4 q0 2 -3 3.5 v2 M12 19 v0.1"/>',
  doors:     '<rect x="4" y="4" width="6" height="16"/><rect x="14" y="4" width="6" height="16"/><circle cx="8" cy="12" r="0.8" fill="currentColor"/><circle cx="16" cy="12" r="0.8" fill="currentColor"/>',
  mirror:    '<ellipse cx="12" cy="10" rx="6" ry="7"/><path d="M9 20 h6 M10 17 h4"/>',
  journal:   '<rect x="5" y="3" width="14" height="18"/><path d="M9 7 h6 M9 11 h6 M9 15 h4"/>'
};

// Render a practice icon as SVG string (for dangerouslySetInnerHTML usage)
export function practiceIconSVG(key) {
  const paths = PRACTICE_ICONS[key] || '';
  return `<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1">${paths}</svg>`;
}

export function riskIconSVG(key) {
  const paths = RISK_ICONS[key] || '';
  return `<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1">${paths}</svg>`;
}

export function stepIconSVG(key) {
  const paths = STEP_ICONS[key] || '';
  return `<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1">${paths}</svg>`;
}