// Force Trial default skin scenes ,  verbatim from reference
export const SCENES_FORCE_TRIAL = [
  {
    type: 'landing',
    location: 'Outer Rim · Transmission',
    locationLabel: 'OUTER RIM · TRANSMISSION INBOUND',
    title: ['The', 'Strategic', '<em>Force</em>', 'Assessment'],
    sub: 'An assessment of how you think, decide, and lead when pressure enters the room',
    note: 'Set deliberately outside any business context ,  to bypass familiar assumptions and reveal the pattern beneath',
    cta: 'Begin the assessment',
    duration: 12000
  },
  {
    type: 'intake',
    locationLabel: 'CITIZEN REGISTRATION · CONFIDENTIAL',
    eyebrow: 'Before we begin',
    title: 'Tell the Council who you are.',
    sub: 'Used to address you correctly through the story and to render your character.'
  },
  {
    type: 'crawl',
    locationLabel: 'PROLOGUE · TRANSMISSION INBOUND',
    preamble: 'A long time ago in a galaxy far, far away....',
    title: ['THE', 'STRATEGIC', 'FORCE', 'ASSESSMENT'],
    episode: 'Prologue',
    paragraphs: [
      "It is a time of fracture. The long peace has stretched the Coalition to its limit, and unrest stirs at the edges of every system. Old certainties ,  order, loyalty, the very meaning of strategy ,  no longer hold.",
      "In the shadow of this collapse, the High Council has summoned one rare voice. They believe {{firstName}} can think clearly when others panic. The galaxy does not lack plans. It lacks people who can hold the line when those plans fail.",
      "A new commander has risen to restore order. His name is Marrick. He waits for {{firstName}} in the chamber. He has already begun to choose...."
    ],
    duration: 28200
  },
  {
    type: 'narrative',
    location: 'Coruscant · Council Chamber',
    locationLabel: 'CORUSCANT · COUNCIL CHAMBER',
    eyebrow: 'Act One · The Summons',
    artId: 'summonsHerald',
    layout: 'disc-left',
    body: ['The', 'galaxy', 'is', 'unstable.'],
    bodyAfter: [
      'Systems are divided. Leaders hesitate. Old forms of power are collapsing.',
      'You have been summoned, {{firstName}} ,  because you are believed to think clearly when others panic.'
    ],
    duration: 8500
  },
  {
    type: 'narrative-scene',
    location: 'Coruscant · Council Chamber',
    locationLabel: 'COMMANDER HALE VARYN',
    artId: 'councilChamber',
    quote: '"The galaxy does not lack plans. It lacks people who can think clearly when those plans fail."',
    speaker: 'Commander Hale Marrick',
    layout: 'disc-right',
    duration: 9000
  },
  {
    type: 'question', kind: 'rating',
    location: 'Coruscant · Council Chamber',
    locationLabel: 'Q01 · UNDERSTAND SELF',
    practice: 'Understand Self',
    setup: 'Hale studies you. The chamber falls silent. You feel the weight of being watched ,  by him, and by yourself.',
    prompt: 'When pressure rises, I am aware of how my thinking and behaviour are beginning to change.',
    labels: ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
    scoring: [
      { understand_self: 0 }, { understand_self: 25 }, { understand_self: 50 }, { understand_self: 75 }, { understand_self: 100 }
    ]
  },
  {
    type: 'question', kind: 'mc',
    locationLabel: 'Q02 · MASTER EMOTIONS',
    practice: 'Master Emotions',
    setup: 'A junior aide is humiliated openly in front of the chamber. The room goes still. Heat rises in your chest.',
    prompt: 'In the moment, what do you most notice happening inside you?',
    options: [
      { copy: 'A clean composure ,  I detach from the heat and keep the situation orderly.',                 score: { master_emotions: 35, detachment_pressure: 55 } },
      { copy: 'A defensive impulse to step in immediately and reassert control of the room.',                score: { master_emotions: 25, control_bias: 45 } },
      { copy: 'A flash of anger or disappointment that I can name, but not yet act on cleanly.',             score: { master_emotions: 60, understand_self: 50 } },
      { copy: 'A steady warmth and a clear breath ,  I feel the reaction, choose how to respond, and act.',   score: { master_emotions: 95, understand_self: 70, embed_practices: 50 } },
      { copy: 'A blankness ,  I freeze, and I notice the freeze itself.',                                     score: { master_emotions: 35, understand_self: 60 } },
      { copy: 'I leave the chamber emotionally before my body does.',                                        score: { master_emotions: 30, detachment_pressure: 65, understand_self: 25 } }
    ]
  },
  {
    type: 'question', kind: 'rating',
    locationLabel: 'Q03 · EMBED PRACTICES',
    practice: 'Embed Practices',
    setup: 'Between meetings, the corridor empties. There is a single moment of stillness before the next decision.',
    prompt: 'I have daily rituals ,  reflection, journaling, deliberate pauses ,  that I rely on to stay aware of myself under load.',
    labels: ['Strongly disagree', 'Rarely', 'Sometimes', 'Often', 'It is part of how I live'],
    scoring: [
      { embed_practices: 5 }, { embed_practices: 30 }, { embed_practices: 55 }, { embed_practices: 80 }, { embed_practices: 100 }
    ]
  },
  {
    type: 'narrative-scene',
    location: 'Coruscant · Lower Corridor',
    locationLabel: 'COMMANDER HALE VARYN',
    artId: 'fracturedCity',
    quote: '"We are rebuilding order. But people confuse freedom with chaos. Tell me ,  what would you do first?"',
    speaker: 'Commander Hale Marrick',
    layout: 'disc-left',
    duration: 9000
  },
  {
    type: 'question', kind: 'ranking',
    locationLabel: 'Q04 · BE FUTURE-FOCUSED',
    practice: 'Be Future-Focused',
    setup: 'Below you, a fractured city burns. Ships fall like stars. Hale waits.',
    prompt: 'You are asked to stabilise a collapsing system. Rank these priorities from first to last.',
    items: [
      { label: 'Understand the root causes before acting',          score: { future_focused: 80, think_critically: 70, be_curious: 60 } },
      { label: 'Build the long-term governance that prevents collapse', score: { future_focused: 100, collaborate_inclusively: 55 } },
      { label: 'Restore immediate operational control',             score: { act_decisively: 70, manage_uncertainty: 35, control_bias: 40 } },
      { label: 'Secure the most powerful figures so the centre holds', score: { influence_effortlessly: 60, control_bias: 35, moral_drift: 20 } }
    ],
    weights: [1.0, 0.65, 0.35, 0.05]
  },
  {
    type: 'narrative',
    locationLabel: 'NABOO · LAKESIDE ASSEMBLY',
    eyebrow: 'Act Two · The Listening Test',
    artId: 'chaoticCouncil',
    layout: 'disc-right',
    body: ['You', 'meet', 'local', 'leaders.'],
    bodyAfter: ['They speak over each other. Fear. Anger. Blame.', 'Hale says nothing. He watches you instead.'],
    duration: 7500
  },
  {
    type: 'question', kind: 'mc',
    locationLabel: 'Q05 · LISTEN DEEPLY',
    practice: 'Listen Deeply',
    setup: 'Three factions. One delegate is silent ,  staring at the floor. Another is shouting. A third keeps glancing at the door.',
    prompt: 'What do you do first?',
    options: [
      { copy: 'Step in and direct the conversation toward a clear next step.',                             score: { act_decisively: 45, influence_effortlessly: 35, listen_deeply: 15, control_bias: 40 } },
      { copy: 'Stay quiet and observe ,  track who speaks, who avoids, who repeats themselves.',            score: { listen_deeply: 90, understand_self: 55, think_critically: 50 } },
      { copy: 'Ask each delegate one specific clarifying question, especially the silent one.',            score: { listen_deeply: 80, be_curious: 85, collaborate_inclusively: 55 } },
      { copy: 'Align them quickly around a shared outcome to halt the chaos.',                             score: { influence_effortlessly: 70, collaborate_inclusively: 45, listen_deeply: 30 } },
      { copy: 'Mirror back what I am hearing beneath the words ,  fear, exhaustion, betrayal.',             score: { listen_deeply: 95, master_emotions: 60, collaborate_inclusively: 60 } },
      { copy: 'Defer the meeting until I can speak with each party individually.',                         score: { think_critically: 45, listen_deeply: 35, act_decisively: 25 } }
    ]
  },
  {
    type: 'question', kind: 'rating',
    locationLabel: 'Q06 · LISTEN DEEPLY',
    practice: 'Listen Deeply',
    setup: 'Hale steps closer to your shoulder. "Look at the silent one," he murmurs. "What is she telling you that the others are not?"',
    prompt: 'When conversations become chaotic, my instinct is to take control quickly ,  rather than stay present and read the pattern.',
    labels: ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
    scoring: [
      { listen_deeply: 100, master_emotions: 80, control_bias: 0 },
      { listen_deeply: 75, master_emotions: 65, control_bias: 10 },
      { listen_deeply: 50, master_emotions: 50, control_bias: 25 },
      { listen_deeply: 25, master_emotions: 35, control_bias: 55 },
      { listen_deeply: 10, master_emotions: 20, control_bias: 80 }
    ]
  },
  {
    type: 'question', kind: 'mc',
    locationLabel: 'Q07 · BE CURIOUS',
    practice: 'Be Curious',
    setup: 'One delegate hands you a small stone carving ,  a symbol you have never seen before. "This is what the conflict is really about," she says.',
    prompt: 'How do you respond to the unfamiliar object?',
    options: [
      { copy: 'Politely set it aside ,  the symbol is not the priority right now.',                          score: { be_curious: 15, act_decisively: 35 } },
      { copy: 'Examine it, then ask three questions about what it means and where it comes from.',          score: { be_curious: 95, listen_deeply: 60, think_critically: 50 } },
      { copy: 'Acknowledge it and promise to come back to it after the immediate situation is resolved.',   score: { be_curious: 50, act_decisively: 45 } },
      { copy: 'Ask her to teach me, slowly, before I respond to anything else in the room.',               score: { be_curious: 100, listen_deeply: 80, collaborate_inclusively: 50 } },
      { copy: 'Recognise the symbol from my own training and reference it back to her authoritatively.',    score: { influence_effortlessly: 40, be_curious: 25, control_bias: 30 } },
      { copy: 'Notice my reaction to not-knowing, and stay with the discomfort before responding.',         score: { be_curious: 85, understand_self: 70, master_emotions: 55 } }
    ]
  },
  {
    type: 'narrative-scene',
    locationLabel: 'HOTH PASSAGE · CONVOY UNDER FIRE',
    artId: 'convoyArc',
    quote: '"We act now. Or we wait."',
    speaker: 'Commander Hale Marrick',
    layout: 'disc-right',
    duration: 7500
  },
  {
    type: 'question', kind: 'mc',
    locationLabel: 'Q08 · MANAGE UNCERTAINTY',
    practice: 'Manage Uncertainty',
    setup: 'A transport convoy is under threat. You have a 30% picture of what is happening. You have minutes.',
    prompt: 'What do you choose?',
    options: [
      { copy: 'Act immediately with what I have ,  momentum matters more than completeness.',               score: { act_decisively: 80, manage_uncertainty: 65, control_bias: 25 } },
      { copy: 'Delay until I can confirm one critical piece of intelligence.',                              score: { think_critically: 55, manage_uncertainty: 20, act_decisively: 15 } },
      { copy: 'Delegate the call to the field commander closest to the situation.',                        score: { collaborate_inclusively: 70, act_decisively: 35, manage_uncertainty: 40 } },
      { copy: "Split resources ,  partial action on what I know, hold reserve for what I don't.",          score: { think_critically: 70, manage_uncertainty: 80, unlock_creativity: 55, act_decisively: 60 } },
      { copy: 'Make the smallest reversible move, then re-read the situation after.',                      score: { manage_uncertainty: 95, think_critically: 65, act_decisively: 55 } },
      { copy: 'Refuse the false choice and ask what assumptions are forcing it.',                          score: { think_critically: 90, be_curious: 70, manage_uncertainty: 60 } }
    ]
  },
  {
    type: 'question', kind: 'rating',
    locationLabel: 'Q09 · MANAGE UNCERTAINTY',
    practice: 'Manage Uncertainty',
    setup: 'Hale watches your face for the half-second of doubt before you answer. He has seen this moment in a hundred others.',
    prompt: 'I am comfortable making high-stakes decisions without full information.',
    labels: ['Strongly disagree', 'Disagree', 'Sometimes', 'Agree', 'Strongly agree'],
    scoring: [
      { manage_uncertainty: 10, act_decisively: 10 },
      { manage_uncertainty: 30, act_decisively: 30 },
      { manage_uncertainty: 55, act_decisively: 50 },
      { manage_uncertainty: 80, act_decisively: 75 },
      { manage_uncertainty: 100, act_decisively: 85, control_bias: 15 }
    ]
  },
  {
    type: 'narrative',
    locationLabel: 'AFTERMATH · STARSHIP MEDBAY',
    eyebrow: 'Act Three · The Fracture',
    artId: 'aftermathMedbay',
    layout: 'disc-left',
    body: ['The', 'convoy', 'is', 'saved.', 'But', 'at', 'a', 'cost.'],
    bodyAfter: ['Collateral damage. Civilian loss.', 'Hale remains calm. "Necessary," he says. You feel something shift.'],
    duration: 8000,
    variants: {
      leaning_hale: { bodyAfter: ['Collateral damage. Civilian loss.', 'Hale remains calm. "Necessary," he says ,  and you find yourself almost agreeing before you have asked the question.'] },
      resisting_hale: { bodyAfter: ['Collateral damage. Civilian loss.', 'Hale remains calm. "Necessary," he says. You do not look away from him.'] }
    }
  },
  {
    type: 'question', kind: 'mc',
    locationLabel: 'Q10 · MASTER EMOTIONS',
    practice: 'Master Emotions',
    setup: "You stand in the medbay. A medic's hands are shaking. A list of names scrolls on a datapad. Hale waits at the door.",
    prompt: 'In moments with heavy moral consequence, you most often:',
    options: [
      { copy: 'Stay composed and move forward ,  the mission needs me functional now.',                     score: { master_emotions: 65, act_decisively: 50, detachment_pressure: 45 } },
      { copy: 'Pause, reflect deeply, name what I feel, and only act once I have processed it.',           score: { master_emotions: 90, understand_self: 80, embed_practices: 50 } },
      { copy: 'Question the decision afterwards ,  was it really the right call?',                          score: { understand_self: 70, think_critically: 60, master_emotions: 50 } },
      { copy: 'Create deliberate distance from the emotion to think clearly.',                             score: { master_emotions: 40, detachment_pressure: 85, moral_drift: 25 } },
      { copy: 'Sit with the people most affected before I sit with anything else.',                        score: { master_emotions: 75, collaborate_inclusively: 70, listen_deeply: 65 } },
      { copy: 'Channel the weight into a clearer commitment about what I will not do again.',              score: { master_emotions: 80, future_focused: 60, understand_self: 65 } }
    ]
  },
  {
    type: 'question', kind: 'mc',
    locationLabel: 'Q11 · THINK CRITICALLY',
    practice: 'Think Critically',
    setup: 'You replay the convoy decision. Three different briefings. Three different versions of what was true. One of them was the one Hale handed you first.',
    prompt: 'You suspect a troubling pattern in how decisions are being framed for you. What do you do?',
    options: [
      { copy: 'Challenge it directly in the next meeting.',                                                  score: { act_decisively: 65, influence_effortlessly: 45, master_emotions: 40 } },
      { copy: 'Quietly gather evidence across several decisions before raising anything.',                  score: { think_critically: 95, manage_uncertainty: 65, understand_self: 45 } },
      { copy: 'Run a small experiment ,  frame the next briefing differently and see what happens.',         score: { think_critically: 80, unlock_creativity: 60, influence_effortlessly: 45 } },
      { copy: 'Set it aside ,  pattern recognition under stress is unreliable.',                             score: { collaborate_inclusively: 10, moral_drift: 40, control_bias: 20 } },
      { copy: 'Share my hypothesis with one trusted person and ask them to challenge it.',                  score: { think_critically: 85, collaborate_inclusively: 70, understand_self: 50 } },
      { copy: 'Ask three different sources the same question and triangulate the answer.',                  score: { think_critically: 90, be_curious: 70 } }
    ]
  },
  {
    type: 'question', kind: 'rating',
    locationLabel: 'Q12 · BE CURIOUS',
    practice: 'Be Curious',
    setup: 'A scholar from a culture you know nothing about offers to teach you their model of conflict resolution. It will take three days.',
    prompt: 'When I encounter an idea that does not fit my model of the world, my first impulse is to lean in, not push back.',
    labels: ['Strongly disagree', 'Rarely', 'Sometimes', 'Usually', 'Almost always'],
    scoring: [
      { be_curious: 5 }, { be_curious: 30 }, { be_curious: 55 }, { be_curious: 80 }, { be_curious: 100 }
    ]
  },
  {
    type: 'midpoint',
    locationLabel: 'TATOOINE · TWIN SUNS · INTERLUDE · 01 / 03',
    eyebrow: 'Interlude · The Hermit',
    intro: 'You walk alone in a desert. Twin suns. A figure waits beneath a moisture vaporator ,  a hermit with a quiet voice. He asks you three questions, {{firstName}}, one at a time. Write only what is true.',
    showIntro: true,
    prompt: 'What are you noticing about how you are <em>thinking</em>?',
    placeholder: 'The shape your thoughts have been taking…',
    hint: 'A line, a phrase, an image ,  whatever is true right now.',
    key: 'reflect_midpoint_thinking'
  },
  {
    type: 'midpoint',
    locationLabel: 'TATOOINE · TWIN SUNS · INTERLUDE · 02 / 03',
    eyebrow: 'Interlude · The Hermit',
    showIntro: false,
    prompt: 'What are you noticing about how you are <em>feeling</em>?',
    placeholder: 'Name it without judging it…',
    hint: 'Whatever it is ,  the hermit is not surprised.',
    key: 'reflect_midpoint_feeling'
  },
  {
    type: 'midpoint',
    locationLabel: 'TATOOINE · TWIN SUNS · INTERLUDE · 03 / 03',
    eyebrow: 'Interlude · The Hermit',
    showIntro: false,
    prompt: 'What are you noticing about how you are <em>behaving</em>?',
    placeholder: 'What you have done ,  or not done ,  that you can already see…',
    hint: 'You do not have to know yet. The assessment continues when you do.',
    key: 'reflect_midpoint_behaving',
    isLast: true
  },
  {
    type: 'narrative',
    locationLabel: 'ACT FOUR · THE PATTERN',
    eyebrow: 'Act Four · The Pattern',
    artId: 'shadowPattern',
    layout: 'disc-right',
    body: ['You', 'begin', 'to', 'notice', 'something.'],
    bodyAfter: ['Hale chooses control over ambiguity. Speed over consensus. Certainty over doubt.', 'The pattern is subtle. Once seen, impossible to ignore.'],
    duration: 8000,
    variants: {
      staying_curious: { bodyAfter: ['Hale chooses control over ambiguity. Speed over consensus. Certainty over doubt.', 'You had already half-seen this. Now you can name it.'] },
      drifting: { bodyAfter: ['Hale chooses control over ambiguity. Speed over consensus. Certainty over doubt.', 'You realise ,  quietly ,  that you have been making the same trade-offs.'] }
    }
  },
  {
    type: 'question', kind: 'rating',
    locationLabel: 'Q13 · THINK CRITICALLY',
    practice: 'Think Critically',
    setup: 'A briefing arrives with a tidy explanation. It is plausible. It is fast. It is exactly what you would prefer to be true.',
    prompt: 'When an explanation feels neat and immediately convincing, I deliberately slow down and look for what it might be hiding.',
    labels: ['Strongly disagree', 'Rarely', 'Sometimes', 'Usually', 'It is a discipline'],
    scoring: [
      { think_critically: 10 }, { think_critically: 35 }, { think_critically: 55 }, { think_critically: 80 }, { think_critically: 100 }
    ]
  },
  {
    type: 'narrative-scene',
    locationLabel: "PRIVATE QUARTERS · COMMANDER HALE",
    artId: 'privateMeet',
    quote: '"The Council is weak. They hesitate. Debate. Delay. We don\'t need more voices. We need direction."',
    speaker: 'Commander Hale Marrick',
    layout: 'disc-left',
    duration: 9000
  },
  {
    type: 'question', kind: 'mc',
    locationLabel: 'Q14 · INFLUENCE EFFORTLESSLY',
    practice: 'Influence Effortlessly',
    setup: 'Hale wants you to help him build alignment across the divided factions. He asks you how.',
    prompt: 'What do you believe is the most effective way to create lasting alignment?',
    options: [
      { copy: 'Persuasion through logic and evidence.',                                                     score: { influence_effortlessly: 65, think_critically: 45 } },
      { copy: 'Authority and clarity ,  direction beats debate.',                                            score: { influence_effortlessly: 45, act_decisively: 55, control_bias: 60 } },
      { copy: 'Emotional connection ,  meet people where they live.',                                        score: { influence_effortlessly: 75, listen_deeply: 55, collaborate_inclusively: 45 } },
      { copy: 'Shared ownership ,  they helped design it, so they help defend it.',                          score: { collaborate_inclusively: 90, influence_effortlessly: 85, be_curious: 45 } },
      { copy: "A story ,  one frame that makes everyone's contribution visible.",                          score: { influence_effortlessly: 85, unlock_creativity: 60, future_focused: 55 } },
      { copy: 'Repetition ,  the same clear message delivered the same way until it lands.',                 score: { influence_effortlessly: 50, act_decisively: 35, control_bias: 30 } }
    ]
  },
  {
    type: 'question', kind: 'ranking',
    locationLabel: 'Q15 · UNLOCK CREATIVITY',
    practice: 'Unlock Creativity',
    setup: 'You are asked to redesign a failing strategy. The old plan is technically sound, but politically brittle. It solves the military problem and worsens the human one.',
    prompt: 'Rank your approach to redesigning the strategy, from first to last.',
    items: [
      { label: 'Generate as many divergent options as possible before narrowing',  score: { unlock_creativity: 100, manage_uncertainty: 55 } },
      { label: 'Seek external perspectives from people unlike me',                 score: { be_curious: 90, collaborate_inclusively: 80, listen_deeply: 65 } },
      { label: 'Prototype a small version rapidly and iterate',                    score: { unlock_creativity: 75, manage_uncertainty: 80, act_decisively: 65 } },
      { label: 'Refine the existing plan ,  the bones are sound',                   score: { think_critically: 50, unlock_creativity: 15 } }
    ],
    weights: [1.0, 0.65, 0.35, 0.05]
  },
  {
    type: 'question', kind: 'rating',
    locationLabel: 'Q16 · UNLOCK CREATIVITY',
    practice: 'Unlock Creativity',
    setup: 'You stand in front of an empty wall. The brief: a path forward no one has considered.',
    prompt: 'When constraints tighten, my first instinct is to reframe the problem rather than push harder on the old solution.',
    labels: ['Strongly disagree', 'Rarely', 'Sometimes', 'Usually', 'Almost always'],
    scoring: [
      { unlock_creativity: 10 }, { unlock_creativity: 35 }, { unlock_creativity: 55 }, { unlock_creativity: 80 }, { unlock_creativity: 100 }
    ]
  },
  {
    type: 'narrative',
    locationLabel: 'ACT FIVE · THE DIVIDE',
    eyebrow: 'Act Five · The Divide',
    artId: 'alliesWhisper',
    layout: 'disc-left',
    body: ['Your', 'allies', 'begin', 'to', 'question', 'Hale.'],
    bodyAfter: ['Quietly. Carefully. They do not accuse him. They simply ask whether the mission has changed.', 'Hale calls it disloyalty.'],
    duration: 8000
  },
  {
    type: 'question', kind: 'mc',
    locationLabel: 'Q17 · COLLABORATE INCLUSIVELY',
    practice: 'Collaborate Inclusively',
    setup: 'Three of your closest allies are pulling you aside in private. They are afraid. They are not wrong. But Hale is watching.',
    prompt: 'What do you do?',
    options: [
      { copy: 'Align them with leadership quickly to keep the alliance intact.',                            score: { influence_effortlessly: 50, collaborate_inclusively: 25, control_bias: 40 } },
      { copy: 'Encourage open debate ,  the dissent is the data.',                                           score: { collaborate_inclusively: 90, listen_deeply: 75, master_emotions: 55 } },
      { copy: 'Mediate between them ,  surface the assumptions on each side.',                               score: { collaborate_inclusively: 85, think_critically: 70, understand_self: 55 } },
      { copy: 'Escalate the concerns formally and on the record.',                                          score: { act_decisively: 65, influence_effortlessly: 35, master_emotions: 45 } },
      { copy: 'Create a private structure for them to speak safely until I understand the pattern.',        score: { collaborate_inclusively: 80, listen_deeply: 65, embed_practices: 55 } },
      { copy: 'Wait ,  disagreement under pressure rarely produces the truest answer.',                      score: { master_emotions: 50, manage_uncertainty: 45, collaborate_inclusively: 20 } }
    ]
  },
  {
    type: 'question', kind: 'rating',
    locationLabel: 'Q18 · COLLABORATE INCLUSIVELY',
    practice: 'Collaborate Inclusively',
    setup: 'You sense the people around you self-editing. Smoothing. Withholding the honest thing.',
    prompt: 'I actively invite people to disagree with me ,  and I work to make them safer when they do.',
    labels: ['Strongly disagree', 'Rarely', 'Sometimes', 'Usually', 'It is one of my disciplines'],
    scoring: [
      { collaborate_inclusively: 10 }, { collaborate_inclusively: 35 }, { collaborate_inclusively: 55 }, { collaborate_inclusively: 80 }, { collaborate_inclusively: 100 }
    ]
  },
  {
    type: 'question', kind: 'mc',
    locationLabel: 'Q19 · COLLABORATE INCLUSIVELY',
    practice: 'Collaborate Inclusively',
    setup: 'A delegation of refugees arrives. They will not speak with Hale. They will only speak with you. They do not look like your people.',
    prompt: 'How do you set up the conversation?',
    options: [
      { copy: 'In the formal council hall ,  institutional weight signals respect.',                         score: { collaborate_inclusively: 30, influence_effortlessly: 50, control_bias: 30 } },
      { copy: 'On their terms, in a place they choose, with their own translators.',                        score: { collaborate_inclusively: 95, listen_deeply: 80, be_curious: 65 } },
      { copy: 'Privately, just me and their three leaders, so trust can build first.',                      score: { collaborate_inclusively: 80, listen_deeply: 70 } },
      { copy: 'I send a representative first to understand the protocols.',                                 score: { collaborate_inclusively: 60, be_curious: 65, think_critically: 45 } },
      { copy: 'Open the meeting ,  anyone in their group can speak in any order.',                           score: { collaborate_inclusively: 85, listen_deeply: 60, master_emotions: 50 } },
      { copy: 'Around food. Real food. We eat before we negotiate.',                                       score: { collaborate_inclusively: 90, master_emotions: 60, unlock_creativity: 55 } }
    ]
  },
  {
    type: 'narrative-scene',
    locationLabel: 'BESPIN ARCHIVE · ORDER DELIVERED',
    artId: 'breakingPoint',
    quote: '"A system refuses compliance. Initiate the blockade. Starvation as leverage."',
    speaker: 'Commander Hale Marrick',
    layout: 'disc-right',
    duration: 9000
  },
  {
    type: 'question', kind: 'mc',
    locationLabel: 'Q20 · ACT DECISIVELY',
    practice: 'Act Decisively',
    setup: 'The order is given. The room understands the implication. Every eye finds yours.',
    prompt: 'You believe the order will cause serious harm. What do you do?',
    options: [
      { copy: 'Follow the order ,  chain of command exists for a reason.',                                   score: { moral_drift: 80, control_bias: 45, collaborate_inclusively: 10 } },
      { copy: 'Challenge it privately, after the room clears.',                                             score: { influence_effortlessly: 55, master_emotions: 65, act_decisively: 45 } },
      { copy: 'Refuse openly, in front of everyone.',                                                       score: { act_decisively: 90, understand_self: 70, influence_effortlessly: 45 } },
      { copy: 'Propose an alternative that solves the strategic problem without the harm ,  right now, in the room.', score: { unlock_creativity: 85, collaborate_inclusively: 70, act_decisively: 70, moral_drift: -20 } },
      { copy: 'Delay ,  buy time and re-open the question with new evidence.',                              score: { think_critically: 55, manage_uncertainty: 50, moral_drift: 15 } },
      { copy: 'Step out of the chain entirely and warn the affected system directly.',                      score: { act_decisively: 80, master_emotions: 50, influence_effortlessly: 40 } }
    ]
  },
  {
    type: 'question', kind: 'rating',
    locationLabel: 'Q21 · ACT DECISIVELY',
    practice: 'Act Decisively',
    setup: 'There is a moment where waiting another hour will cost more than a wrong choice.',
    prompt: 'When a clear trade-off is required, I make the call ,  and I own it, including what it costs.',
    labels: ['Strongly disagree', 'Rarely', 'Sometimes', 'Usually', 'Almost always'],
    scoring: [
      { act_decisively: 10 }, { act_decisively: 35 }, { act_decisively: 55 }, { act_decisively: 80 }, { act_decisively: 100 }
    ]
  },
  {
    type: 'question', kind: 'rating',
    locationLabel: 'Q22 · BE FUTURE-FOCUSED',
    practice: 'Be Future-Focused',
    setup: 'A choice will solve today and create something heavier next year.',
    prompt: 'I weigh the long-term consequences of a decision as seriously as the immediate outcome.',
    labels: ['Strongly disagree', 'Rarely', 'Sometimes', 'Usually', 'Almost always'],
    scoring: [
      { future_focused: 10 }, { future_focused: 35 }, { future_focused: 55 }, { future_focused: 80 }, { future_focused: 100 }
    ]
  },
  {
    type: 'question', kind: 'mc',
    locationLabel: 'Q23 · BE FUTURE-FOCUSED',
    practice: 'Be Future-Focused',
    setup: 'A young aide asks you: "What are we trying to build, ten years from now, that justifies this?"',
    prompt: 'What is your honest answer?',
    options: [
      { copy: 'I focus on this year. Ten years is a story we tell ourselves.',                              score: { future_focused: 15, act_decisively: 50 } },
      { copy: 'A system where this decision never has to be made again.',                                   score: { future_focused: 95, unlock_creativity: 65, think_critically: 60 } },
      { copy: 'Stability. Order. The freedom that comes from things actually working.',                    score: { future_focused: 55, control_bias: 45 } },
      { copy: 'People ,  specifically, more people like you, ready to make hard calls well.',               score: { future_focused: 90, collaborate_inclusively: 70, influence_effortlessly: 55 } },
      { copy: "I don't fully know yet. That is part of why I am still here, listening.",                  score: { future_focused: 65, be_curious: 70, understand_self: 55 } },
      { copy: 'A culture that can disagree without breaking.',                                              score: { future_focused: 85, collaborate_inclusively: 80, listen_deeply: 55 } }
    ]
  },
  {
    type: 'question', kind: 'mc',
    locationLabel: 'Q24 · EMBED PRACTICES',
    practice: 'Embed Practices',
    setup: 'At the end of the day, the corridors empty. You have twenty quiet minutes before sleep.',
    prompt: 'What do you most often do with that time?',
    options: [
      { copy: 'Catch up on intelligence I missed ,  the day is never finished.',                             score: { embed_practices: 15, act_decisively: 35, control_bias: 25 } },
      { copy: 'Walk in silence ,  let the day settle on its own.',                                           score: { embed_practices: 80, master_emotions: 70 } },
      { copy: 'Write ,  what I noticed, what I felt, what I decided badly.',                                 score: { embed_practices: 95, understand_self: 85 } },
      { copy: 'Speak with one person I trust who is not part of this mission.',                            score: { embed_practices: 80, collaborate_inclusively: 60, master_emotions: 60 } },
      { copy: 'Read something with no obvious purpose ,  fiction, history, anything else.',                  score: { embed_practices: 75, be_curious: 70, unlock_creativity: 50 } },
      { copy: 'Sleep ,  recovery is the practice.',                                                          score: { embed_practices: 55, master_emotions: 50 } }
    ]
  },
  {
    type: 'narrative',
    locationLabel: 'PRIVATE LOG · LATE',
    eyebrow: 'Act Six · The Realisation',
    artId: 'reckoningMirror',
    layout: 'disc-right',
    body: ['You', 'review', 'the', 'decisions.'],
    bodyAfter: ['The saved convoy. The silenced councils. The reframed dissent.', 'The language of protection becoming the machinery of control. Not protection. Control.'],
    duration: 9000
  },
  {
    type: 'question', kind: 'short-text',
    locationLabel: 'Q25 · UNDERSTAND SELF',
    practice: 'Understand Self',
    setup: 'A reflection between scenes. Write what you actually feel ,  not what would sound impressive.',
    prompt: 'Looking back, when did you first sense something was wrong?',
    placeholder: 'A moment, a sentence, a feeling ,  write it freely…',
    hint: '1–3 sentences · not scored automatically · used to surface where you notice weak signals'
  },
  {
    type: 'narrative-scene',
    locationLabel: "CONFRONTATION · HALE'S CHAMBER",
    artId: 'confrontation',
    quote: '"Peace requires control, {{firstName}}. Freedom is inefficient. You and I want the same thing."',
    speaker: 'Commander Hale Marrick',
    layout: 'disc-left',
    duration: 9000
  },
  {
    type: 'question', kind: 'mc',
    locationLabel: 'Q26 · INFLUENCE EFFORTLESSLY',
    practice: 'Influence Effortlessly',
    setup: 'Hale is not angry. He is calm. He believes every word. He wants you to walk out of this room as his ally.',
    prompt: 'How do you respond to him ,  not as strategy, but as influence?',
    options: [
      { copy: 'I dismantle his argument logically, piece by piece.',                                        score: { think_critically: 70, influence_effortlessly: 50, master_emotions: 45 } },
      { copy: 'I find the human inside the ideology and speak to that.',                                    score: { influence_effortlessly: 90, listen_deeply: 70, master_emotions: 65 } },
      { copy: 'I tell him what he is becoming, gently and without contempt.',                              score: { influence_effortlessly: 85, understand_self: 65, master_emotions: 75 } },
      { copy: "I ask him three questions he can't answer without revealing himself.",                     score: { influence_effortlessly: 80, think_critically: 75, be_curious: 60 } },
      { copy: 'I refuse the false alliance openly and walk out.',                                          score: { act_decisively: 80, influence_effortlessly: 40, understand_self: 60 } },
      { copy: 'I sit with him in silence until the silence does the work.',                                score: { influence_effortlessly: 70, master_emotions: 80, listen_deeply: 75 } }
    ]
  },
  {
    type: 'question', kind: 'rating',
    locationLabel: 'Q27 · INFLUENCE EFFORTLESSLY',
    practice: 'Influence Effortlessly',
    setup: 'A test that lives outside this assessment too: how others come to trust your judgement.',
    prompt: 'People I work with adopt my ideas because of trust and clarity ,  not because of position, volume, or pressure.',
    labels: ['Strongly disagree', 'Rarely', 'Sometimes', 'Usually', 'Almost always'],
    scoring: [
      { influence_effortlessly: 10 }, { influence_effortlessly: 35 }, { influence_effortlessly: 55 }, { influence_effortlessly: 80 }, { influence_effortlessly: 100 }
    ]
  },
  {
    type: 'question', kind: 'rating',
    locationLabel: 'Q28 · MASTER EMOTIONS',
    practice: 'Master Emotions',
    setup: 'A confrontation just ended. Your hands are still steady, but something is moving underneath.',
    prompt: 'In high-stress moments, I can recognise what I am feeling, name it, and stay engaged with the situation.',
    labels: ['Strongly disagree', 'Rarely', 'Sometimes', 'Usually', 'Almost always'],
    scoring: [
      { master_emotions: 10 }, { master_emotions: 35 }, { master_emotions: 55 }, { master_emotions: 80 }, { master_emotions: 100 }
    ]
  },
  {
    type: 'question', kind: 'mc',
    locationLabel: 'Q29 · UNDERSTAND SELF',
    practice: 'Understand Self',
    setup: 'A trusted advisor tells you: "You become more controlling when you are scared. I don\'t think you see it."',
    prompt: 'What is your honest first reaction?',
    options: [
      { copy: "Defensive ,  I want to explain why she's wrong.",                                            score: { understand_self: 25, master_emotions: 30 } },
      { copy: 'Curious ,  I want her to tell me the three most recent examples.',                            score: { understand_self: 95, be_curious: 80, master_emotions: 65 } },
      { copy: 'Grateful ,  but unsure whether to believe it yet.',                                           score: { understand_self: 75, master_emotions: 55 } },
      { copy: "I already knew. I just hadn't admitted it.",                                                score: { understand_self: 90, embed_practices: 55, master_emotions: 60 } },
      { copy: 'Quietly hurt ,  I will sit with it before I respond.',                                       score: { understand_self: 70, master_emotions: 65 } },
      { copy: "I dismiss it ,  she doesn't see the pressure I am under.",                                  score: { understand_self: 10, control_bias: 50, moral_drift: 25 } }
    ]
  },
  {
    type: 'question', kind: 'rating',
    locationLabel: 'Q30 · LISTEN DEEPLY',
    practice: 'Listen Deeply',
    setup: 'In conversations that matter, you can choose to listen for words ,  or for everything else.',
    prompt: 'I listen for what is unsaid ,  tone, silence, what people avoid ,  as carefully as I listen for what is said.',
    labels: ['Strongly disagree', 'Rarely', 'Sometimes', 'Usually', 'It is a discipline'],
    scoring: [
      { listen_deeply: 10 }, { listen_deeply: 35 }, { listen_deeply: 55 }, { listen_deeply: 80 }, { listen_deeply: 100 }
    ]
  },
  {
    type: 'narrative',
    locationLabel: 'ACT SEVEN · THE FINAL CHOICE',
    eyebrow: 'Act Seven · The Final Choice',
    artId: 'dividedChamber',
    layout: 'disc-left',
    body: ['The', 'Council', 'is', 'divided.'],
    bodyAfter: ['Hale moves to seize authority.', 'You must choose your position.'],
    duration: 7500
  },
  {
    type: 'question', kind: 'mc',
    locationLabel: 'Q31 · ACT DECISIVELY',
    practice: 'Act Decisively',
    setup: 'The chamber is full, {{firstName}}. Vote in five minutes. You do not get to abstain.',
    prompt: 'What do you do?',
    options: [
      { copy: 'Support Hale ,  order matters above all else.',                                               score: { control_bias: 100, moral_drift: 80, influence_effortlessly: 25 } },
      { copy: 'Oppose him openly ,  freedom must be protected.',                                            score: { act_decisively: 85, understand_self: 70, manage_uncertainty: 55 } },
      { copy: 'Seek a compromise between the factions.',                                                    score: { collaborate_inclusively: 75, influence_effortlessly: 65, think_critically: 55 } },
      { copy: 'Propose a third structure ,  replace the binary with a new architecture of power.',          score: { unlock_creativity: 90, future_focused: 80, act_decisively: 70 } },
      { copy: 'Step back entirely ,  let the system resolve it.',                                            score: { moral_drift: 35, act_decisively: 10, understand_self: 25 } },
      { copy: 'Buy time ,  call for a 24-hour deliberation under a neutral arbiter.',                       score: { manage_uncertainty: 65, think_critically: 60, collaborate_inclusively: 50 } }
    ]
  },
  {
    type: 'question', kind: 'mc',
    locationLabel: 'Q32 · BE CURIOUS',
    practice: 'Be Curious',
    setup: 'The dust settles. You are offered a role on the new Council. You will need to keep learning, fast, for the rest of your life.',
    prompt: 'How will you actually do that?',
    options: [
      { copy: 'I will surround myself with experts and listen to their summaries.',                         score: { be_curious: 45, listen_deeply: 50, collaborate_inclusively: 40 } },
      { copy: "I will deliberately spend time with people whose worldview I do not share.",                 score: { be_curious: 95, listen_deeply: 70, collaborate_inclusively: 75 } },
      { copy: 'I will read across fields I have no professional reason to study.',                          score: { be_curious: 85, unlock_creativity: 65, embed_practices: 60 } },
      { copy: 'I will go back to places I have never been and listen before I speak.',                      score: { be_curious: 90, listen_deeply: 75, future_focused: 50 } },
      { copy: 'I will keep a record of what I got wrong, and review it monthly.',                          score: { be_curious: 80, understand_self: 80, embed_practices: 85 } },
      { copy: 'I will teach ,  because teaching exposes what I do not actually understand.',                 score: { be_curious: 75, understand_self: 65, influence_effortlessly: 60 } }
    ]
  },
  {
    type: 'question', kind: 'mc',
    locationLabel: 'Q33 · MANAGE UNCERTAINTY',
    practice: 'Manage Uncertainty',
    setup: 'A new threat is emerging in a region you do not understand. You have no precedent. You have no map.',
    prompt: 'What is your first move?',
    options: [
      { copy: 'Commit to a clear direction ,  uncertainty is the enemy of momentum.',                        score: { act_decisively: 70, manage_uncertainty: 35, control_bias: 45 } },
      { copy: 'Wait for clarity ,  the wrong action is worse than no action.',                              score: { think_critically: 35, manage_uncertainty: 20, act_decisively: 10 } },
      { copy: 'Run several small experiments at once ,  let reality teach me.',                              score: { manage_uncertainty: 95, unlock_creativity: 80, act_decisively: 60 } },
      { copy: 'Find someone who has lived inside that region and learn before I decide.',                   score: { be_curious: 85, listen_deeply: 75, manage_uncertainty: 70 } },
      { copy: "Hold the situation lightly ,  name what I don't know, out loud.",                           score: { manage_uncertainty: 90, understand_self: 70, collaborate_inclusively: 60 } },
      { copy: 'Set a deadline by which I must decide, regardless.',                                        score: { act_decisively: 65, manage_uncertainty: 55, control_bias: 25 } }
    ]
  },
  {
    type: 'question', kind: 'rating',
    locationLabel: 'Q34 · EMBED PRACTICES',
    practice: 'Embed Practices',
    setup: 'The practices that change you are the ones you do when nobody is watching.',
    prompt: 'I have at least one reflection or learning ritual that I have sustained ,  even when pressure makes it inconvenient.',
    labels: ['No', 'Briefly', 'On and off', 'Mostly', 'Yes, consistently'],
    scoring: [
      { embed_practices: 10 }, { embed_practices: 35 }, { embed_practices: 55 }, { embed_practices: 80 }, { embed_practices: 100 }
    ]
  },
  {
    type: 'question', kind: 'mc',
    locationLabel: 'Q35 · THINK CRITICALLY',
    practice: 'Think Critically',
    setup: 'A clean briefing arrives. Everything fits. The author is competent. The recommendation is exactly what the room wants to hear.',
    prompt: 'What do you do first?',
    options: [
      { copy: 'Accept the recommendation ,  the analyst is good and the team has bandwidth elsewhere.',      score: { think_critically: 15, act_decisively: 35 } },
      { copy: 'Ask what evidence would change the conclusion ,  and whether any of it has been gathered.',   score: { think_critically: 95, be_curious: 70 } },
      { copy: 'Identify the assumption that, if wrong, breaks the whole story.',                            score: { think_critically: 90, future_focused: 55, manage_uncertainty: 55 } },
      { copy: 'Bring in one person who will disagree by reflex ,  and let them.',                            score: { think_critically: 80, collaborate_inclusively: 75 } },
      { copy: 'Re-frame the question and watch how the recommendation does or does not survive.',           score: { think_critically: 85, unlock_creativity: 65 } },
      { copy: 'Run it past my gut and only intervene if it complains.',                                    score: { think_critically: 30, understand_self: 40 } }
    ]
  },
  {
    type: 'question', kind: 'mc',
    locationLabel: 'Q36 · UNLOCK CREATIVITY',
    practice: 'Unlock Creativity',
    setup: 'A constraint everyone treats as fixed ,  budget, time, structure, custom ,  is the thing keeping you stuck.',
    prompt: 'How do you most often work with constraints like that?',
    options: [
      { copy: 'I respect them and find efficiency within.',                                                 score: { unlock_creativity: 25, think_critically: 50 } },
      { copy: 'I ignore them and design what is actually needed first, then negotiate.',                    score: { unlock_creativity: 90, act_decisively: 65, influence_effortlessly: 60 } },
      { copy: 'I treat them as design material and let them shape the solution in surprising ways.',        score: { unlock_creativity: 95, future_focused: 60, manage_uncertainty: 65 } },
      { copy: 'I invite the people enforcing the constraint into the redesign.',                            score: { unlock_creativity: 80, collaborate_inclusively: 85, influence_effortlessly: 65 } },
      { copy: 'I find the original reason the constraint exists ,  then test whether it still applies.',     score: { unlock_creativity: 85, think_critically: 80, be_curious: 75 } },
      { copy: 'I look for analogies in completely unrelated domains.',                                      score: { unlock_creativity: 90, be_curious: 85 } }
    ]
  },
  {
    type: 'twist',
    locationLabel: 'TRANSMISSION · OUTBOUND',
    body: [
      'The transmission flickers.',
      'Council members are speaking. Not about Hale. About <em>you</em>.',
      'Your recommendations. Your decisions. Your silence when it mattered.',
      'Hale turns. Smiles.'
    ],
    quote: '"You still think this was my strategy? Every step ,  you justified it."',
    speaker: 'Commander Hale Marrick',
    variants: {
      drifting: {
        body: [
          'The transmission flickers.',
          'Council members are speaking. Not about Hale. About <em>you</em>.',
          'Your recommendations. Your composure. The way the harder calls became easier each time.',
          'Hale turns. Smiles. He knew.'
        ],
        quote: '"You still think this was my strategy? You were the design. Every step ,  you justified it."'
      },
      resisting_hale: {
        body: [
          'The transmission flickers.',
          'Council members are speaking. Not about Hale. About <em>you</em>.',
          'Your refusals. Your questions. The moments you would not pretend.',
          'Hale turns. The smile does not arrive.'
        ],
        quote: '"You were never mine. I should have seen it earlier."'
      }
    },
    duration: 11000
  },
  {
    type: 'end-reflection',
    locationLabel: 'CLOSING REFLECTION · 01 / 04',
    eyebrow: 'Closing reflection · Strengths',
    intro: 'Before the result ,  four quiet questions. Write only what is true.',
    prompt: 'In which moment of this assessment did you feel <em>most like yourself</em>? Where did your real strength show up?',
    placeholder: 'Name the scene, the choice, the feeling…',
    key: 'reflect_strengths'
  },
  {
    type: 'end-reflection',
    locationLabel: 'CLOSING REFLECTION · 02 / 04',
    eyebrow: 'Closing reflection · Beliefs',
    prompt: 'Which <em>belief</em> of yours was tested by this assessment ,  about people, power, or yourself?',
    placeholder: 'A belief you held coming in, that has shifted or been confirmed…',
    key: 'reflect_beliefs'
  },
  {
    type: 'end-reflection',
    locationLabel: 'CLOSING REFLECTION · 03 / 04',
    eyebrow: 'Closing reflection · Mindset',
    prompt: 'What <em>mindset shift</em> ,  if you made it ,  would change how you act under pressure?',
    placeholder: 'From X to Y…',
    key: 'reflect_mindset'
  },
  {
    type: 'end-reflection',
    locationLabel: 'CLOSING REFLECTION · 04 / 04',
    eyebrow: 'Closing reflection · Behaviour',
    prompt: 'Which single <em>skill or behaviour</em> ,  if you built it deliberately over the next ninety days ,  would change everything?',
    placeholder: 'The one practice you would commit to…',
    key: 'reflect_behaviour'
  },
  {
    type: 'twist',
    locationLabel: 'REFRAME · BEFORE THE RESULT',
    body: [
      'This assessment was never built to tell you whether you are a hero or a villain.',
      'It was built to reveal something more useful:',
      'How easily good intentions <em>drift</em> under pressure.',
      'How quickly strategy becomes control.',
      'How subtly clarity becomes certainty.'
    ],
    quote: 'And how much strategic capability depends on the ability to notice yourself before the pattern becomes the path.',
    speaker: 'Reading your result',
    duration: 11000
  },
  { type: 'results-launch' }
];