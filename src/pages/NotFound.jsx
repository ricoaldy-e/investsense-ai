import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center px-6 text-center">
      {/* Overline */}
      <p className="font-mono text-[10px] tracking-[3px] uppercase text-text-muted mb-6">
        SYSTEM ERROR
      </p>

      {/* Error Code — monospace, large, clinical */}
      <h1 className="font-mono text-[72px] md:text-[96px] text-text-main leading-none tracking-[-2px] mb-4">
        404
      </h1>

      {/* Hairline separator */}
      <div className="w-16 h-px bg-card-border mb-8" />

      {/* Editorial body copy */}
      <p className="font-body text-[16px] md:text-[18px] text-text-secondary leading-relaxed max-w-md mb-12">
        The requested resource could not be located. 
        This endpoint may have been deprecated or does not exist within the InvestSense AI platform.
      </p>

      {/* CTA — pill button, Cold Surgical */}
      <Link
        to="/"
        className="inline-flex items-center gap-2.5 font-mono text-[11px] tracking-[2px] uppercase text-accent border border-accent/40 rounded-full px-8 py-3 hover:bg-accent hover:text-bg-dark transition-all duration-300"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Return to Platform
      </Link>
    </div>
  );
};

export default NotFound;
