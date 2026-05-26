import React from 'react';
import { getChoreoSVG } from '@/lib/sfa/discArt';

function Choreo({ id }) {
  return <div dangerouslySetInnerHTML={{ __html: getChoreoSVG(id) }} />;
}

export default function LandingScene({ scene, onNext }) {
  return (
    <div className="sfa-scene-inner sfa-layout-centered" style={{ maxWidth: 900 }}>
      <div style={{ textAlign: 'center', position: 'relative' }}>
        <Choreo id="sun-arcs" />
        <div className="sfa-eyebrow sfa-reveal-word">{scene.locationLabel}</div>
        <h1 className="sfa-landing-title" style={{ marginTop: 36 }}>
          {scene.title.map((w, i) => (
            <span key={i} className="sfa-reveal-word"
              style={{ transitionDelay: `${i * 120 + 400}ms` }}
              dangerouslySetInnerHTML={{ __html: w + ' ' }}
            />
          ))}
        </h1>
        <div className="sfa-landing-sub sfa-reveal-word" style={{ transitionDelay: '1400ms' }}>{scene.sub}</div>
        <div className="sfa-framing-note sfa-reveal-word"
          style={{ transitionDelay: '1800ms', marginTop: 48, textAlign: 'left', maxWidth: 540, margin: '48px auto 0' }}>
          {scene.note}
        </div>
        <button className="sfa-landing-cta sfa-reveal-word" style={{ transitionDelay: '2200ms' }} onClick={onNext}>
          <span>{scene.cta}</span>
          <span className="arrow"></span>
        </button>
      </div>
      <div className="sfa-landing-meta">est. 12 minutes · 36 questions · 4 closing reflections</div>
    </div>
  );
}