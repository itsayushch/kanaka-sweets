"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export interface HeroBanner {
  id: string;
  image: string;
  alt: string;
  href: string;
  title: string;
}

interface HeroCarouselProps {
  banners: HeroBanner[];
}

export function HeroCarousel({ banners }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  // Only the first banner loads at first. The others load a moment later, so the
  // first image (the LCP image) gets all the bandwidth (Rule D1/D2).
  const [preloadOthers, setPreloadOthers] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const length = banners.length;

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % length);
  }, [length]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + length) % length);
  }, [length]);

  // Start loading the other banners a few seconds after the page is ready.
  useEffect(() => {
    const timer = setTimeout(() => setPreloadOthers(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-advance carousel. Visitors who ask for reduced motion (Rule D7) get a
  // carousel that only moves when they use the arrows or dots.
  useEffect(() => {
    if (isPaused || length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, length, nextSlide]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
  };

  if (!banners || banners.length === 0) return null;

  return (
    <div
      className="relative w-full overflow-hidden bg-stone-900 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Kanaka Sweets Highlights"
    >
      {/* ── Slide Images (Aspect Ratio ~2.8:1 matching BSS Banners) ── */}
      <div className="relative w-full aspect-[2.8/1] min-h-[160px] sm:min-h-[260px] md:min-h-[340px] lg:min-h-[420px] xl:min-h-[480px]">
        {banners.map((banner, index) => {
          if (!banner) return null;
          const isActive = index === current;
          // Render an image only for the visible slide, plus its neighbours once
          // the page has settled. Hidden slides cost nothing until needed.
          const shouldRender =
            isActive ||
            (preloadOthers &&
              (index === (current + 1) % length ||
                index === (current - 1 + length) % length));
          return (
            <div
              key={banner.id || `banner-${index}`}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={!isActive}
            >
              <Link
                href={banner.href || "#"}
                className="block relative w-full h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#871a45] focus:ring-inset"
                tabIndex={isActive ? 0 : -1}
                aria-label={banner.title || banner.alt || "Banner"}
              >
                {shouldRender && (
                  <Image
                    src={banner.image}
                    alt={banner.alt || "Kanaka Sweets & Bakery"}
                    width={1920}
                    height={815}
                    priority={index === 0}
                    // Banners other than the first only mount when about to be shown,
                    // so load them right away to avoid a blank frame while fading in.
                    loading={index === 0 ? undefined : "eager"}
                    sizes="100vw"
                    className="absolute inset-0 h-full w-full object-cover object-center select-none"
                  />
                )}
              </Link>
            </div>
          );
        })}
      </div>

      {/* ── Prev / Next Navigation Arrows (Hover visible, accessible) ── */}
      {length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/75 hover:bg-white text-[#002c3f] shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:opacity-100 backdrop-blur-xs cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/75 hover:bg-white text-[#002c3f] shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:opacity-100 backdrop-blur-xs cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* ── Slide Dot Indicators ──
          Bottom right on phones, so they never sit on top of the banner's button
          (bottom left). Bottom centre on wider screens. */}
      {length > 1 && (
        <div className="absolute bottom-0 sm:bottom-5 inset-x-0 z-20 flex items-center justify-end pr-1 sm:justify-center sm:pr-0 sm:gap-2 pointer-events-none">
          {banners.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrent(index)}
              // 44px tap area (Rule C6) around a small visible dot. Only transform and
              // opacity animate (Rule D6).
              className="pointer-events-auto w-11 h-11 flex items-center justify-center cursor-pointer"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === current ? "true" : undefined}
            >
              <span
                className={`block h-2 w-2 rounded-full bg-white transition-[transform,opacity] duration-300 ${
                  index === current ? "scale-125 opacity-100 shadow-sm" : "opacity-50"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
