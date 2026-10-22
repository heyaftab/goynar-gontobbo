"use client";

import { useEffect, type ReactNode } from "react";

export function HomepageMotion({ children }: { children: ReactNode }) {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>(".homepage-motion > section");
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-reveal", "visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -32px 0px" });

    sections.forEach((section) => {
      section.setAttribute("data-reveal", "pending");
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return <div className="homepage-motion">{children}</div>;
}
