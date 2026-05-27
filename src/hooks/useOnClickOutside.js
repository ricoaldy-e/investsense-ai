import { useEffect } from 'react';

/**
 * Fires a handler when the user clicks outside the given element ref.
 *
 * Attach `ref` to any DOM node. `handler` will be called whenever a
 * `mousedown` event fires on a target that is NOT contained within
 * that node — ideal for closing dropdowns/modals.
 *
 * @param {React.RefObject} ref     - Ref attached to the element to watch.
 * @param {Function}        handler - Callback fired on an outside click.
 */
const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if the click was inside the ref element (or its children)
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
};

export default useOnClickOutside;
