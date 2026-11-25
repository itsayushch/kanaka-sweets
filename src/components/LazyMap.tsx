"use client";

/**
 * Google Map that loads LAZILY (Rules D1, D8, Brief 3.5).
 *
 * A Google Maps iframe is heavy (hundreds of KB of JavaScript). So we only put
 * the iframe on the page when the visitor scrolls close to it, or taps the
 * button. Until then there is just a light placeholder of fixed size (so the
 * page doesn't jump when the map appears: Rule D3).
 */
import { useEffect, useRef, useState } from "react";
import { MapPinIcon } from "@/components/icons";

export function LazyMap({ query, title }: { query: string; title: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  // Load the map when the box is about to scroll into view.
  useEffect(() => {
    const el = box.current;
    if (!el || show) return;
    if (!("IntersectionObserver" in window)) return; // the button below still works
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }, // start a little before it is visible
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [show]);

  return (
    <div
      ref={box}
      className="relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-stone-200 bg-[#FAF6EF]"
    >
      {show ? (
        <iframe
          title={title}
          src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <MapPinIcon className="w-8 h-8 text-[#871a45]" />
          <p className="text-sm text-stone-600">{title}</p>
          <button
            type="button"
            onClick={() => setShow(true)}
            className="bg-[#871a45] text-white font-bold text-sm rounded-xl px-6 min-h-[44px]"
          >
            Show map
          </button>
        </div>
      )}
    </div>
  );
}
