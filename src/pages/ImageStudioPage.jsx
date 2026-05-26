import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';

const DISC_PROMPTS = [
  { id: 'councilChamber', label: 'Council Chamber', prompt: 'Cinematic dark interior of a futuristic council chamber, silhouetted figures, warm amber atmospheric lighting, space opera aesthetic, deep blacks' },
  { id: 'fracturedCity', label: 'Fractured City', prompt: 'Dystopian cityscape at night, fractured skyline, warm amber glow from windows, deep shadows, cinematic wide shot, space opera aesthetic' },
  { id: 'confrontation', label: 'Confrontation', prompt: 'Two silhouetted figures facing each other in dramatic standoff, amber backlight, cinematic dark atmosphere, deep shadow contrast' },
  { id: 'shadowPattern', label: 'Shadow Pattern', prompt: 'Single figure casting multiple overlapping shadows, amber light source, mysterious atmospheric, cinematic abstract composition' },
  { id: 'twinSuns', label: 'Twin Suns', prompt: 'Desert horizon with two suns setting, warm amber and orange tones, wide cinematic shot, silhouetted landscape, epic scale' },
];

export default function ImageStudioPage() {
  const [generating, setGenerating] = useState({});
  const [results, setResults] = useState({});
  const [customPrompt, setCustomPrompt] = useState('');
  const [customId, setCustomId] = useState('');

  const generate = async (id, prompt) => {
    setGenerating(prev => ({ ...prev, [id]: true }));
    const { url } = await base44.integrations.Core.GenerateImage({ prompt });
    setResults(prev => ({ ...prev, [id]: url }));
    setGenerating(prev => ({ ...prev, [id]: false }));
  };

  return (
    <div className="sfa-root" style={{ position: 'fixed', inset: 0, overflow: 'auto', cursor: 'auto' }}>
      <div style={{ minHeight: '100vh', padding: '6vh 6vw', fontFamily: 'var(--sans)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: '6vh', borderBottom: '1px solid rgba(255,90,44,0.2)', paddingBottom: 24 }}>
          <a href="/admin" style={{ color: 'var(--ink-mute)', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', textDecoration: 'none' }}>← Admin</a>
          <div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 6 }}>IMAGE STUDIO</div>
            <h1 style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(28px,3vw,48px)', color: 'var(--ink)', margin: 0 }}>Generate Disc Art</h1>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: '6vh' }}>
          {DISC_PROMPTS.map(({ id, label, prompt }) => (
            <div key={id} style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--amber)' }}>{label}</div>
              {results[id] ? (
                <div>
                  <img src={results[id]} alt={label} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '50%', marginBottom: 12 }} />
                  <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--ink-mute)', wordBreak: 'break-all', marginBottom: 12 }}>{results[id]}</div>
                </div>
              ) : (
                <div style={{ width: '100%', aspectRatio: '1', background: 'rgba(255,90,44,0.04)', border: '1px solid rgba(255,90,44,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-dim)', fontSize: 13, fontStyle: 'italic', fontFamily: 'var(--serif)' }}>
                  {generating[id] ? 'Generating...' : 'Not generated'}
                </div>
              )}
              <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-mute)', lineHeight: 1.5 }}>{prompt}</div>
              <button
                onClick={() => generate(id, prompt)}
                disabled={generating[id]}
                style={{ padding: '12px 20px', border: '1px solid rgba(255,90,44,0.4)', background: 'rgba(255,90,44,0.06)', color: 'var(--ink)', fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', cursor: generating[id] ? 'wait' : 'pointer', opacity: generating[id] ? 0.5 : 1 }}>
                {generating[id] ? 'Generating...' : 'Generate →'}
              </button>
            </div>
          ))}
        </div>

        <div style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)', padding: 32 }}>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 20 }}>CUSTOM GENERATION</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 8 }}>Art ID</label>
              <input value={customId} onChange={e => setCustomId(e.target.value)}
                placeholder="e.g. myCustomArt"
                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,90,44,0.3)', color: 'var(--ink)', fontFamily: 'var(--serif)', fontSize: 18, padding: '8px 0', outline: 'none' }} />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 8 }}>Prompt</label>
            <textarea value={customPrompt} onChange={e => setCustomPrompt(e.target.value)}
              placeholder="Describe the image in detail..."
              style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,90,44,0.3)', color: 'var(--ink)', fontFamily: 'var(--serif)', fontSize: 16, padding: '8px 0', outline: 'none', minHeight: 80, resize: 'vertical' }} />
          </div>
          <button
            onClick={() => customId && customPrompt && generate(customId, customPrompt)}
            disabled={!customId || !customPrompt || generating[customId]}
            style={{ padding: '14px 28px', border: '1px solid rgba(255,90,44,0.4)', background: 'rgba(255,90,44,0.08)', color: 'var(--ink)', fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', cursor: 'pointer', opacity: (!customId || !customPrompt) ? 0.4 : 1 }}>
            {generating[customId] ? 'Generating...' : 'Generate Custom →'}
          </button>
          {results[customId] && (
            <div style={{ marginTop: 24 }}>
              <img src={results[customId]} alt="custom" style={{ maxWidth: 300, borderRadius: '50%' }} />
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--ink-mute)', wordBreak: 'break-all', marginTop: 12 }}>{results[customId]}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}