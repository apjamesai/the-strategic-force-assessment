import React, { useRef, useEffect } from 'react';

// Double rAF — first frame paints opacity 0, second applies .active for the transition.
// Without this, React batches the className add into the same frame as mount,
// and the browser sees the element only ever in .active state, skipping the transition.
export default function SceneSlot({ children, active, isCrawl, isWhooshing }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    const r1 = requestAnimationFrame(() => {
      const r2 = requestAnimationFrame(() => {
        if (el) el.classList.add('active');
      });
      el._raf2 = r2;
    });
    el._raf1 = r1;
    return () => {
      cancelAnimationFrame(el?._raf1);
      cancelAnimationFrame(el?._raf2);
    };
  }, [active]);

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