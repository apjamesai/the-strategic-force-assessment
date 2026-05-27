import React from 'react';
import { getChoreoSVG } from '@/lib/sfa/discArt';
import { useChoreoOverrides, useSkin } from '@/lib/sfa/SkinContext';
import { SKIN_LIST, setActiveSkinId } from '@/lib/sfa/skins/index';

function Choreo({ id }) {
  const overrides = useChoreoOverrides();
  return <div dangerouslySetInnerHTML={{ __html: getChoreoSVG(id, overrides) }} />;
}

/**
 * LandingScene — matches the reference (renderLanding in strategic-force-assessment.html).
 *
 * Skin pills no longer call window.location.reload() — that fails in the
 * Base44 sandboxed preview iframe. Instead they update localStorage and
 * dispatch the sfa:skin-change event that Assessment.jsx listens for, which
 * hot-swaps the active skin in-place. The active pill is derived from the
 * SkinContext so the highlight tracks state correctly.
 */
export default function LandingScene({ scene, onNext }) {
  const titleHTML = scene.title.map((w, i) =>
    `<span class="sfa-reveal-word" style="transition-delay:${i * 120 + 400}ms">${w}</span>`
  ).join(' ');

  const activeSkin = useSkin();
  const activeSkinId = activeSkin?.id || 'force_trial';

  const handlePickSkin = (id) => {
    if (id === activeSkinId) return;
    setActiveSkinId(id);
    // Hot-swap: Assessment.jsx listens for this and re-renders without reload.
    window.dispatchEvent(new Event('sfa:skin-change'));
  };

  return (
    <div className="sfa-scene-inner sfa-layout-centered">
      <div>
        <Choreo id="sun-arcs" />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
          {SKIN_LIST.map(skin => {
            const isActive = skin.id === activeSkinId;
            return (
              <button key={skin.id}
                onClick={() => handlePickSkin(skin.id)}
                style={{
                  fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.3em',
                  textTransform: 'uppercase', padding: '8px 14px', background: 'transparent',
                  border: isActive ? '1px solid var(--amber)' : '1px solid rgba(255,90,44,0.25)',
                  color: isActive ? 'var(--amber)' : 'var(--ink-mute)',
                  cursor: isActive ? 'default' : 'pointer', transition: 'all 0.4s ease'
                }}>
                {skin.name}
              </button>
            );
          })}
        </div>
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
