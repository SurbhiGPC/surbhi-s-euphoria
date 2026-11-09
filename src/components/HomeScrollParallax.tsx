import { useEffect, useRef } from 'react';

/**
 * Subtle scroll-driven parallax decorations for the Home page.
 * Floating luxury accents (soft ambient orbs, sculptural gold wire ring, delicate lavender star)
 * moving at differential speeds across scroll.
 * Uses requestAnimationFrame and direct transform updates for 60-120fps butter-smooth motion.
 */
export function HomeScrollParallax() {
  const orbVioletRef = useRef<HTMLDivElement>(null);
  const ringGoldRef = useRef<HTMLDivElement>(null);
  const starLavenderRef = useRef<HTMLDivElement>(null);
  const auraAmberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Respect reduced motion preferences
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let rafId: number;

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        // Differential parallax speeds & subtle rotations
        if (orbVioletRef.current) {
          orbVioletRef.current.style.transform = `translate3d(0, ${scrollY * -0.15}px, 0)`;
        }
        if (ringGoldRef.current) {
          ringGoldRef.current.style.transform = `translate3d(0, ${scrollY * 0.14}px, 0) rotate(${scrollY * 0.035}deg)`;
        }
        if (starLavenderRef.current) {
          starLavenderRef.current.style.transform = `translate3d(0, ${scrollY * -0.09}px, 0) rotate(${scrollY * -0.04}deg)`;
        }
        if (auraAmberRef.current) {
          auraAmberRef.current.style.transform = `translate3d(0, ${scrollY * 0.11}px, 0)`;
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial sync
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      className="home-parallax-decorations"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {/* 1. Soft Violet Atmospheric Aura (near Creative Edit top right) */}
      <div
        ref={orbVioletRef}
        style={{
          position: 'absolute',
          top: '950px',
          right: '-80px',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, oklch(.45 .22 300 / .14) 0%, oklch(.3 .18 295 / .05) 50%, transparent 75%)',
          filter: 'blur(70px)',
          willChange: 'transform',
        }}
      />

      {/* 2. Delicate Gold Sculptural Wireframe Ring (mid right) */}
      <div
        ref={ringGoldRef}
        style={{
          position: 'absolute',
          top: '1250px',
          right: '5%',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: '1px solid rgba(254, 240, 138, 0.16)',
          boxShadow: '0 0 35px rgba(250, 204, 21, 0.08), inset 0 0 25px rgba(254, 240, 138, 0.04)',
          willChange: 'transform',
        }}
      />

      {/* 3. Luminous Four-Point Starlet (mid left margin near "About" section) */}
      <div
        ref={starLavenderRef}
        style={{
          position: 'absolute',
          top: '1680px',
          left: '4%',
          width: '26px',
          height: '26px',
          color: 'oklch(.82 .15 300 / .4)',
          filter: 'drop-shadow(0 0 12px oklch(.76 .18 300 / .5))',
          willChange: 'transform',
        }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
          <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
        </svg>
      </div>

      {/* 4. Soft Champagne & Amber Warm Aura (lower left background) */}
      <div
        ref={auraAmberRef}
        style={{
          position: 'absolute',
          top: '2050px',
          left: '-100px',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, oklch(.55 .14 85 / .10) 0%, oklch(.4 .1 90 / .03) 55%, transparent 80%)',
          filter: 'blur(80px)',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
