import {
  useCallback, useEffect, useRef, useState,
} from 'react';

/**
 * Open an interactive over the browser window (not the OS full screen).
 *
 * The element gets `isOpen`; give it the class "wgu-overlay" then, which fixes it
 * over the viewport. Esc closes it, and the page behind it stops scrolling.
 *
 * `close()` first sets `isClosing` for `exitMs`, so the content can animate out
 * (skipped with reduced motion). `onExit` runs once the overlay has closed, for
 * any reason.
 *
 * Inside Open edX's learning app the block runs in a unit iframe, where a fixed
 * overlay only covers the iframe; use `openLearningModal` there instead (see
 * learningModal.ts), and this hook inside the modal.
 */
export function useOverlay(onExit?: () => void, exitMs = 220) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closingRef = useRef(false);

  const open = useCallback(() => {
    closingRef.current = false;
    setIsClosing(false);
    setIsOpen(true);
  }, []);

  const close = useCallback(async () => {
    if (closingRef.current) {
      return;
    }
    closingRef.current = true;
    const reduceMotion = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (exitMs > 0 && !reduceMotion) {
      setIsClosing(true);
      await new Promise((resolve) => { window.setTimeout(resolve, exitMs); });
    }
    setIsClosing(false);
    setIsOpen(false);
    closingRef.current = false;
    onExit?.();
  }, [exitMs, onExit]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, close]);

  return {
    isOpen, isClosing, open, close,
  };
}
