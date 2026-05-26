import { ArrowLeft, RefreshCw } from 'lucide-react';

/**
 * SystemError — Generic application-level fallback page.
 * 
 * Used by ErrorBoundary when an unexpected runtime crash occurs.
 * Visually consistent with NotFound.jsx — same Cold Surgical layout,
 * same typography hierarchy, same pill button CTA.
 * 
 * NOT a specific HTTP status code page (no 500, 502, 503).
 * Just a single, clean, professional fallback.
 */
const SystemError = ({ onReset }) => {
  const handleReturn = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center px-6 text-center">
      {/* Overline */}
      <p className="font-mono text-[10px] tracking-[3px] uppercase text-text-muted mb-6">
        SYSTEM ERROR
      </p>

      {/* Error label — clinical, not a status code */}
      <h1 className="font-display text-[36px] md:text-[48px] font-light text-text-main tracking-[2px] uppercase leading-none mb-4">
        Something Went Wrong
      </h1>

      {/* Hairline separator */}
      <div className="w-16 h-px bg-card-border mb-8" />

      {/* Editorial body copy */}
      <p className="font-body text-[16px] md:text-[18px] text-text-secondary leading-relaxed max-w-md mb-12">
        The application encountered an unexpected condition and was unable to recover. 
        This incident has been noted for review.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4">
        {onReset && (
          <button
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2.5 font-mono text-[11px] tracking-[2px] uppercase text-accent border border-accent/40 rounded-full px-8 py-3 hover:bg-accent hover:text-bg-dark transition-all duration-300"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </button>
        )}
        <button
          onClick={handleReturn}
          className="inline-flex items-center justify-center gap-2.5 font-mono text-[11px] tracking-[2px] uppercase text-bg-dark bg-text-main rounded-full px-8 py-3 hover:bg-text-secondary transition-all duration-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Return to Platform
        </button>
      </div>
    </div>
  );
};

export default SystemError;
