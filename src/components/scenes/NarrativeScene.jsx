import React from 'react';
import { wordReveal } from '@/lib/wordReveal';
import { getDiscArt, getChoreoSVG } from '@/lib/sfa/discArt';

function Choreo({ id }) {
  return <div dangerouslySetInnerHTML={{ __html: getChoreoSVG(id) }} />;
}

function DiscArtEl({ artId }) {
  return <div className="sfa-disc" dangerouslySetInnerHTML={{ __html: getDiscArt(artId) }} />;
}

export default function NarrativeScene({ scene }) {
  const textBlock = (
    <div>
      {scene.eyebrow && <div className="sfa-eyebrow sfa-reveal-word">{scene.eyebrow}</div>}
      <h2 className="sfa-display"
        style={{ margin: '36px 0 32px', fontSize: 'clamp(32px,5.2vw,76px)' }}
        dangerouslySetInnerHTML={{ __html: wordReveal(scene.body.join(' '), 200) }}
      />
      {(scene.bodyAfter || []).length > 0 && (
        <div className="sfa-body-text"
          style={{ maxWidth: 620, margin: 0, fontSize: 'clamp(15px,1.4vw,20px)', lineHeight: 1.6 }}>
          {scene.bodyAfter.map((line, i) => (
            <p key={i} style={{ marginBottom: 14 }}
              dangerouslySetInnerHTML={{ __html: wordReveal(line, 1500 + i * 1200) }}
            />
          ))}
        </div>
      )}
    </div>
  );

  if (scene.artId) {
    const layout = scene.layout || 'disc-left';
    const disc = <DiscArtEl key={scene.artId} artId={scene.artId} />;
    return (
      <div className="sfa-scene-inner"
        style={{ display: 'grid', gap: 'clamp(40px,6vw,100px)', alignItems: 'start', gridTemplateColumns: 'minmax(280px,1fr) 1.3fr', overflowY: 'auto' }}>
        <Choreo id="sun-arcs" />
        {layout === 'disc-left' ? <>{disc}<div style={{ paddingBottom: 80 }}>{textBlock}</div></> : <><div style={{ paddingBottom: 80 }}>{textBlock}</div>{disc}</>}
      </div>
    );
  }

  return (
    <div className="sfa-scene-inner sfa-layout-centered">
      <Choreo id="sun-arcs" />
      {textBlock}
    </div>
  );
}