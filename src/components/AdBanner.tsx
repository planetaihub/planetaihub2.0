import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

interface AdBannerProps {
  slotId?: string;
  variant?: 'dark' | 'light';
}

const PUBLISHER_ID = 'ca-pub-6655685917040449';
const DEFAULT_SLOT_ID = '1985937373';

/**
 * Self-collapsing manual Google AdSense unit (auto-ads disabled).
 * Collapses cleanly to 0px height with zero dashed borders or text labels when unfilled,
 * and reveals seamlessly once AdSense renders a live creative.
 */
export const AdBanner: React.FC<AdBannerProps> = ({
  slotId = DEFAULT_SLOT_ID,
}) => {
  const insRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);
  const [isFilled, setIsFilled] = useState(false);

  useEffect(() => {
    const insEl = insRef.current;
    if (!insEl) return;

    const evaluateAdFill = () => {
      const status = insEl.getAttribute('data-ad-status');
      if (status === 'unfilled') {
        setIsFilled(false);
        return;
      }
      if (status === 'filled') {
        setIsFilled(true);
        return;
      }
      const iframe = insEl.querySelector('iframe');
      if (iframe && iframe.getBoundingClientRect().height > 10) {
        setIsFilled(true);
      }
    };

    const observer = new MutationObserver(() => {
      evaluateAdFill();
    });

    observer.observe(insEl, {
      attributes: true,
      attributeFilter: ['data-ad-status', 'style'],
      childList: true,
      subtree: true,
    });

    if (!pushedRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushedRef.current = true;
      } catch {
        // Safely ignore in local dev, offline mode, or ad-blocked browsers
      }
    }

    evaluateAdFill();

    return () => {
      observer.disconnect();
    };
  }, [slotId]);

  return (
    <aside
      aria-label="Advertisement"
      aria-hidden={!isFilled}
      className={
        isFilled
          ? 'my-6 w-full overflow-hidden rounded-xl border border-slate-200 bg-white text-center'
          : 'm-0 h-0 w-full overflow-hidden border-0 p-0'
      }
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          background: 'transparent',
          width: '100%',
        }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slotId}
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
    </aside>
  );
};
