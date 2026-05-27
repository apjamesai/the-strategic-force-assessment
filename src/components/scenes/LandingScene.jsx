import React from 'react';
import { getChoreoSVG } from '@/lib/sfa/discArt';
import { useChoreoOverrides } from '@/lib/sfa/SkinContext';

function Choreo({ id }) {
  const overrides = useChoreoOverrides();
  return (
    <div style={{ pointerEvents: 'none', opacity: 0.4, marginTop: 48 }}
      dangerouslySetInnerHTML={{ __html: getChoreoSVG(id, overrides) }}
    />
  );
}

/**
 * LandingScene — shown after skin selection.
 * Skin pills removed (now on SkinSelectScene).
 * CTA is centred on its own line, below the note.
 * Choreo SVG is positioned below all text.
 */
export default function LandingScene({ scene, onNext }) {
  const titleHTML = scene.title.map((w, i) =>
    `<span class="sfa-reveal-word" style="transition-delay:${i * 120 + 400}ms">${w}</span>`
  ).join(' ');

  return (
    <div className="sfa-scene-inner sfa-layout-centered">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Eyebrow + title + sub */}
        <div className="sfa-eyebrow sfa-reveal-word">{scene.locationLabel}</div>
        <h1
          className="sfa-landing-title"
          style={{ marginTop: 36 }}
          dangerouslySetInnerHTML={{ __html: titleHTML }}
        />
        <div className="sfa-landing-sub sfa-reveal-word" style={{ transitionDelay: '1400ms' }}>
          {scene.sub}
        </div>

        {/* Framing note */}
        <div className="sfa-framing-note sfa-reveal-word"
          style={{ transitionDelay: '1800ms', marginTop: 48 }}
          dangerouslySetInnerHTML={{ __html: scene.note }}
        />

        {/* CTA — centred, own line */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
          <button className="sfa-landing-cta" onClick={onNext}>
            <span>{scene.cta}</span>
            <span className="sfa-arrow"></span>
          </button>
        </div>

        {/* Choreo below everything */}
        <Choreo id="sun-arcs" />
      </div>
      <div className="sfa-landing-meta">est. 20 minutes · 36 questions · 4 closing reflections</div>
    </div>
  );
}