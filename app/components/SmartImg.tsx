"use client";

import { useState, type ReactNode } from "react";

/**
 * <img> that swaps to a fallback node when the source fails to load,
 * mirroring the reference prototype's inline onerror handlers.
 */
export default function SmartImg({
  src,
  alt,
  className,
  style,
  fallback = null,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  fallback?: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{fallback}</>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
