import React, { useRef, useEffect } from 'react';

/**
 * SceneSlot — wraps a scene in the .sfa-scene container.
 * Active scenes are always fully visible via inline style.
 * Outgoing scenes fade out via CSS transition after rAF removal of .active.
 */
export default function SceneSlot({ children, active, outgoing, isCrawl, isWhooshing }) {
  const ref = useRef(null);

  const cls = [
    'sfa-scene',
    outgoing ? 'active' : '',
    isCrawl ? 'crawl-scene' : '',
    isWhooshing ? 'whooshing' : '',
  ].filter(Boolean).join(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (outgoing) {
      const r = requestAnimationFrame(() => {
        if (el) el.classList.remove('active');
      });
      return () => cancelAnimationFrame(r);
    }
  }, [outgoing]);

  // Active scenes: override CSS opacity/visibility with inline styles so
  // they are ALWAYS visible regardless of class state or transition timing.
  const inlineStyle = active
    ? { opacity: 1, visibility: 'visible', transition: 'none' }
    : undefined;

  return (
    <div ref={ref} className={cls} style={inlineStyle}>
      {children}
    </div>
  );
}