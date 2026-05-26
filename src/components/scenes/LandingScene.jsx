import React from 'react';
import { getChoreoSVG } from '@/lib/sfa/discArt';

function Choreo({ id }) {
  return <div dangerouslySetInnerHTML={{ __html: getChoreoSVG(id) }} />;
}

/**
 * LandingScene — matches the reference (renderLanding in strategic-force-assessment.html).
 *
 * Important detail on word wrapping: each title word is wrapped in a
 * `.sfa-reveal-word` span which is `display: inline-block`. If the spans
 * are adjacent siblings with NO whitespace between them, the browser can't
 * break the line between them and each huge word ends up on its own row.
 * The reference avoids this by joining the words with literal space
 * characters in the HTML source. We replicate that by rendering the entire
 * title as a single dangerouslySetInnerHTML — exactly the way the reference
 * does.
 */
export default function LandingScene({ scene, onNext }) {
  const titleHTML = scene.title.map((w, i) =>
    `<span class="sfa-reveal-word" style="transition-delay:${i * 120 + 400}ms">${w}</span>`
  ).join(' ');

  return (
    <div className="sfa-scene-inner sfa-layout-centered">
      <div>
        <Choreo id="sun-arcs" />
        <div className="sfa-eyebrow sfa-reveal-word">{scene.locationLabel}</div>
        <h1
          className="sfa-landing-title"
          style={{ marginTop: 36 }}
          dangerouslySetInnerHTML={{ __html: titleHTML }}
        />
        <div className="sfa-landing-sub sfa-reveal-word" style={{ transitionDelay: '1400ms' }}>
          {scene.sub}
        </div>
        <div className="sfa-framing-note sfa-reveal-word"
          style={{ transitionDelay: '1800ms', marginTop: 48 }}
          dangerouslySetInnerHTML={{ __html: scene.note }}
        />
        <button className="sfa-landing-cta"
          onClick={onNext}>
          <span>{scene.cta}</span>
          <span className="arrow"></span>
        </button>
      </div>
      <div className="sfa-landing-meta">est. 20 minutes · 36 questions · 4 closing reflections</div>
    </div>
  );
}