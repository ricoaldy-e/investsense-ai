import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';

NProgress.configure({
  minimum: 0.15,
  easing: 'ease',
  speed: 380,
  showSpinner: false,
  trickleSpeed: 200,
});

const NavigationProgress = () => {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    const prevPath    = prevPathRef.current;

    if (currentPath !== prevPath) {
      NProgress.start();
      prevPathRef.current = currentPath;
    }

    const timer = setTimeout(() => NProgress.done(), 80);
    return () => clearTimeout(timer);
  }, [location]);

  return null;
};

export default NavigationProgress;
