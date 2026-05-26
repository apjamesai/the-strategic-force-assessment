import React, { useState, useEffect } from 'react';
import { wordReveal } from '@/lib/wordReveal';
import { getChoreoSVG } from '@/lib/sfa/discArt';
import { useChoreoOverrides, useDiscOverrides } from '@/lib/sfa/SkinContext';

function Choreo({ id }) {
  const overrides = useChoreoOverrides();
  return <div dangerouslySetInnerHTML={{ __html: getChoreoSVG(id, overrides) }} />;
}

export default function QuestionScene({ scene, savedAnswer, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [textVal, setTextVal] = useState('');

  useEffect(() => {
    if (savedAnswer !== undefined) {
      if (scene.kind === 'rating' || scene.kind === 'mc') setSelected(savedAnswer);
      if (scene.kind === 'ranking') setRanking(Array.isArray(savedAnswer) ? savedAnswer : []);
    }
  }, []);

  const handleRank = (idx) => {
    setRanking(prev => {
      const next = prev.includes(idx) ? prev.filter(x => x !== idx) : [...prev, idx];
      if (next.length === scene.items.length) {
        setTimeout(() => onAnswer(next.slice()), 320);
      }
      return next;
    });
  };

  const handleSelect = (i) => {
    setSelected(i);
    setTimeout(() => onAnswer(i), 320);
  };

  const handleSubmit = () => {
    if (scene.kind === 'short-text') onAnswer(null, textVal);
    else if (scene.kind === 'ranking' && ranking.length === scene.items.length) onAnswer(ranking.slice());
  };

  const rankLabels = ['1st', '2nd', '3rd', '4th'];
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  const isReady = (
    (scene.kind === 'ranking' && ranking.length === scene.items.length) ||
    (scene.kind === 'short-text' && textVal.trim().length >= 3)
  );
  const showAdvance = scene.kind === 'ranking' || scene.kind === 'short-text';

  return (
    <div className="sfa-scene-inner sfa-layout-centered">
      <div className="sfa-question-block">
        <Choreo id="grid" />
        <div className="sfa-q-meta">
          <span className="practice sfa-reveal-word">{scene.practice || ''}</span>
          <span className="sfa-reveal-word">{scene.locationLabel}</span>
        </div>
        {scene.setup && (
          <div className="sfa-body-text sfa-reveal-word"
            style={{ marginBottom: 24, color: 'var(--ink-mute)', fontStyle: 'italic', fontFamily: 'var(--serif)', fontSize: 17 }}>
            {scene.setup}
          </div>
        )}
        <div className="sfa-q-prompt" dangerouslySetInnerHTML={{ __html: wordReveal(scene.prompt, 200) }} />

        {scene.kind === 'rating' && (
          <div className="sfa-q-scale">
            {(scene.labels || []).map((label, i) => (
              <div key={i} className={`sfa-q-scale-item${selected === i ? ' selected' : ''}`} onClick={() => handleSelect(i)}>
                <div className="sfa-q-scale-num">{i + 1}</div>
                <div className="sfa-q-scale-label">{label}</div>
              </div>
            ))}
          </div>
        )}

        {scene.kind === 'mc' && (
          <div className="sfa-q-options">
            {(scene.options || []).map((opt, i) => (
              <div key={i} className={`sfa-q-option${selected === i ? ' selected' : ''}`} onClick={() => handleSelect(i)}>
                <div className="letter">{letters[i]}</div>
                <div className="copy">{opt.copy}</div>
              </div>
            ))}
          </div>
        )}

        {scene.kind === 'ranking' && (
          <>
            <div className="sfa-q-ranking-hint">Click items in the order you would prioritise ,  first to last.</div>
            <div className="sfa-q-ranking">
              {(scene.items || []).map((item, i) => {
                const rankPos = ranking.indexOf(i);
                const isAssigned = rankPos !== -1;
                return (
                  <div key={i} className={`sfa-q-ranking-item${isAssigned ? ' assigned' : ''}`} onClick={() => handleRank(i)}>
                    <div className={`sfa-q-ranking-rank${!isAssigned ? ' empty' : ''}`}>
                      {isAssigned ? (rankLabels[rankPos] || rankPos + 1) : ', '}
                    </div>
                    <div className="sfa-q-ranking-copy">{item.label}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {scene.kind === 'short-text' && (
          <>
            <textarea className="sfa-q-textarea" placeholder={scene.placeholder || ''}
              value={textVal} onChange={e => setTextVal(e.target.value)} />
            <div className="sfa-q-text-meta">{scene.hint}</div>
          </>
        )}

        {showAdvance && (
          <button className={`sfa-q-advance${isReady ? ' ready' : ''}`} onClick={handleSubmit}>
            <span>Continue</span>
            <span className="arrow"></span>
          </button>
        )}
      </div>
    </div>
  );
}