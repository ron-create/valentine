import { useRef, useEffect } from 'react';
import { getIntroAutoHideDelay, runIntroFadeOut } from '../action';
import './IntroOverlay.css';

function IntroOverlay({ onStart }) {
  const overlayRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const delay = getIntroAutoHideDelay();
    timeoutRef.current = setTimeout(() => {
      runIntroFadeOut(overlayRef.current, onStart);
    }, delay);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [onStart]);

  const handleStart = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    runIntroFadeOut(overlayRef.current, onStart);
  };

  return (
    <div ref={overlayRef} className="intro-overlay" role="dialog" aria-label="Welcome">
      <h1 className="intro-overlay__title">Happy Valentine's Day ❤️</h1>
      <p className="intro-overlay__subtitle">
        On February 16, 2026, we’re going somewhere special.
      </p>
      <button type="button" className="intro-overlay__btn" onClick={handleStart}>
        Start
      </button>
    </div>
  );
}

export default IntroOverlay;
