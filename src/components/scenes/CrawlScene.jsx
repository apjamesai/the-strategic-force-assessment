import React from 'react';

export default function CrawlScene({ scene }) {
  const style = scene.crawlStyle || 'film';

  if (style === 'briefing') {
    return (
      <>
        <div className="sfa-brief-scanlines"></div>
        <div className="sfa-brief-preamble">{scene.preamble || ''}</div>
        <div className="sfa-brief-title">
          <div className="sfa-brief-meta">{scene.episode || 'Prologue'}</div>
          <h1 className="sfa-brief-title-main">{(scene.title || []).join(' ')}</h1>
        </div>
        <div className="sfa-brief-cards">
          {(scene.paragraphs || []).slice(0, 3).map((p, i) => (
            <div key={i} className="sfa-brief-card" style={{ animationDelay: `${10 + i * 8}s` }}>
              <div className="sfa-brief-card-num">{String(i + 1).padStart(2, '0')} / {Math.min(scene.paragraphs.length, 3).toString().padStart(2, '0')}</div>
              <div className="sfa-brief-card-body">{p}</div>
            </div>
          ))}
          <div className="sfa-brief-card brief-countdown" style={{ animationDelay: `${10 + Math.min((scene.paragraphs || []).length, 3) * 8}s` }}>
            <div className="sfa-brief-card-num">FINAL CHECK</div>
            <div className="sfa-brief-card-body" style={{ fontFamily: 'monospace', fontSize: 'clamp(20px,2.4vw,30px)', letterSpacing: '0.1em' }}>
              {scene.countdown || 'GO FOR PROLOGUE'}
            </div>
          </div>
        </div>
        <div className="sfa-brief-horizon"></div>
      </>
    );
  }

  if (style === 'scroll') {
    const verses = (scene.paragraphs || []).slice(0, 3);
    const defaultSeal = `<svg viewBox="0 0 200 200"><rect x="18" y="18" width="164" height="164" fill="#b53536" stroke="#7a1818" stroke-width="2"/></svg>`;
    return (
      <>
        <div className="sfa-scroll-paper"></div>
        <div className="sfa-scroll-preamble">{scene.preamble || ''}</div>
        <div className="sfa-scroll-frame">
          <div className="sfa-scroll-seal" dangerouslySetInnerHTML={{ __html: scene.markSvg || defaultSeal }} />
          <div className="sfa-scroll-title">{(scene.title || []).join(' ')}</div>
          <div className="sfa-scroll-meta">{scene.episode || ''}</div>
          <div className="sfa-scroll-divider"></div>
          <div className="sfa-scroll-verses">
            {verses.map((p, i) => (
              <div key={i} className="sfa-scroll-verse" style={{ animationDelay: `${10 + i * 8}s` }}>{p}</div>
            ))}
          </div>
          <div className="sfa-scroll-footer" style={{ animationDelay: `${10 + verses.length * 8}s` }}>{scene.countdown || ''}</div>
        </div>
        <div className="sfa-scroll-horizon"></div>
      </>
    );
  }

  if (style === 'broadsheet') {
    const paras = (scene.paragraphs || []).slice(0, 3);
    return (
      <>
        <div className="sfa-broad-paper"></div>
        <div className="sfa-broad-frame">
          <div className="sfa-broad-dateline">{scene.preamble || ''}</div>
          <div className="sfa-broad-mast">
            <div className="sfa-broad-rule"></div>
            <h1 className="sfa-broad-title">{(scene.title || []).join(' ')}</h1>
            <div className="sfa-broad-rule"></div>
            <div className="sfa-broad-byline">{scene.episode || ''}</div>
          </div>
          <div className="sfa-broad-columns">
            {paras.map((p, i) => (
              <div key={i} className="sfa-broad-column" style={{ animationDelay: `${5 + i * 8}s` }}>
                <div className="sfa-broad-column-no">No. {String(i + 1).padStart(2, '0')}</div>
                <div className="sfa-broad-leader">{p}</div>
              </div>
            ))}
          </div>
          <div className="sfa-broad-stamp" style={{ animationDelay: `${5 + paras.length * 8}s` }}>{scene.countdown || ''}</div>
        </div>
        <div className="sfa-broad-horizon"></div>
      </>
    );
  }

  // Default: film (Star Wars)
  return (
    <>
      <div className="sfa-crawl-stars"></div>
      <div className="sfa-crawl-preamble">{scene.preamble}</div>
      <div className="sfa-crawl-title-wrap">
        <div className="sfa-crawl-title-episode">{scene.episode}</div>
        <div className="sfa-crawl-title-main">
          {(scene.title || []).map((w, i) => <span key={i}>{w}</span>)}
        </div>
      </div>
      <div className="sfa-crawl-viewport">
        <div className="sfa-crawl-text">
          {(scene.paragraphs || []).map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>
      <div className="sfa-crawl-fade"></div>
      <div className="sfa-crawl-horizon"></div>
    </>
  );
}