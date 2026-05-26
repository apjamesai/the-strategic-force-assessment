import React, { useState } from 'react';
import { getDiscArt, getChoreoSVG } from '@/lib/sfa/discArt';

function Choreo({ id }) {
  return <div dangerouslySetInnerHTML={{ __html: getChoreoSVG(id) }} />;
}

export default function MidpointScene({ scene, onSubmit }) {
  const [textVal, setTextVal] = useState('');
  const discHtml = getDiscArt('twinSuns');

  return (
    <div className="sfa-scene-inner"
      style={{ display: 'grid', gap: 'clamp(40px,6vw,100px)', alignItems: 'center', gridTemplateColumns: 'minmax(280px,1fr) 1.3fr' }}>
      <Choreo id="sun-arcs" />
      <div className="sfa-disc" dangerouslySetInnerHTML={{ __html: discHtml }} />
      <div className="sfa-reflect-card">
        <div className="sfa-eyebrow sfa-reveal-word">{scene.eyebrow}</div>
        {scene.showIntro && (
          <div className="sfa-body-text sfa-reveal-word"
            style={{ margin: '32px 0 48px', transitionDelay: '600ms', fontSize: 'clamp(17px,1.4vw,22px)' }}
            dangerouslySetInnerHTML={{ __html: scene.intro }} />
        )}
        {!scene.showIntro && <div style={{ height: 24 }}></div>}
        <div className="sfa-reflect-prompt sfa-reveal-word"
          style={{ transitionDelay: `${scene.showIntro ? 1400 : 600}ms`, marginBottom: 24 }}
          dangerouslySetInnerHTML={{ __html: scene.prompt }} />
        <textarea className="sfa-q-textarea" placeholder={scene.placeholder}
          value={textVal} onChange={e => setTextVal(e.target.value)} />
        <div className="sfa-q-text-meta"
          style={{ fontStyle: 'italic', fontFamily: 'var(--serif)', fontSize: 14, color: 'var(--ink-mute)', textTransform: 'none', letterSpacing: '0.02em' }}>
          — {scene.hint}
        </div>
        <button className="sfa-q-advance ready" style={{ marginTop: 40 }}
          onClick={() => onSubmit(scene.key, textVal, scene.isLast)}>
          <span>{scene.isLast ? 'Continue the assessment' : 'Continue'}</span>
          <span className="arrow"></span>
        </button>
      </div>
    </div>
  );
}