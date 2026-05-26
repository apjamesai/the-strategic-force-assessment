import React from 'react';
import { wordReveal } from '@/lib/wordReveal';
import { getChoreoSVG } from '@/lib/sfa/discArt';
import { useChoreoOverrides, useDiscOverrides } from '@/lib/sfa/SkinContext';

function Choreo({ id }) {
  const overrides = useChoreoOverrides();
  return <div dangerouslySetInnerHTML={{ __html: getChoreoSVG(id, overrides) }} />;
}

export default function TwistScene({ scene }) {
  return (
    <div className="sfa-scene-inner sfa-layout-centered">
      <div style={{ maxWidth: 780 }}>
        <Choreo id="ripple" />
        <div className="sfa-eyebrow sfa-reveal-word">{scene.locationLabel}</div>
        <div className="sfa-twist-body" style={{ margin: '48px 0' }}>
          {(scene.body || []).map((p, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: wordReveal(p, 400 + i * 600) }} />
          ))}
        </div>
        {scene.quote && (
          <div className="sfa-narrative-quote" style={{ marginTop: 48, maxWidth: 680 }}
            dangerouslySetInnerHTML={{
              __html: wordReveal(scene.quote, 3200) +
                `<span class="speaker sfa-reveal-word" style="transition-delay:4400ms">${scene.speaker}</span>`
            }}
          />
        )}
      </div>
    </div>
  );
}