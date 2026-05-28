/**
 * NavigationProgress.jsx
 *
 * Integrates NProgress with React Router v6 (BrowserRouter).
 * - Starts the top bar whenever the route location changes.
 * - Completes it once the new page component finishes mounting.
 *
 * Usage: render <NavigationProgress /> once inside <Router> but
 * outside of <Routes> so it is always mounted.
 */

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';

// ─── NProgress global config ──────────────────────────────────────────────────
NProgress.configure({
  minimum: 0.15,        // start at 15% so the bar is immediately visible
  easing: 'ease',
  speed: 380,           // animation speed in ms
  showSpinner: false,   // hide the default spinner — we have our own
  trickleSpeed: 200,    // how fast it auto-advances while waiting
});

const NavigationProgress = () => {
  const location = useLocation();
  // Keep track of the previous pathname so we only trigger on real changes
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    const prevPath    = prevPathRef.current;

    if (currentPath !== prevPath) {
      // A navigation happened — start the bar
      NProgress.start();
      prevPathRef.current = currentPath;
    }

    // The new page has rendered — finish the bar
    // Small timeout so the bar is visible for at least one frame even on fast navigations
    const timer = setTimeout(() => NProgress.done(), 80);
    return () => clearTimeout(timer);
  }, [location]);

  return null; // This component renders nothing — NProgress injects its own DOM
};

export default NavigationProgress;
