import { useRef, useState, type ReactNode } from "react";

interface ProductCard3DProps {
  children: ReactNode;
  className?: string;
}

/**
 * Pure CSS 3D tilt card — no R3F dependency (keeps card grids lightweight).
 *
 * Layers: shadow → content → glow border on hover.
 * Tilts toward pointer, lifts on hover, red glow border.
 */
export default function ProductCard3D({
  children,
  className = "",
}: ProductCard3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    // normalise to –1 … +1
    const nx = (e.clientX - cx) / (rect.width / 2);
    const ny = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: ny * -8, y: nx * 8 }); // max 8 deg
  };

  const reset = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={reset}
      className={`group relative [perspective:800px] ${className}`}
    >
      {/* shadow layer */}
      <div
        className="absolute inset-0 rounded-2xl bg-black/30 blur-xl transition-opacity duration-300"
        style={{
          transform: `translateZ(-20px) translateX(${tilt.y * 0.3}px) translateY(${-tilt.x * 0.3}px)`,
          opacity: hovered ? 0.6 : 0.2,
        }}
        aria-hidden="true"
      />

      {/* main content layer */}
      <div
        className="relative rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm transition-all duration-200 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${hovered ? 12 : 0}px)`,
          borderColor: hovered ? "rgba(255,45,45,0.5)" : undefined,
          boxShadow: hovered
            ? "0 0 24px rgba(255,45,45,0.15), 0 8px 32px rgba(0,0,0,0.3)"
            : undefined,
        }}
      >
        {children}

        {/* glow overlay */}
        {hovered && (
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,45,45,0.06), transparent 70%)",
            }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
