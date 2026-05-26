import React from 'react';
import { wordReveal } from '@/lib/wordReveal';
import { getChoreoSVG } from '@/lib/sfa/discArt';
import { useChoreoOverrides, useDiscOverrides } from '@/lib/sfa/SkinContext';

function Choreo({ id }) {
  const overrides = useChoreoOverrides();
  return <div dangerouslySetInnerHTML={{ __html: getChoreoSVG(id, overrides) }} />;
}

export default function ResultsLaunchScene({ onShowResults }) {
  return (
    <div className="sfa-scene-inner sfa-layout-centered">
      <div>
        <Choreo id="web" />
        <div className="sfa-eyebrow sfa-reveal-word">YOUR RESULT IS READY</div>
        <h1 className="sfa-display"
          style={{ fontSize: 'clamp(40px,5vw,72px)', margin: '32px 0', fontStyle: 'italic', color: 'var(--ink)' }}
          dangerouslySetInnerHTML={{ __html: wordReveal('The pattern, revealed.', 400) }}
        />
        <button className="sfa-landing-cta sfa-reveal-word"
          style={{ transitionDelay: '1400ms', marginTop: 24 }}
          onClick={onShowResults}>
          <span>Read your profile</span>
          <span className="arrow"></span>
        </button>
      </div>
    </div>
  );
}