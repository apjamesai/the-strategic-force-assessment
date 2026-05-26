import React, { useState } from 'react';
import { wordReveal } from '@/lib/wordReveal';
import { getChoreoSVG } from '@/lib/sfa/discArt';

function Choreo({ id }) {
  return <div dangerouslySetInnerHTML={{ __html: getChoreoSVG(id) }} />;
}

export default function EndReflectionScene({ scene, onSubmit }) {
  const [textVal, setTextVal] = useState('');
  return (
    <div className="sfa-scene-inner sfa-layout-centered">
      <div className="sfa-question-block">
        <Choreo id="grid" />
        <div className="sfa-q-meta">
          <span className="practice sfa-reveal-word">{scene.eyebrow}</span>
          <span className="sfa-reveal-word">{scene.locationLabel}</span>
        </div>
        {scene.intro && (
          <div className="sfa-body-text sfa-reveal-word"
            style={{ marginBottom: 24, color: 'var(--ink-mute)', fontStyle: 'italic', fontFamily: 'var(--serif)', fontSize: 17 }}>
            {scene.intro}
          </div>
        )}
        <div className="sfa-q-prompt" dangerouslySetInnerHTML={{ __html: wordReveal(scene.prompt, 200) }} />
        <textarea className="sfa-q-textarea" placeholder={scene.placeholder || ''}
          value={textVal} onChange={e => setTextVal(e.target.value)} />
        <div className="sfa-q-text-meta">Optional ,  saved with your result so you can return to it.</div>
        <button className="sfa-q-advance ready" onClick={() => onSubmit(scene.key, textVal)}>
          <span>Continue</span>
          <span className="arrow"></span>
        </button>
      </div>
    </div>
  );
}