"use client";

import { useEffect, useSyncExternalStore } from "react";

const storageKey = "gg-theme";

function subscribe(listener: () => void) {
  window.addEventListener("gg-theme-change", listener);
  return () => window.removeEventListener("gg-theme-change", listener);
}

function getSnapshot() {
  return document.documentElement.dataset.theme === "dark";
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === "dark" || saved === "light") document.documentElement.dataset.theme = saved;
    } catch {
      // Keep the default light theme when browser storage is unavailable.
    }
    window.dispatchEvent(new Event("gg-theme-change"));
  }, []);

  function toggleTheme() {
    const next = !dark;
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem(storageKey, next ? "dark" : "light");
    window.dispatchEvent(new Event("gg-theme-change"));
  }

  return (
    <button
      type="button"
      data-motion="311"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-border text-charcoal transition hover:border-gold hover:text-gold ${compact ? "p-2" : "px-3 py-2"}`}
      aria-label={`Switch to ${dark ? "day" : "night"} mode`}
      title={`Switch to ${dark ? "day" : "night"} mode`}
    >
      {dark ? (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M20.4 15.2A8.5 8.5 0 0 1 8.8 3.6 8.5 8.5 0 1 0 20.4 15.2Z" /></svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4"><circle cx="12" cy="12" r="4" /><path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></svg>
      )}
      {!compact && <span className="text-[10px] font-medium uppercase tracking-[.14em]">{dark ? "Day mode" : "Night mode"}</span>}
    </button>
  );
}
