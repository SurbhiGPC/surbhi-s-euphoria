interface Hero3DLoaderProps {
  fadeOut?: boolean;
}

/**
 * Soft, elegant loader in the violet and cream aesthetic.
 * Displayed while 3D chunks and WebGL scenes initialize, then softly fades out.
 */
export function Hero3DLoader({ fadeOut = false }: Hero3DLoaderProps) {
  return (
    <div
      className={`hero-3d-loader ${fadeOut ? 'hero-3d-loader-hidden' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading 3D atmosphere"
    >
      <div className="hero-3d-loader-visual">
        <span className="hero-3d-loader-ring" />
        <span className="hero-3d-loader-dot" />
      </div>
      <div className="hero-3d-loader-labels">
        <span className="hero-3d-loader-title">3D ATMOSPHERE</span>
        <span className="hero-3d-loader-status">Gathering light...</span>
      </div>
    </div>
  );
}
