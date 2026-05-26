// ============================================================
// SFA SCORING ENGINE — verbatim port from reference
// ============================================================

export const FRAMEWORK = {
  levels: {
    L1: { num: 'Level 01', name: 'Deepen Self-Awareness', short: 'Self-Awareness' },
    L2: { num: 'Level 02', name: 'Cultivate Open-Mindedness', short: 'Open-Mindedness' },
    L3: { num: 'Level 03', name: 'Develop Strategic Capabilities', short: 'Strategic Capabilities' },
    L4: { num: 'Level 04', name: 'Scale Your Impact', short: 'Impact' }
  },
  practices: {
    understand_self:   { level: 'L1', name: 'Understand Self',       displayLong: 'Understand Self',        high: 'You notice your own patterns under pressure and can reflect on the impact you create.', low: 'You may be operating from patterns you have not fully seen yet — the parts of you below the waterline.' },
    master_emotions:   { level: 'L1', name: 'Master Emotions',       displayLong: 'Master Emotions',        high: 'You can stay composed without becoming detached, and you recognise your emotional triggers as they rise.', low: 'Pressure may narrow your thinking or intensify your reactions before you have a chance to choose.' },
    embed_practices:   { level: 'L1', name: 'Embed Practices',       displayLong: 'Embed Practices',        high: 'You have built reflective rituals into your life so awareness becomes a habit, not an event.', low: 'Self-awareness may feel like something you do occasionally rather than something you live inside.' },
    be_curious:        { level: 'L2', name: 'Be Curious',            displayLong: 'Be Curious — Be a Learner',          high: 'You seek fresh perspectives, ask questions before answers, and stay open to learning.', low: 'You may move from uncertainty to conclusion too quickly, closing the door on the unfamiliar.' },
    listen_deeply:     { level: 'L2', name: 'Listen Deeply',         displayLong: 'Listen Deeply — Be a Listener',      high: 'You listen for meaning, emotion, pattern, and what is unsaid as much as what is said.', low: 'You may prioritise response, control, or speed over genuine understanding.' },
    think_critically:  { level: 'L2', name: 'Think Critically',      displayLong: 'Think Critically — Be a Critical Thinker', high: 'You frame the issue, test assumptions, and evaluate complexity rather than accepting the first plausible story.', low: 'You may accept the first plausible explanation too quickly or default to a single perspective.' },
    unlock_creativity: { level: 'L3', name: 'Unlock Creativity',     displayLong: 'Unlock Creativity — Be a Creative',  high: 'You generate options, reframe constraints, and let imagination shape your strategy.', low: 'You may refine existing approaches rather than imagining different futures.' },
    manage_uncertainty:{ level: 'L3', name: 'Manage Uncertainty',    displayLong: 'Manage Uncertainty',                 high: 'You can act without full information while staying adaptable and grounded.', low: 'Ambiguity may trigger delay, over-control, or false certainty.' },
    future_focused:    { level: 'L3', name: 'Be Future-Focused',     displayLong: 'Be Future-Focused — Be a Visionary', high: 'You hold the long view, consider consequence, and act with direction.', low: 'Immediate pressure may dominate your strategic attention.' },
    act_decisively:    { level: 'L4', name: 'Act Decisively',        displayLong: 'Act Decisively — Be a Doer',         high: 'You make clear, timely, accountable trade-offs and own them.', low: 'You may delay, diffuse, or avoid the trade-offs only you can make.' },
    collaborate_inclusively: { level: 'L4', name: 'Collaborate Inclusively', displayLong: 'Collaborate Inclusively — Be a Collaborator', high: 'You invite challenge, create safety, and use difference productively.', low: 'You may underuse the intelligence around you, or treat collaboration as compliance.' },
    influence_effortlessly:  { level: 'L4', name: 'Influence Effortlessly',  displayLong: 'Influence Effortlessly — Be an Influencer',  high: 'You align others through trust, clarity, and shared meaning.', low: 'Your ideas may not yet travel with enough force or credibility.' }
  },
  risks: {
    control_bias:        { name: 'Control Bias',              question: 'Where might you be calling something alignment when it is actually compliance?' },
    moral_drift:         { name: 'Moral Drift',               question: 'At what point does a necessary compromise become a betrayal of the strategy itself?' },
    detachment_pressure: { name: 'Detachment Under Pressure', question: 'How do you stay steady without becoming unreachable?' }
  }
};

