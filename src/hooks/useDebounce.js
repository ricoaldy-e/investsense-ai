import { useState, useEffect } from 'react';

/**
 * Debounces a value by the given delay (default: 500ms).
 *
 * The returned value only updates after the user has stopped
 * changing the input for `delay` milliseconds. This prevents
 * excessive API calls on every keystroke.
 *
 * @param {any} value  - The value to debounce.
 * @param {number} delay - Delay in milliseconds (default: 500).
 * @returns {any} The debounced value.
 */
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timer if value changes before delay elapses
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
