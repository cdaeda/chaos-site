"use client";

import { useEffect } from "react";

export default function Reveal({ revealClass, inClass }: { revealClass: string; inClass: string }) {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("." + revealClass);
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add(inClass));
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(inClass);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((e) => io.observe(e));

    return () => io.disconnect();
  }, [revealClass, inClass]);

  return null;
}
