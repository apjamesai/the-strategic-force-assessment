/**
 * Skin registry.
 * Each skin is a plain object with: id, name, tagline, description, theme,
 * characters, scenes, archetypes, secondaryPatterns, riskCopy, nextSteps,
 * imageMap, bodyClasses.
 *
 * force_trial wraps the existing engine constants so all four skins are
 * treated uniformly by Assessment.jsx.
 */

import { SCENES_FORCE_TRIAL } from '../scenes-force-trial';
import {
  ARCHETYPES,
  SECONDARY_PATTERNS,
  RISK_COPY,
  NEXT_STEPS
} from '../engine';

import APOLLO_11_DATA from './apollo-11';
import YI_DATA from './yi';
import LATIMER_DATA from './latimer';

// ─── localStorage helpers ─────────────────────────────────────────────────────
const LS_KEY = 'mandarin.assessment.currentSkin';

export function getActiveSkinId() {
  try { return localStorage.getItem(LS_KEY) || 'force_trial'; } catch { return 'force_trial'; }
}

export function setActiveSkinId(id) {
  try { localStorage.setItem(LS_KEY, id); } catch {}
}

// ─── Force Trial skin wrapper ─────────────────────────────────────────────────
const SKIN_FORCE_TRIAL = {
  id: 'force_trial',
  name: 'The Strategic Force Trial',
  tagline: 'The original. A galaxy far, far away.',
  description: 'Set in a cinematic space-opera universe — with Commander Hale Marrick as the pressure system you have to navigate.',
  theme: {
    '--amber': '#ff5a2c',
    '--amber-bright': '#ff8a4a',
    '--amber-deep': '#c93a16',
    '--amber-glow': 'rgba(255, 90, 44, 0.35)',
    '--brand-orange': '#ff481d',
    '--brand-tangerine': '#ff6b00',
    '--brand-yellow': '#feab2b',
    '--bg': '#0c0a0a',
    '--bg-deep': '#060505',
    '--panel': '#1e1e23',
    '--ink': '#ece5d7',
    '--ink-soft': '#d6cdb9',
    '--ink-mute': '#c8c0a8',
    '--ink-label': '#f0eadd',
    '--ink-dim': '#6b6354',
    '--serif': '"Cormorant Garamond", "EB Garamond", Georgia, serif',
    '--sans': '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  characters: { commander: 'Commander Hale Marrick', mentor: 'The Hermit' },
  scenes: SCENES_FORCE_TRIAL,
  archetypes: ARCHETYPES,
  secondaryPatterns: SECONDARY_PATTERNS,
  riskCopy: RISK_COPY,
  nextSteps: NEXT_STEPS,
  imageMap: {},
  bodyClasses: [],
};

// ─── Registry ─────────────────────────────────────────────────────────────────
export const SKINS = {
  force_trial: SKIN_FORCE_TRIAL,
  apollo_11:   APOLLO_11_DATA,
  yi_sunsin:   YI_DATA,
  latimer:     LATIMER_DATA,
};

export const SKIN_LIST = [
  { id: 'force_trial', name: 'The Strategic Force Trial',       tagline: 'The original. A galaxy far, far away.' },
  { id: 'apollo_11',   name: 'Trajectory · Apollo 11',          tagline: '1969. Mission Control. Three days to the Moon.' },
  { id: 'yi_sunsin',   name: 'Twelve Ships · Admiral Yi',       tagline: '1597 · Joseon · the campaign before Myeongnyang.' },
  { id: 'latimer',     name: 'Filament · The Latimer Notebook', tagline: '1881 · New York · the carbon-filament patent race.' },
];