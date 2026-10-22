"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

const INTRO_KEY = "goynar_gontobbo_intro_seen";
// Set true temporarily when iterating on the intro. The shipped default is session based.
const ALWAYS_PLAY_CINEMATIC_INTRO = false;
const FULL_INTRO_MS = 6500;
const REDUCED_INTRO_MS = 1450;
const SCROLL_REVEAL_MS = 1050;

export function CinematicIntro() {
  // Render the dark cover in the server HTML so the page is never exposed before hydration.
  const [visible, setVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const userScrollingRef = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const revealTimer = useRef<number | null>(null);

  useEffect(() => {
    const forcedForPreview = new URLSearchParams(window.location.search).get("intro") === "1";
    let hasSeenIntro = false;
    try {
      hasSeenIntro = sessionStorage.getItem(INTRO_KEY) === "1";
    } catch {
      // Play the intro when browser storage is unavailable.
    }
    const shouldPlay = ALWAYS_PLAY_CINEMATIC_INTRO || forcedForPreview || !hasSeenIntro;

    if (!shouldPlay) {
      const frame = window.requestAnimationFrame(() => setVisible(false));
      return () => window.cancelAnimationFrame(frame);
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPower = navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4;
    const saveData = "connection" in navigator && Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);

    if (lowPower || saveData) {
      const frame = window.requestAnimationFrame(() => setVisible(false));
      return () => window.cancelAnimationFrame(frame);
    }

    const timer = window.setTimeout(() => {
      if (userScrollingRef.current) return;
      try {
        sessionStorage.setItem(INTRO_KEY, "1");
      } catch {
        // The intro should still complete if storage is unavailable.
      }
      setVisible(false);
    }, reducedMotion ? REDUCED_INTRO_MS : FULL_INTRO_MS);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.querySelector<HTMLDivElement>(".cinematic-intro")?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  useEffect(() => () => {
    if (revealTimer.current !== null) window.clearTimeout(revealTimer.current);
  }, []);

  if (!visible) return null;

  function scrollToReveal(distance: number) {
    if (distance <= 0 || userScrollingRef.current) return;
    userScrollingRef.current = true;
    const nextProgress = Math.min(1, Math.max(.08, distance / Math.max(window.innerHeight * .55, 1)));
    setScrollProgress(nextProgress);
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      // The page can still be revealed if storage is unavailable.
    }
    revealTimer.current = window.setTimeout(() => setVisible(false), SCROLL_REVEAL_MS);
  }

  return (
    <div
      className={`cinematic-intro${scrollProgress > 0 ? " cinematic-intro--scrolling" : ""}`}
      style={{ "--intro-scroll-start": `-${scrollProgress * 100}vh` } as CSSProperties}
      role="dialog"
      aria-label="Welcome to Goynar Gontobbo"
      aria-modal="true"
      tabIndex={-1}
      onWheel={(event) => {
        if (event.deltaY > 0) {
          event.preventDefault();
          scrollToReveal(event.deltaY);
        }
      }}
      onTouchStart={(event) => {
        touchStartY.current = event.touches[0]?.clientY ?? null;
      }}
      onTouchMove={(event) => {
        const startY = touchStartY.current;
        const currentY = event.touches[0]?.clientY;
        if (startY !== null && currentY !== undefined && startY > currentY) {
          event.preventDefault();
          scrollToReveal(startY - currentY);
        }
        touchStartY.current = currentY ?? null;
      }}
      onTouchEnd={() => {
        touchStartY.current = null;
      }}
      onKeyDown={(event) => {
        if (["ArrowDown", "PageDown", " "].includes(event.key)) {
          event.preventDefault();
          scrollToReveal(window.innerHeight * 0.18);
        }
      }}
    >
      <div className="cinematic-intro__image" aria-hidden="true">
        <Image
          src="/assets/WhatsApp%20Image%202026-10-09%20at%2016.20.43%20%282%29.jpeg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="cinematic-intro__shade" aria-hidden="true" />
      <div className="cinematic-intro__ambient" aria-hidden="true" />
      <div className="cinematic-intro__beam" aria-hidden="true" />
      <div className="cinematic-intro__brand">
        <Image
          src="/assets/Luxurious%20Gold%20Goynar%20Gontobbo%20Monogram.png"
          alt="Goynar Gontobbo"
          width={112}
          height={112}
          priority
          className="cinematic-intro__logo"
        />
        <p className="cinematic-intro__name">GOYNAR GONTOBBO</p>
        <p className="cinematic-intro__tagline">Where Every Piece Tells a Story</p>
      </div>
      <p className="cinematic-intro__scroll-hint" aria-hidden="true">Scroll to reveal <span>↓</span></p>
    </div>
  );
}
