/**
 * SfaPreview — renders each scene type using the exact SFA CSS classes
 * so the admin preview matches what the participant sees 1:1.
 * Skin theme vars are injected inline on the wrapper so the preview
 * re-colours when a different skin is active.
 */
import React from 'react';

export default function SfaPreview({ scene, skinTheme }) {
  // Build a CSS-vars style block from the skin theme
  const themeStyle = skinTheme
    ? Object.entries(skinTheme).reduce((acc, [k, v]) => { acc[k] = v; return acc; }, {})
    : {};

  const wrapStyle = {
    ...themeStyle,
    background: 'var(--bg, #0c0a0a)',
    width: '100%',
    minHeight: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '56px 48px 64px',
    boxSizing: 'border-box',
    position: 'relative',
    fontFamily: 'var(--sans, "Inter", sans-serif)',
  };

  return (
    <div style={wrapStyle}>
      {scene.locationLabel && <LocationTag label={scene.locationLabel} />}
      <SceneContent scene={scene} />
    </div>
  );
}

function LocationTag({ label }) {
  return (
    <div className="sfa-location-tag" style={{ opacity: 1, position: 'absolute', top: 28, left: 40 }}>
      {label}
    </div>
  );
}

function SceneContent({ scene }) {
  switch (scene.type) {
    case 'landing':       return <LandingContent scene={scene} />;
    case 'narrative':     return <NarrativeContent scene={scene} />;
    case 'narrative-scene': return <NarrativeQuoteContent scene={scene} />;
    case 'question':      return <QuestionContent scene={scene} />;
    case 'midpoint':      return <ReflectionContent scene={scene} isMidpoint />;
    case 'end-reflection': return <ReflectionContent scene={scene} />;
    case 'twist':         return <TwistContent scene={scene} />;
    case 'intake':        return <IntakeContent scene={scene} />;
    case 'crawl':         return <CrawlContent scene={scene} />;
    case 'results-launch': return <ResultsLaunchContent scene={scene} />;
    default:              return <GenericContent scene={scene} />;
  }
}

function LandingContent({ scene }) {
  const titleWords = Array.isArray(scene.title) ? scene.title : [scene.title || ''];
  return (
    <div className="sfa-scene-inner sfa-layout-centered" style={{ paddingTop: 40 }}>
      <div className="sfa-eyebrow">{scene.locationLabel}</div>
      <h1 className="sfa-landing-title" style={{ marginTop: 28 }}
        dangerouslySetInnerHTML={{ __html: titleWords.join(' ') }} />
      {scene.sub && (
        <div className="sfa-landing-sub" style={{ marginTop: 24 }}>{scene.sub}</div>
      )}
      {scene.note && (
        <div className="sfa-framing-note" style={{ marginTop: 36 }}
          dangerouslySetInnerHTML={{ __html: scene.note }} />
      )}
      <div style={{ marginTop: 48 }}>
        <div className="sfa-landing-cta">
          <span>{scene.cta || 'Begin the assessment'}</span>
          <span className="sfa-arrow" />
        </div>
      </div>
    </div>
  );
}

function NarrativeContent({ scene }) {
  const bodyWords = Array.isArray(scene.body) ? scene.body.join(' ') : (scene.body || '');
  const bodyAfter = scene.bodyAfter || [];
  return (
    <div style={{ maxWidth: 700, width: '100%', paddingTop: 20 }}>
      {scene.eyebrow && <div className="sfa-eyebrow" style={{ marginBottom: 28 }}>{scene.eyebrow}</div>}
      <h2 className="sfa-display" style={{ fontSize: 'clamp(28px,5vw,72px)', marginBottom: 28 }}
        dangerouslySetInnerHTML={{ __html: bodyWords }} />
      {bodyAfter.map((line, i) => (
        <p key={i} className="sfa-body-text"
          style={{ maxWidth: 580, marginBottom: 14 }}
          dangerouslySetInnerHTML={{ __html: line }} />
      ))}
    </div>
  );
}

