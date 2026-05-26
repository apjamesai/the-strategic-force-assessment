import React from 'react';
import { wordReveal } from '@/lib/wordReveal';
import { getDiscArt, getChoreoSVG } from '@/lib/sfa/discArt';
import { useChoreoOverrides, useDiscOverrides } from '@/lib/sfa/SkinContext';

function Choreo({ id }) {
  const overrides = useChoreoOverrides();
  return <div dangerouslySetInnerHTML={{ __html: getChoreoSVG(id, overrides) }} />;
}

function DiscArtEl({ artId }) {
  const overrides = useDiscOverrides();
  return <div className="sfa-disc" dangerouslySetInnerHTML={{ __html: getDiscArt(artId, overrides) }} />;
}

export default function NarrativeQuoteScene({ scene }) {
  const layout = scene.layout || 'disc-right';
  const disc = <DiscArtEl key={scene.artId} artId={scene.artId} />;
  const text = (
    <div>
      <div className="sfa-narrative-quote"
        dangerouslySetInnerHTML={{
          __html: wordReveal(scene.quote, 400) +
            `<span class="speaker sfa-reveal-word" style="transition-delay:1800ms">${scene.speaker}</span>`
        }}
      />
    </div>
  );
  return (
    <div className="sfa-scene-inner"
      style={{ display: 'grid', gap: 'clamp(40px,6vw,100px)', alignItems: 'center', gridTemplateColumns: 'minmax(280px,1fr) 1.3fr' }}>
      <Choreo id="converging" />
      {layout === 'disc-left' ? <>{disc}{text}</> : <>{text}{disc}</>}
    </div>
  );
}