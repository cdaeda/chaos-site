"use client";

import { useEffect, useRef } from "react";

export default function Bubbles({ className, bubbleClass }: { className: string; bubbleClass: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce =
      typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion:reduce)").matches;
    if (reduce) return;
    const host = hostRef.current;
    if (!host) return;

    const N = 26;
    const created: HTMLDivElement[] = [];
    for (let i = 0; i < N; i++) {
      const b = document.createElement("div");
      b.className = bubbleClass;
      const size = 4 + Math.random() * 22;
      b.style.width = size + "px";
      b.style.height = size + "px";
      b.style.left = Math.random() * 100 + "vw";
      b.style.setProperty("--drift", Math.random() * 120 - 60 + "px");
      const dur = 9 + Math.random() * 16;
      b.style.animationDuration = dur + "s";
      b.style.animationDelay = -Math.random() * dur + "s";
      host.appendChild(b);
      created.push(b);
    }

    return () => {
      created.forEach((b) => b.remove());
    };
  }, [bubbleClass]);

  return <div className={className} ref={hostRef} />;
}
