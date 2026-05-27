import React, { useRef, useEffect } from 'react';

/**
 * SceneSlot — wraps one scene's DOM with CSS cross-fade behaviour.
 * Uses inline styles instead of class manipulation to avoid React 18
 * Strict Mode double-effect issues.
 */
export default function SceneSlot({ children, active, outgoing, isCrawl, isWhooshing }) {
  const ref = useRef(null);

  // Active scenes always get .active immediately — both for visibility
  // and so that child .sfa-reveal-word transitions fire correctly.
  // Outgoing scenes start with .active and we remove it after one rAF.
  const cls = [
    'sfa-scene',
    (active || outgoing) ? 'active' : '',
    isCrawl ? 'crawl-scene' : '',
    isWhooshing ? 'whooshing' : ''
  ].filter(Boolean).join(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (outgoing) {
      // Fade out: remove .active next frame so CSS transition plays opacity 1 → 0.
      const r1 = requestAnimationFrame(() => {
        if (el) el.classList.remove('active');
      });
      return () => cancelAnimationFrame(r1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} className={cls}>
      {children}
    </div>
  );
}