function NarrativeQuoteContent({ scene }) {
  return (
    <div style={{ maxWidth: 700, width: '100%', paddingTop: 20 }}>
      <div className="sfa-narrative-quote" dangerouslySetInnerHTML={{ __html: scene.quote || '' }}>
      </div>
      {scene.speaker && (
        <div className="sfa-narrative-quote" style={{ fontSize: 14 }}>
          <span className="sfa-speaker">{scene.speaker}</span>
        </div>
      )}
    </div>
  );
}

function QuestionContent({ scene }) {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  const rankLabels = ['1st', '2nd', '3rd', '4th'];

  return (
    <div className="sfa-question-block" style={{ width: '100%', maxWidth: 720, paddingTop: 16 }}>
      <div className="sfa-q-meta">
        <span style={{ color: 'var(--amber)' }}>{scene.practice || ''}</span>
        <span>{scene.locationLabel}</span>
      </div>

      {scene.setup && (
        <div className="sfa-body-text"
          style={{ marginBottom: 24, color: 'var(--ink-mute)', fontStyle: 'italic', fontFamily: 'var(--serif)', fontSize: 17 }}>
          {scene.setup}
        </div>
      )}

      <div className="sfa-q-prompt" dangerouslySetInnerHTML={{ __html: scene.prompt || '' }} />

      {scene.kind === 'rating' && (
        <div className="sfa-q-scale">
          {(scene.labels || ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree']).map((label, i) => (
            <div key={i} className="sfa-q-scale-item">
              <div className="sfa-q-scale-num">{i + 1}</div>
              <div className="sfa-q-scale-label">{label}</div>
            </div>
          ))}
        </div>
      )}

      {scene.kind === 'mc' && (
        <div className="sfa-q-options">
          {(scene.options || []).map((opt, i) => (
            <div key={i} className="sfa-q-option">
              <div className="sfa-letter">{letters[i]}</div>
              <div className="sfa-copy">{opt.copy || opt.label || opt.text || ''}</div>
            </div>
          ))}
        </div>
      )}

      {scene.kind === 'ranking' && (
        <>
          <div className="sfa-q-ranking-hint">Click items in the order you would prioritise — first to last.</div>
          <div className="sfa-q-ranking">
            {(scene.items || []).map((item, i) => (
              <div key={i} className="sfa-q-ranking-item">
                <div className="sfa-q-ranking-rank sfa-empty">—</div>
                <div className="sfa-q-ranking-copy">{item.label || item.text || ''}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {scene.kind === 'short-text' && (
        <>
          <textarea className="sfa-q-textarea" placeholder={scene.placeholder || ''} readOnly style={{ pointerEvents: 'none' }} />
          <div className="sfa-q-text-meta">{scene.hint}</div>
        </>
      )}

      {(scene.kind === 'ranking' || scene.kind === 'short-text') && (
        <button className="sfa-q-advance" style={{ opacity: 0.4, pointerEvents: 'none' }}>
          <span>Continue</span>
          <span className="sfa-arrow" />
        </button>
      )}
    </div>
  );
}

function ReflectionContent({ scene, isMidpoint }) {
  return (
    <div className="sfa-reflect-card" style={{ maxWidth: 640, width: '100%', paddingTop: 20 }}>
      {scene.eyebrow && <div className="sfa-eyebrow" style={{ marginBottom: 28 }}>{scene.eyebrow}</div>}
      {scene.showIntro && scene.intro && (
        <div className="sfa-body-text" style={{ margin: '0 0 36px', fontSize: 'clamp(15px,1.4vw,20px)' }}
          dangerouslySetInnerHTML={{ __html: scene.intro }} />
      )}
      <div className="sfa-reflect-prompt"
        dangerouslySetInnerHTML={{ __html: scene.prompt || '' }} />
      <textarea className="sfa-q-textarea" placeholder={scene.placeholder || ''} readOnly style={{ pointerEvents: 'none', marginTop: 8 }} />
      {scene.hint && (
        <div className="sfa-q-text-meta"
          style={{ fontStyle: 'italic', fontFamily: 'var(--serif)', fontSize: 14, color: 'var(--ink-mute)', textTransform: 'none', letterSpacing: '0.02em' }}>
          — {scene.hint}
        </div>
      )}
      <button className="sfa-q-advance ready" style={{ marginTop: 40, pointerEvents: 'none' }}>
        <span>Continue</span>
        <span className="sfa-arrow" />
      </button>
    </div>
  );
}

function TwistContent({ scene }) {
  const body = Array.isArray(scene.body) ? scene.body : [];
  return (
    <div style={{ maxWidth: 700, width: '100%', paddingTop: 20 }}>
      <div className="sfa-twist-body">
        {body.map((line, i) => (
          <p key={i} dangerouslySetInnerHTML={{ __html: line }} />
        ))}
      </div>
      {scene.quote && (
        <div className="sfa-narrative-quote" style={{ marginTop: 48 }}>
          <span dangerouslySetInnerHTML={{ __html: scene.quote }} />
          {scene.speaker && <span className="sfa-speaker">{scene.speaker}</span>}
        </div>
      )}
    </div>
  );
}

function IntakeContent({ scene }) {
  return (
    <div className="sfa-intake-block" style={{ paddingTop: 24 }}>
      {scene.eyebrow && <div className="sfa-eyebrow" style={{ marginBottom: 20 }}>{scene.eyebrow}</div>}
      <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px,4vw,52px)', fontWeight: 300, color: 'var(--ink)', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
        {scene.title}
      </h2>
      {scene.sub && <p className="sfa-body-text" style={{ marginBottom: 32 }}>{scene.sub}</p>}
      <div className="sfa-intake-grid">
        {['First name', 'Last name'].map(label => (
          <div key={label} className="sfa-intake-field">
            <div className="sfa-intake-label">{label}</div>
            <input className="sfa-intake-input" disabled style={{ pointerEvents: 'none' }} placeholder={label} />
          </div>
        ))}
        <div className="sfa-intake-field sfa-full">
          <div className="sfa-intake-label">Email</div>
          <input className="sfa-intake-input" disabled style={{ pointerEvents: 'none' }} placeholder="Your email" />
        </div>
      </div>
    </div>
  );
}

function CrawlContent({ scene }) {
  const paragraphs = scene.paragraphs || [];
  return (
    <div style={{ maxWidth: 640, width: '100%', paddingTop: 20 }}>
      <div className="sfa-eyebrow" style={{ marginBottom: 24 }}>{scene.locationLabel}</div>
      {scene.preamble && (
        <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 'clamp(18px,2vw,26px)', color: 'var(--ink)', marginBottom: 32, lineHeight: 1.4 }}>
          {scene.preamble}
        </p>
      )}
      {scene.title && (
        <h2 style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: 'clamp(22px,3vw,40px)', color: 'var(--brand-orange, #ff481d)', letterSpacing: '0.05em', marginBottom: 32, lineHeight: 1 }}>
          {(Array.isArray(scene.title) ? scene.title : [scene.title]).join(' ')}
        </h2>
      )}
      {paragraphs.map((p, i) => (
        <p key={i} className="sfa-body-text" style={{ marginBottom: 18 }}>{p}</p>
      ))}
    </div>
  );
}

function ResultsLaunchContent({ scene }) {
  return (
    <div className="sfa-scene-inner sfa-layout-centered" style={{ paddingTop: 40 }}>
      <div className="sfa-eyebrow" style={{ marginBottom: 24 }}>Your result is ready</div>
      <h2 className="sfa-display" style={{ fontSize: 'clamp(28px,4vw,60px)' }}>
        The assessment is complete.
      </h2>
      <div style={{ marginTop: 48 }}>
        <div className="sfa-landing-cta">
          <span>View your result</span>
          <span className="sfa-arrow" />
        </div>
      </div>
    </div>
  );
}

function GenericContent({ scene }) {
  const title = Array.isArray(scene.title) ? scene.title.join(' ') : (scene.title || '');
  return (
    <div style={{ maxWidth: 640, width: '100%', paddingTop: 20 }}>
      <div className="sfa-eyebrow" style={{ marginBottom: 20 }}>{scene.eyebrow || scene.type}</div>
      {title && <h2 className="sfa-display" style={{ fontSize: 'clamp(24px,3.5vw,52px)' }} dangerouslySetInnerHTML={{ __html: title }} />}
    </div>
  );
}