import React, { useRef, useEffect } from 'react';

// For INCOMING scenes: mount without .active, double-rAF adds it → CSS fade-in.
// For OUTGOING scenes: mount WITH .active already, then remove it → CSS fade-out.
export default function SceneSlot({ children, active, outgoing, isCrawl, isWhooshing }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (outgoing) {
      // Start as visible, then schedule removal to trigger fade-out
      el.classList.add('active');
      const r1 = requestAnimationFrame(() => {
        const r2 = requestAnimationFrame(() => {
          if (el) el.classList.remove('active');
        });
        el._raf2 = r2;
      });
      el._raf1 = r1;
    } else if (active) {
      // Double rAF: first frame paints opacity:0, second adds .active to trigger fade-in
      const r1 = requestAnimationFrame(() => {
        const r2 = requestAnimationFrame(() => {
          if (el) el.classList.add('active');
        });
        el._raf2 = r2;
      });
      el._raf1 = r1;
    }

    return () => {
      cancelAnimationFrame(el?._raf1);
      cancelAnimationFrame(el?._raf2);
    };
  }, []); // only on mount

  const cls = [
    'sfa-scene',
    isCrawl ? 'sfa-crawl-scene' : '',
    isWhooshing ? 'whooshing' : ''
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={cls}>
      {children}
    </div>
  );
}