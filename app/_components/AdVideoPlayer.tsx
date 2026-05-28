"use client";

import { useEffect, useRef, useState } from "react";
import { ads } from "@/lib/ads";

export function AdVideoPlayer() {
  const [index, setIndex] = useState(0);
  const [errored, setErrored] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const hasAds = ads.length > 0;
  const current = hasAds ? ads[index % ads.length] : null;

  useEffect(() => {
    setErrored(false);
  }, [index]);

  function next() {
    if (!hasAds) return;
    setIndex((i) => (i + 1) % ads.length);
  }

  function handleError() {
    setErrored(true);
    if (ads.length > 1) {
      const t = setTimeout(next, 1500);
      return () => clearTimeout(t);
    }
  }

  const showPlaceholder = !hasAds || errored;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-espresso shadow-sm ring-1 ring-coffee/20">
      <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-cream/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-espresso">
        <span className="size-1.5 animate-pulse rounded-full bg-mint" />
        On Air
      </div>

      {hasAds && current && !errored ? (
        <video
          ref={videoRef}
          key={current.src}
          src={current.src}
          poster={current.poster}
          autoPlay
          muted
          playsInline
          onEnded={next}
          onError={handleError}
          className="aspect-video w-full object-cover"
        />
      ) : (
        <Placeholder />
      )}

      {hasAds && current && !errored && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-gradient-to-t from-espresso/95 via-espresso/55 to-transparent px-4 pb-3 pt-10 text-cream">
          {current.sponsor && (
            <div className="text-[10px] uppercase tracking-[0.2em] text-cream/70">
              {current.sponsor}
            </div>
          )}
          <div className="text-sm font-bold leading-snug">{current.title}</div>
          {current.caption && (
            <div className="text-xs text-cream/75">{current.caption}</div>
          )}
        </div>
      )}

      {hasAds && ads.length > 1 && !showPlaceholder && (
        <div className="absolute right-3 top-3 z-10 rounded-full bg-cream/80 px-2 py-0.5 text-[10px] font-medium text-espresso">
          {index + 1} / {ads.length}
        </div>
      )}
    </div>
  );
}

function Placeholder() {
  return (
    <div className="aspect-video w-full bg-gradient-to-br from-espresso via-coffee to-coffee-light">
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-6 py-6 text-center text-cream">
        <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cream/70">
          Ad Slot
        </div>
        <div className="font-display text-lg font-bold">広告動画スロット</div>
        <div className="max-w-[280px] text-xs leading-relaxed text-cream/70">
          <code className="rounded bg-cream/15 px-1.5 py-0.5 text-cream">
            /public/ads/
          </code>{" "}
          に mp4 を置き、
          <code className="rounded bg-cream/15 px-1.5 py-0.5 text-cream">
            lib/ads.ts
          </code>{" "}
          に登録するとここで自動再生されます。
        </div>
      </div>
    </div>
  );
}
