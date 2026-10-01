import { useEffect, useState } from "react";

/* The section artwork in the designs is painted imagery. Each section ships a
   CSS/SVG stand-in; dropping the real export into public/results/ under the
   filename below layers it on top, which is what makes those panels match the
   designs exactly. If the file is absent the <img> removes itself and the CSS
   scene shows through, so the page is never broken by a missing asset. */
export default function SceneImage({ src, mobileSrc, alt = "", className = "", style }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  const image = (
    <img
      src={src}
      alt={alt}
      aria-hidden={alt ? undefined : "true"}
      onError={() => setFailed(true)}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
      style={style}
    />
  );

  if (!mobileSrc) return image;

  return (
    <picture>
      <source media="(max-width: 1023px)" srcSet={mobileSrc} />
      {image}
    </picture>
  );
}

/* Some sections need to know whether the export exists before choosing a
   layout — a full-bleed photograph is positioned differently from the CSS
   stand-in it replaces. Preloading answers that without rendering anything. */
export function useSceneImage(src) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!src) return undefined;

    let cancelled = false;
    const image = new Image();
    image.onload = () => {
      if (!cancelled) setReady(true);
    };
    image.src = src;

    return () => {
      cancelled = true;
    };
  }, [src]);

  return ready;
}
