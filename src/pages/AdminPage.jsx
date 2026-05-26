import React, { useState } from 'react';
import { ARCHETYPES, SECONDARY_PATTERNS, MOCK_PROFILES, computeResults, pickArchetype, pickSecondaryPattern } from '@/lib/sfa/engine';
import { SKIN_LIST, getActiveSkinId, setActiveSkinId } from '@/lib/sfa/skins/index';

const ADMIN_SECONDARY_BASE_DEFAULT = 'hidden_drifter';

export default function AdminPage() {
  const [tab, setTab] = useState('archetypes');
  const [secondaryBase, setSecondaryBase] = useState(ADMIN_SECONDARY_BASE_DEFAULT);
  const [previewData, setPreviewData] = useState(null);
  const tabs = ['archetypes', 'skins', 'results'];

  const handlePreview = (primary, secondary) => {
    const mockR = secondary
      ? (() => {
          const base = JSON.parse(JSON.stringify(MOCK_PROFILES[primary] || MOCK_PROFILES.hidden_drifter));
          const tune = {
            architect_of_order:     () => { base.risks.control_bias = 78; },
            the_justifier:          () => { base.risks.moral_drift = 70; },
            the_calm_blade:         () => { base.risks.detachment_pressure = 72; },
            the_consensus_seeker:   () => { base.practices.collaborate_inclusively = 86; base.practices.act_decisively = 48; },
            the_decisive_commander: () => { base.practices.act_decisively = 86; base.practices.listen_deeply = 48; },
            vision_under_strain:    () => { base.practices.future_focused = 86; base.practices.master_emotions = 48; }
          };
          if (tune[secondary]) tune[secondary]();
          return base;
        })()
      : MOCK_PROFILES[primary];
    setPreviewData({ archKey: primary, secondaryKey: secondary, R: mockR });
    alert(`Preview set: ${primary}${secondary ? ' + ' + secondary : ''}. Navigate to "/" to see the result.`);
  };

  return (
    <div className="sfa-root" style={{ position: 'fixed', inset: 0, overflow: 'auto', cursor: 'auto' }}>
      <div className="sfa-admin-panel open" style={{ position: 'relative', height: '100vh' }}>
        <div className="sfa-admin-topbar">
          <div className="sfa-admin-brand">
            <span className="dot"></span>
            <span>Admin · </span>
            <span className="label">The Strategic Force Assessment</span>
          </div>
          <div className="sfa-admin-tabs">
            {tabs.map(t => (
              <button key={t} className={`sfa-admin-tab${tab === t ? ' active' : ''}`}
                onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
            ))}
          </div>
          <a href="/" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', color: 'var(--ink-mute)', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', textDecoration: 'none' }}>
            ← Back to Assessment
          </a>
        </div>
        <div className="sfa-admin-body">
          {tab === 'archetypes' && (
            <div>
              <div className="sfa-admin-section-title">Switch between archetypes</div>
              <div className="sfa-admin-section-sub">Five score-band archetypes plus six secondary pattern overlays.</div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 12 }}>Primary · band-based</div>
              <div className="sfa-admin-arch-grid">
                {Object.entries(ARCHETYPES).map(([key, a]) => (
                  <div key={key} className="sfa-admin-arch-card" onClick={() => handlePreview(key, null)}>
                    <div className="tag">{a.band}</div>
                    <div className="name">{a.name}</div>
                    <div className="head">{a.headline}</div>
                    <div className="cta">Preview result →</div>
                  </div>
                ))}
              </div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--amber)', margin: '36px 0 12px' }}>Combine secondary with primary base</div>
              <div className="sfa-admin-base-pills">
                {Object.entries(ARCHETYPES).map(([key, a]) => (
                  <button key={key} className={`sfa-admin-base-pill${secondaryBase === key ? ' active' : ''}`}
                    onClick={() => setSecondaryBase(key)}>{a.name}</button>
                ))}
              </div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--amber)', margin: '24px 0 12px' }}>Secondary · pattern overlays</div>
              <div className="sfa-admin-arch-grid">
                {Object.entries(SECONDARY_PATTERNS).map(([key, p]) => (
                  <div key={key} className="sfa-admin-arch-card" onClick={() => handlePreview(secondaryBase, key)}>
                    <div className="tag">Secondary pattern · overlay</div>
                    <div className="name">{p.name}</div>
                    <div className="head">{p.headline}</div>
                    <div className="cta">Preview on chosen primary →</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === 'skins' && (
            <div>
              <div className="sfa-admin-section-title">Story skins</div>
              <div className="sfa-admin-section-sub">Skins wrap the same 12-practice assessment in different narrative universes.</div>
              <div className="sfa-admin-arch-grid">
                {SKIN_LIST.map(skin => {
                  const isActive = skin.id === getActiveSkinId();
                  return (
                    <div key={skin.id} className="sfa-admin-arch-card"
                      style={isActive ? { cursor: 'default', borderLeft: '2px solid var(--amber)' } : {}}>
                      {isActive && <div className="tag">ACTIVE</div>}
                      <div className="name">{skin.name}</div>
                      <div className="head">{skin.tagline}</div>
                      {!isActive && (
                        <button className="sfa-admin-btn" style={{ marginTop: 8 }}
                          onClick={() => { setActiveSkinId(skin.id); window.location.reload(); }}>
                          Use this skin
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 24 }}>
                <a href="/admin/image-studio"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '12px 20px', border: '1px solid rgba(255,90,44,0.4)', color: 'var(--ink)', fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', textDecoration: 'none' }}>
                  Open Image Studio →
                </a>
              </div>
            </div>
          )}
          {tab === 'results' && (
            <div>
              <div className="sfa-admin-section-title">Results history</div>
              <div className="sfa-admin-section-sub">Session results are saved locally in your browser.</div>
              <div className="sfa-admin-empty" style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-mute)', fontStyle: 'italic', marginTop: 24 }}>No completed sessions in this browser yet.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}