export const RULE_DEFAULTS = {
  fm_overall_min: 88,
  fm_level_min: 82,
  fm_max_risk: 35,
  band_drift_max: 74,
  so_demote_risk_threshold: 55,
  band_tactical_max: 52,
  band_infancy_max: 34,
  band_operator_max: 87,
  practice_underdeveloped_max: 29,
  practice_emerging_max: 49,
  practice_capable_max: 69,
  practice_strong_max: 84,
  risk_low_max: 30,
  risk_mod_max: 60,
  secondary_control_bias_min: 65,
  secondary_moral_drift_min: 60,
  secondary_detachment_min: 60,
  secondary_collab_high: 80,
  secondary_act_low: 55,
  secondary_act_high: 80,
  secondary_listen_low: 55,
  secondary_future_high: 80,
  secondary_emotions_low: 55
};

export function avg(arr) {
  if (!arr.length) return 50;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function applyScore(scores, scoreObj) {
  if (!scoreObj) return scores;
  const next = { ...scores };
  Object.entries(scoreObj).forEach(([k, v]) => {
    if (next.practices[k] !== undefined) {
      next.practices = { ...next.practices, [k]: [...next.practices[k], v] };
    }
    if (next.risks[k] !== undefined) {
      next.risks = { ...next.risks, [k]: [...next.risks[k], v] };
    }
  });
  return next;
}

export function rebuildScores(scenes, answers) {
  let scores = {
    practices: {
      understand_self: [], master_emotions: [], embed_practices: [],
      be_curious: [], listen_deeply: [], think_critically: [],
      unlock_creativity: [], manage_uncertainty: [], future_focused: [],
      act_decisively: [], collaborate_inclusively: [], influence_effortlessly: []
    },
    risks: { control_bias: [], moral_drift: [], detachment_pressure: [] }
  };
  Object.entries(answers).forEach(([idxStr, value]) => {
    const idx = +idxStr;
    const scene = scenes[idx];
    if (!scene || scene.type !== 'question') return;
    if (scene.kind === 'rating' && typeof value === 'number') {
      scores = applyScore(scores, scene.scoring[value]);
    } else if (scene.kind === 'mc' && typeof value === 'number') {
      scores = applyScore(scores, scene.options[value].score);
    } else if (scene.kind === 'ranking' && Array.isArray(value)) {
      value.forEach((itemIdx, pos) => {
        const item = scene.items[itemIdx];
        const w = scene.weights[pos] || 0;
        const weighted = {};
        Object.entries(item.score).forEach(([k, v]) => weighted[k] = v * w);
        scores = applyScore(scores, weighted);
      });
    }
  });
  return scores;
}

export function computeResults(scores) {
  const p = {};
  Object.keys(scores.practices).forEach(k => {
    p[k] = clamp(Math.round(avg(scores.practices[k])), 0, 100);
  });
  const levels = {
    L1: Math.round((p.understand_self + p.master_emotions + p.embed_practices) / 3),
    L2: Math.round((p.be_curious + p.listen_deeply + p.think_critically) / 3),
    L3: Math.round((p.unlock_creativity + p.manage_uncertainty + p.future_focused) / 3),
    L4: Math.round((p.act_decisively + p.collaborate_inclusively + p.influence_effortlessly) / 3)
  };
  const overall = Math.round(Object.values(p).reduce((a, b) => a + b, 0) / 12);
  const r = {};
  Object.keys(scores.risks).forEach(k => {
    r[k] = clamp(Math.round(avg(scores.risks[k].length ? scores.risks[k] : [0])), 0, 100);
  });
  return { practices: p, levels, overall, risks: r };
}

export function getRunningFlags(scores) {
  const r = scores.risks;
  const p = scores.practices;
  const a = arr => arr.length ? arr.reduce((x, y) => x + y, 0) / arr.length : 0;
  const flags = {
    control: a(r.control_bias),
    drift: a(r.moral_drift),
    detach: a(r.detachment_pressure),
    listen: a(p.listen_deeply),
    aware: a(p.understand_self),
    challenge: a(p.act_decisively),
    creative: a(p.unlock_creativity)
  };
  flags.leaning_hale   = flags.control >= 35 || flags.drift >= 25;
  flags.resisting_hale = flags.challenge >= 55 && flags.control < 25;
  flags.staying_curious= flags.listen >= 60 && flags.aware >= 60;
  flags.drifting       = flags.drift >= 30 || flags.detach >= 35;
  return flags;
}

export function pickArchetype(R, rules = RULE_DEFAULTS) {
  const { overall, levels, risks } = R;
  const maxRisk = Math.max(risks.control_bias, risks.moral_drift, risks.detachment_pressure);
  if (overall >= rules.fm_overall_min &&
      levels.L1 >= rules.fm_level_min && levels.L2 >= rules.fm_level_min &&
      levels.L3 >= rules.fm_level_min && levels.L4 >= rules.fm_level_min &&
      maxRisk <= rules.fm_max_risk) {
    return 'force_multiplier';
  }
  if (overall > rules.band_drift_max) {
    if (maxRisk > rules.so_demote_risk_threshold) return 'hidden_drifter';
    return 'strategic_operator';
  }
  if (overall > rules.band_tactical_max) return 'hidden_drifter';
  if (overall > rules.band_infancy_max) return 'tactical_survivor';
  return 'reactive_defender';
}

export function bandFor(score, rules = RULE_DEFAULTS) {
  if (score <= rules.practice_underdeveloped_max) return 'Underdeveloped';
  if (score <= rules.practice_emerging_max) return 'Emerging';
  if (score <= rules.practice_capable_max) return 'Capable but inconsistent';
  if (score <= rules.practice_strong_max) return 'Strong';
  return 'Highly developed';
}

export function overallBand(score, rules = RULE_DEFAULTS) {
  if (score <= rules.band_infancy_max) return 'Strategic Infancy';
  if (score <= rules.band_tactical_max) return 'Tactical Survivor';
  if (score <= rules.band_drift_max) return 'Hidden Drift';
  if (score <= rules.band_operator_max) return 'Strategic Operator';
  return 'Strategic Force Multiplier';
}

export function riskBand(score, rules = RULE_DEFAULTS) {
  if (score <= rules.risk_low_max) return { name: 'Low', color: 'var(--ink-soft)' };
  if (score <= rules.risk_mod_max) return { name: 'Moderate', color: 'var(--amber-bright)' };
  return { name: 'High', color: 'var(--amber)' };
}

export const PRONOUN_SETS = {
  she:  { they: 'she',  them: 'her',  their: 'her',   theirs: 'hers',  themself: 'herself',  is: 'is',  are: 'is' },
  he:   { they: 'he',   them: 'him',  their: 'his',   theirs: 'his',   themself: 'himself',  is: 'is',  are: 'is' },
  they: { they: 'they', them: 'them', their: 'their', theirs: 'theirs',themself: 'themself', is: 'are', are: 'are' }
};

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

export function personalize(text, user) {
  if (typeof text !== 'string') return text;
  const p = PRONOUN_SETS[user.gender] || PRONOUN_SETS.they;
  const firstName = user.firstName || 'Citizen';
  const lastName = user.lastName || '';
  return text
    .replace(/\{\{firstName\}\}/g, firstName)
    .replace(/\{\{lastName\}\}/g, lastName)
    .replace(/\{\{they\}\}/g, p.they)
    .replace(/\{\{them\}\}/g, p.them)
    .replace(/\{\{their\}\}/g, p.their)
    .replace(/\{\{theirs\}\}/g, p.theirs)
    .replace(/\{\{themself\}\}/g, p.themself)
    .replace(/\{\{They\}\}/g, cap(p.they))
    .replace(/\{\{Them\}\}/g, cap(p.them))
    .replace(/\{\{Their\}\}/g, cap(p.their))
    .replace(/\{\{Theirs\}\}/g, cap(p.theirs))
    .replace(/\{\{Themself\}\}/g, cap(p.themself))
    .replace(/\{\{is\}\}/g, p.is)
    .replace(/\{\{are\}\}/g, p.are);
}

export function personalizeScene(scene, user) {
  if (!scene || typeof scene !== 'object') return scene;
  const clone = Array.isArray(scene) ? [] : {};
  Object.entries(scene).forEach(([k, v]) => {
    if (typeof v === 'string') clone[k] = personalize(v, user);
    else if (Array.isArray(v)) clone[k] = v.map(x =>
      typeof x === 'string' ? personalize(x, user) :
      (typeof x === 'object' && x !== null ? personalizeScene(x, user) : x)
    );
    else if (typeof v === 'object' && v !== null) clone[k] = personalizeScene(v, user);
    else clone[k] = v;
  });
  return clone;
}

export function applyConditional(scene, flags) {
  if (!scene.variants) return scene;
  const clone = JSON.parse(JSON.stringify(scene));
  Object.entries(scene.variants).forEach(([flagKey, override]) => {
    if (flags[flagKey]) Object.assign(clone, override);
  });
  return clone;
}

export const ARCHETYPES = {
  reactive_defender: {
    name: 'The Reactive Defender',
    band: 'Strategic Infancy',
    headline: 'You care about protecting what matters — but pressure may be driving more of your strategy than you realise.',
    body: 'Your result suggests that when stakes rise, your attention narrows fast. You may move into reaction, urgency, or defence before you have understood what is happening. You are committed and action-oriented — but the same energy that makes you formidable in a crisis can make you blind to the pattern beneath it. You may respond to symptoms rather than causes, miss weak signals, or confuse movement with progress.',
    risk: 'Your risk is not lack of effort. It is pressure-led action. You may be protecting the mission while reinforcing the very patterns that weaken it.',
    focus: 'Start at Level 1 — <em>Deepen Self-Awareness</em>. Notice your pressure patterns. Name your triggers. Build a pause before reacting. Separate fact from interpretation. Ask, "What am I not seeing yet?"',
    next: 'Your first breakthrough is likely to come from seeing your own operating system more clearly — before you change anything else.'
  },
  tactical_survivor: {
    name: 'The Tactical Survivor',
    band: 'Tactical Survivor',
    headline: 'You can handle pressure — but your strategy may be too anchored in the immediate moment.',
    body: 'You are capable, practical, and effective in difficult situations. You make decisions, keep momentum, and solve immediate problems. Your result suggests, though, that short-term demands may be crowding out longer-term strategic thinking. You may prioritise control over understanding, optimise for delivery rather than direction, and carry too much yourself.',
    risk: 'Your risk is tactical over-functioning. You may become so good at surviving the current crisis that you unintentionally normalise crisis as the operating model.',
    focus: 'Strengthen Level 3 — <em>Develop Strategic Capabilities</em>. Focus on future-orientation, creative options, and acting well in uncertainty. Move from "What needs fixing now?" to "What future are we creating through this decision?"',
    next: 'Your growth edge is widening the time horizon you actually think in — from this week, to this decade.'
  },
  hidden_drifter: {
    name: 'The Hidden Drifter',
    band: 'Hidden Drift',
    headline: 'You are more strategic than most — but your blindspots may emerge precisely when you feel most certain.',
    body: 'You are thoughtful, capable, and likely well-intentioned. You can see complexity, make decisions, and influence others. But your result suggests a subtle risk: under pressure, your strengths can distort. Clarity becomes certainty. Decisiveness becomes control. Conviction becomes justification. Calm becomes detachment. This is the most psychologically important result because it mirrors how strategic drift happens in real life — not through incompetence, but through intelligent people making apparently reasonable choices under pressure.',
    risk: 'Your risk is <em>justified drift</em>. You may continue making decisions that each seem defensible while the wider pattern moves quietly away from your stated values.',
    focus: 'Work across Levels 1 and 2 together — <em>Deepen Self-Awareness</em> and <em>Cultivate Open-Mindedness</em>. Notice yourself under pressure. Listen most carefully when you disagree. Test the assumptions you would rather keep. Invite challenge. Watch the moment when "necessary" becomes a dangerous word.',
    next: 'Your fastest development will come from learning to notice earlier — before the pattern becomes the path.'
  },
  strategic_operator: {
    name: 'The Strategic Operator',
    band: 'Strategic Operator',
    headline: 'You show strong strategic capability and a relatively balanced pattern under pressure.',
    body: 'Your result suggests you can remain clear, reflective, and effective in complex situations. You likely balance action with thought, confidence with humility, and direction with collaboration. Composure, thoughtful decisions, openness, alignment, and awareness of consequence are all visible in your pattern.',
    risk: 'Your risk is not capability — it is consistency. Under enough pressure, even strong strategic operators drift into old patterns. The opportunity is to make your strategic capability more reliable, more repeatable, and more visible to others.',
    focus: 'Strengthen Level 4 — <em>Scale Your Impact</em>. Decision quality, stakeholder alignment, influence without over-control, collaboration under tension. Turning strategic insight into action that travels.',
    next: 'Your growth edge is becoming more conscious — and more deliberate — about the impact you already have.'
  },
  force_multiplier: {
    name: 'The Force Multiplier',
    band: 'Strategic Force Multiplier',
    headline: 'You do not just think strategically. You increase the strategic capacity of the people and system around you.',
    body: 'Your result suggests a highly integrated strategic profile. You can stay aware of yourself under pressure, regulate emotion without disconnecting from consequence, listen deeply, think critically, generate options in uncertainty, decide with courage and humility, and influence without domination. You hold complexity without collapsing into confusion or control.',
    risk: 'Your risk is <em>over-reliance</em>. Others may look to you for clarity, judgement, and steadiness. Over time, that can quietly create dependency — unless you intentionally build capability in the system around you.',
    focus: 'Your next level is multiplication. Develop strategic capability in others. Design decision systems. Build collective intelligence. Create the conditions for others to hold uncertainty without panic.',
    next: 'Your development edge is to become less necessary — by making the system more strategically capable.'
  }
};

export const SECONDARY_PATTERNS = {
  architect_of_order: {
    name: 'The Architect of Order',
    headline: 'Drawn to clarity, control, and decisive action.',
    body: 'You are highly effective in moments of chaos. But unchecked, your strength becomes rigidity. You may begin to mistake disagreement for weakness, ambiguity for failure, and speed for strategy.',
    trigger: (R, rules = RULE_DEFAULTS) => R.risks.control_bias >= rules.secondary_control_bias_min
  },
  the_justifier: {
    name: 'The Justifier',
    headline: 'At risk of rationalising questionable decisions when the goal feels important enough.',
    body: 'This does not mean you lack values. It means your values can become vulnerable when urgency, loyalty, or ideology enters the room.',
    trigger: (R, rules = RULE_DEFAULTS) => R.risks.moral_drift >= rules.secondary_moral_drift_min
  },
  the_calm_blade: {
    name: 'The Calm Blade',
    headline: 'Composed in moments that unsettle others.',
    body: 'That composure is valuable. But there is a fine line between regulation and emotional distance. Your edge is to remain calm without becoming disconnected from human consequence.',
    trigger: (R, rules = RULE_DEFAULTS) => R.risks.detachment_pressure >= rules.secondary_detachment_min
  },
  the_consensus_seeker: {
    name: 'The Consensus Seeker',
    headline: 'You create inclusion and invite voice — but may delay difficult trade-offs.',
    body: 'Your development edge is to preserve collaboration while becoming more decisive.',
    trigger: (R, rules = RULE_DEFAULTS) => R.practices.collaborate_inclusively >= rules.secondary_collab_high && R.practices.act_decisively < rules.secondary_act_low
  },
  the_decisive_commander: {
    name: 'The Decisive Commander',
    headline: 'You move quickly and bring momentum — but your speed may narrow the field of intelligence.',
    body: 'Your edge is to slow down just enough to hear what the system is trying to tell you.',
    trigger: (R, rules = RULE_DEFAULTS) => R.practices.act_decisively >= rules.secondary_act_high && R.practices.listen_deeply < rules.secondary_listen_low
  },
  vision_under_strain: {
    name: 'The Vision Under Strain',
    headline: 'You see beyond the immediate moment, but pressure may disrupt your steadiness.',
    body: 'Your edge is to build inner stability so your vision survives contact with reality.',
    trigger: (R, rules = RULE_DEFAULTS) => R.practices.future_focused >= rules.secondary_future_high && R.practices.master_emotions < rules.secondary_emotions_low
  }
};

export function pickSecondaryPattern(R, rules = RULE_DEFAULTS) {
  const keys = ['architect_of_order', 'the_justifier', 'the_calm_blade', 'the_consensus_seeker', 'the_decisive_commander', 'vision_under_strain'];
  for (const key of keys) {
    const p = SECONDARY_PATTERNS[key];
    if (p && typeof p.trigger === 'function') {
      try { if (p.trigger(R, rules)) return key; } catch (e) {}
    }
  }
  const distances = {
    architect_of_order:     rules.secondary_control_bias_min - R.risks.control_bias,
    the_justifier:          rules.secondary_moral_drift_min - R.risks.moral_drift,
    the_calm_blade:         rules.secondary_detachment_min - R.risks.detachment_pressure,
    the_consensus_seeker:   Math.max(rules.secondary_collab_high - R.practices.collaborate_inclusively, R.practices.act_decisively - rules.secondary_act_low + 0.01),
    the_decisive_commander: Math.max(rules.secondary_act_high - R.practices.act_decisively, R.practices.listen_deeply - rules.secondary_listen_low + 0.01),
    vision_under_strain:    Math.max(rules.secondary_future_high - R.practices.future_focused, R.practices.master_emotions - rules.secondary_emotions_low + 0.01)
  };
  let best = keys[0], bestD = Infinity;
  for (const k of keys) {
    if (typeof distances[k] === 'number' && distances[k] < bestD) { best = k; bestD = distances[k]; }
  }
  return best;
}

export const RISK_COPY = {
  control_bias: {
    name: 'Control Bias',
    low:  'You appear able to pursue clarity without defaulting to control.',
    mod:  'You may sometimes overvalue speed, certainty, or authority when pressure rises.',
    high: 'You may be at risk of mistaking <em>control for strategy</em>. This can make you decisive — but it may also reduce listening, creativity, and trust.',
    q:    'Where might you be calling something <em>alignment</em> when it is actually compliance?'
  },
  moral_drift: {
    name: 'Moral Drift',
    low:  'Your responses suggest a relatively strong ability to keep means and ends connected.',
    mod:  'You may occasionally justify difficult actions when the goal feels important enough.',
    high: 'You may be vulnerable to rationalising harmful choices if they appear necessary for a larger mission.',
    q:    'At what point does a necessary compromise become a betrayal of the strategy itself?'
  },
  detachment_pressure: {
    name: 'Detachment Under Pressure',
    low:  'You appear able to stay connected to human consequence while under pressure.',
    mod:  'Your composure is a strength, but it may sometimes become distance.',
    high: 'You may remain calm in ways others experience as emotionally unavailable, overly rational, or disconnected from impact.',
    q:    'How do you stay steady without becoming unreachable?'
  }
};

export const NEXT_STEPS = {
  reactive_defender: [
    { icon: 'pause',   title: 'The five-second pause',     body: 'Before responding to anything stressful, give yourself five full seconds. Notice what your body wants to do, then choose what to do.',                                test: 'Try for 7 days. Track each time you used it.' },
    { icon: 'journal', title: 'A nightly two-line log',     body: 'Each evening write: "Today I noticed…" and "Tomorrow I will…". Build the muscle of self-observation.',                                                              test: 'Do this for 21 days, then re-read the lot.' },
    { icon: 'mirror',  title: 'Ask one person',             body: 'Ask one trusted person: "When pressure rises, what do you see me become?" Listen without defending.',                                                                test: 'One question, one person, this week.' },
    { icon: 'question',title: 'Replace "should" with "if"', body: 'Notice your "shoulds" — they are usually pressure speaking. Reframe to "if I did this, what would happen?" Re-open the choice.',                                       test: 'Count your "shoulds" for one day. Reframe three.' }
  ],
  tactical_survivor: [
    { icon: 'horizon',    title: 'The 10-year question',           body: 'On any non-trivial decision, ask: "What does this look like in a decade?" Forces you out of fire-fighting and into direction.',                                         test: 'Apply to your next three meaningful decisions.' },
    { icon: 'experiment', title: 'Run one strategic experiment',   body: 'Pick one current problem. Generate four genuinely different solutions before settling on one. Build option-fluency.',                                                  test: 'One problem, four options, this week.' },
    { icon: 'doors',      title: 'Future-back planning',           body: 'Describe in detail what good looks like 18 months from now. Then walk backwards: what decision today would matter then?',                                                test: '90 minutes, a single page, by Friday.' },
    { icon: 'reframe',    title: 'Trade urgency for importance',   body: 'For one week, mark every task as either urgent OR important. Notice the ratio. Notice what does not survive scrutiny.',                                                  test: 'Audit for 5 days. Drop three urgent-not-important items.' }
  ],
  hidden_drifter: [
    { icon: 'notice',  title: 'The drift word audit',            body: 'Notice when you use words like "necessary", "no choice", "this once". Each is a possible drift signal. Pause, name, examine.',                                          test: 'Track for two weeks. Bring the list to your coach.' },
    { icon: 'invite',  title: 'Invite your strongest dissenter', body: 'Identify the person most likely to disagree with you. Invite them into a real decision. Treat their resistance as data.',                                              test: 'One conversation, this month. Document what shifted.' },
    { icon: 'mirror',  title: 'The 360 sentence',                body: 'Ask three people: "What is one thing about my pattern under pressure that I probably do not see?" Listen without explaining.',                                          test: 'Three people, one question, no defending.' },
    { icon: 'pause',   title: 'Slow down on the certain ones',   body: 'When a decision feels obvious, you are most at risk. Apply a 24-hour rule to anything you are certain about.',                                                          test: 'Use the rule three times this month.' }
  ],
  strategic_operator: [
    { icon: 'multiply',   title: 'Develop one other person',        body: 'Choose one person in your orbit. Help them build a strategic muscle they currently lack. Multiplication begins with one.',                                            test: 'Name the person. Name the muscle. Begin.' },
    { icon: 'decide',     title: 'Make decisions more visible',     body: 'When you make a meaningful call, share publicly what you considered and what you weighed. Make the strategy legible.',                                                test: 'Try this on three decisions this month.' },
    { icon: 'reframe',    title: 'Sharpen the consequential 20%',   body: 'Identify the 20% of your decisions that drive 80% of outcomes. Concentrate your thinking time there. Delegate or systematise the rest.',                              test: 'Map your decisions for a week. Re-balance time.' },
    { icon: 'experiment', title: 'Pick one risk to deliberately reduce', body: 'Look at your three risk overlays. Choose the one closest to becoming a real constraint. Design a small practice to soften it.',                                test: 'One overlay, one practice, 30 days.' }
  ],
  force_multiplier: [
    { icon: 'multiply',   title: 'Design a decision system',         body: 'Create a clear template for how strategic decisions get made in your team — owner, evidence, options, trade-offs, review. Replicable, not heroic.',                  test: 'Build the v1 template. Apply to your next big call.' },
    { icon: 'invite',     title: 'Build the bench',                  body: 'Identify three people who could become the next layer of strategic capability. Invest in them deliberately, with regular feedback and stretch decisions.',            test: 'Three names. One conversation each, this month.' },
    { icon: 'mirror',     title: 'Make yourself less necessary',     body: 'In every meeting this month, ask: "Could someone else here have led this?" Then arrange for that to be true next time.',                                              test: 'One month of audit. Hand off two recurring meetings.' },
    { icon: 'horizon',    title: 'Author the long brief',            body: 'Write a short paper on the strategic capability you want your wider system to have in three years. Use it as a north star — share, debate, refine.',                  test: 'One page. Share with three trusted readers.' }
  ]
};

export const MOCK_PROFILES = {
  reactive_defender: {
    overall: 32, levels: { L1: 26, L2: 30, L3: 32, L4: 38 },
    practices: { understand_self: 28, master_emotions: 24, embed_practices: 26, be_curious: 32, listen_deeply: 30, think_critically: 28, unlock_creativity: 30, manage_uncertainty: 32, future_focused: 34, act_decisively: 45, collaborate_inclusively: 35, influence_effortlessly: 34 },
    risks: { control_bias: 58, moral_drift: 45, detachment_pressure: 35 }
  },
  tactical_survivor: {
    overall: 52, levels: { L1: 48, L2: 52, L3: 48, L4: 60 },
    practices: { understand_self: 50, master_emotions: 48, embed_practices: 46, be_curious: 55, listen_deeply: 50, think_critically: 52, unlock_creativity: 45, manage_uncertainty: 52, future_focused: 46, act_decisively: 68, collaborate_inclusively: 56, influence_effortlessly: 56 },
    risks: { control_bias: 48, moral_drift: 30, detachment_pressure: 40 }
  },
  hidden_drifter: {
    overall: 68, levels: { L1: 65, L2: 64, L3: 72, L4: 71 },
    practices: { understand_self: 60, master_emotions: 68, embed_practices: 66, be_curious: 70, listen_deeply: 58, think_critically: 65, unlock_creativity: 72, manage_uncertainty: 73, future_focused: 70, act_decisively: 75, collaborate_inclusively: 70, influence_effortlessly: 68 },
    risks: { control_bias: 62, moral_drift: 48, detachment_pressure: 55 }
  },
  strategic_operator: {
    overall: 82, levels: { L1: 80, L2: 82, L3: 84, L4: 80 },
    practices: { understand_self: 80, master_emotions: 78, embed_practices: 82, be_curious: 82, listen_deeply: 80, think_critically: 84, unlock_creativity: 84, manage_uncertainty: 85, future_focused: 82, act_decisively: 80, collaborate_inclusively: 80, influence_effortlessly: 80 },
    risks: { control_bias: 38, moral_drift: 22, detachment_pressure: 30 }
  },
  force_multiplier: {
    overall: 93, levels: { L1: 92, L2: 94, L3: 93, L4: 93 },
    practices: { understand_self: 94, master_emotions: 90, embed_practices: 92, be_curious: 95, listen_deeply: 94, think_critically: 93, unlock_creativity: 94, manage_uncertainty: 90, future_focused: 95, act_decisively: 92, collaborate_inclusively: 95, influence_effortlessly: 92 },
    risks: { control_bias: 32, moral_drift: 18, detachment_pressure: 28 }
  }
};