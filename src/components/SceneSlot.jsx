import React, { useRef, useEffect } from 'react';

/**
 * SceneSlot — wraps one scene's DOM with the 1.4 s cross-fade behaviour.
 *
 * INCOMING (active=true, outgoing=false): renders with NO ".active" class
 * (CSS leaves it at opacity:0). After two requestAnimationFrame ticks, we
 * add ".active" — CSS fades opacity 0 → 1 over 1.6 s. The double-rAF is
 * essential: it lets the browser paint the opacity:0 state first, so the
 * transition has a "from" to animate FROM.
 *
 * OUTGOING (outgoing=true): renders WITH ".active" baked into the className
 * from the very first paint, so the first frame shows it at opacity:1.
 * After one rAF tick, we remove ".active" — CSS fades opacity 1 → 0 over
 * 1.4 s. The "visibility 0s linear 1.4s" transition delays visibility:hidden
 * until after the opacity fade completes, so the element stays in the
 * visual stack for the full fade.
 *
 * This mirrors the reference HTML's imperative DOM behaviour in renderCurrent.
 */
export default function SceneSlot({ children, active, outgoing, isCrawl, isWhooshing }) {
  const ref = useRef(null);

  // Bake .active into the className ONLY when outgoing. That way the first
  // paint of the outgoing slot is already at opacity:1, and removing the
  // class in useEffect triggers the CSS fade-out.
  const cls = [
    'sfa-scene',
    outgoing ? 'active' : '',
    isCrawl ? 'sfa-crawl-scene' : '',
    isWhooshing ? 'whooshing' : ''
  ].filter(Boolean).join(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (outgoing) {
      // First paint: opacity 1 (.active already in className).
      // Next frame: remove .active → CSS transition fades opacity 1 → 0.
      const r1 = requestAnimationFrame(() => {
        if (el) el.classList.remove('active');
      });
      el._raf1 = r1;
    } else if (active) {
      // First paint: opacity 0 (no .active in className).
      // Double rAF: first frame paints opacity:0, second adds .active to
      // trigger CSS fade-in over 1.6 s.
      const r1 = requestAnimationFrame(() => {
        const r2 = requestAnimationFrame(() => {
          if (el) el.classList.add('active');
        });
        el._raf2 = r2;
      });
      el._raf1 = r1;
    }

    return () => {
      const node = ref.current;
      if (node) {
        if (node._raf1) cancelAnimationFrame(node._raf1);
        if (node._raf2) cancelAnimationFrame(node._raf2);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} className={cls}>
      {children}
    </div>
  );
}
