import { Loader2 } from 'lucide-react';

export const PageLoader = ({ label = 'Loading...', fullScreen = false }) => (
  <div className={`flex flex-col items-center justify-center gap-5 ${fullScreen ? 'min-h-screen bg-bg-dark' : 'min-h-[60vh] pb-24 md:pb-0'}`}>
    <div className="flex flex-col gap-2.5 w-40">
      <div className="h-[2px] shimmer-bar rounded-full" />
      <div className="h-[1px] shimmer-bar rounded-full w-3/4" style={{ animationDelay: '0.2s' }} />
      <div className="h-[1px] shimmer-bar rounded-full w-1/2" style={{ animationDelay: '0.4s' }} />
    </div>
    <p className="font-mono text-[10px] tracking-[3px] uppercase text-text-muted animate-pulse">
      {label}
    </p>
  </div>
);

export const InlineLoader = ({ label }) => (
  <div className="flex flex-col items-center justify-center py-10 gap-3">
    <div className="relative">
      <div className="w-5 h-5 border border-accent/20 rounded-full" />
      <Loader2 className="w-5 h-5 text-accent animate-spin absolute inset-0" />
    </div>
    {label && (
      <p className="font-mono text-[10px] tracking-[2px] uppercase text-text-muted">
        {label}
      </p>
    )}
  </div>
);

export const CardOverlayLoader = ({ label }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-card-dark/75 backdrop-blur-[2px] z-10">
    <div className="relative mb-2">
      <div className="w-5 h-5 border border-accent/20 rounded-full" />
      <Loader2 className="w-5 h-5 text-accent animate-spin absolute inset-0" />
    </div>
    {label && (
      <p className="font-mono text-[10px] tracking-[2px] uppercase text-text-muted">
        {label}
      </p>
    )}
  </div>
);

export const ActionToast = ({ label, visible }) => (
  <div
    className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3 bg-card-dark border border-card-border shadow-2xl transition-all duration-300 ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
    }`}
    role="status"
    aria-live="polite"
  >
    <div className="relative w-4 h-4 flex-shrink-0">
      <div className="w-4 h-4 border border-accent/20 rounded-full absolute inset-0" />
      <Loader2 className="w-4 h-4 text-accent animate-spin absolute inset-0" />
    </div>
    <p className="font-mono text-[10px] tracking-[2px] uppercase text-accent whitespace-nowrap">
      {label}
    </p>
  </div>
);

export default PageLoader;
