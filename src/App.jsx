import { useState, useEffect, useRef } from 'react';
import {
  TOTAL_SLIDES,
  canGoNext,
  canGoPrev,
  getNextSlideIndex,
  getPrevSlideIndex,
  getSlideTransitionStyle,
  createFloatingHearts,
} from '../action';
import IntroOverlay from '../components/IntroOverlay';
import SlideOne from '../components/SlideOne';
import SlideTwo from '../components/SlideTwo';
import SlideThree from '../components/SlideThree';
import SlideFour from '../components/SlideFour';
import SlideFive from '../components/SlideFive';
import './App.css';

const SLIDES = [SlideOne, SlideTwo, SlideThree, SlideFour, SlideFive];

function App() {
  const [introVisible, setIntroVisible] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);
  const heartsRef = useRef(null);
  const slideRef = useRef(null);

  useEffect(() => {
    if (introVisible || !heartsRef.current) return;
    const cleanup = createFloatingHearts(heartsRef.current, 14);
    return cleanup;
  }, [introVisible]);

  const handleIntroStart = () => setIntroVisible(false);

  const handleNext = () => {
    if (!canGoNext(slideIndex)) return;
    if (slideRef.current) {
      slideRef.current.style.opacity = '0';
      slideRef.current.style.transition = getSlideTransitionStyle();
    }
    setTimeout(() => setSlideIndex(getNextSlideIndex(slideIndex)), 300);
  };

  const handlePrev = () => {
    if (!canGoPrev(slideIndex)) return;
    if (slideRef.current) {
      slideRef.current.style.opacity = '0';
      slideRef.current.style.transition = getSlideTransitionStyle();
    }
    setTimeout(() => setSlideIndex(getPrevSlideIndex(slideIndex)), 300);
  };

  useEffect(() => {
    if (!slideRef.current) return;
    slideRef.current.style.opacity = '1';
    slideRef.current.style.transition = getSlideTransitionStyle();
  }, [slideIndex]);

  const CurrentSlide = SLIDES[slideIndex];

  return (
    <div className="App">
      <div ref={heartsRef} className="App__hearts" aria-hidden="true" />
      {introVisible ? (
        <IntroOverlay onStart={handleIntroStart} />
      ) : (
        <>
          <div ref={slideRef} className="App__slide">
            <CurrentSlide />
          </div>
          <nav className="App__nav">
            {canGoPrev(slideIndex) && (
              <button type="button" className="App__btn App__btn--prev" onClick={handlePrev}>
                Previous
              </button>
            )}
            {canGoNext(slideIndex) && (
              <button type="button" className="App__btn App__btn--next" onClick={handleNext}>
                Next
              </button>
            )}
          </nav>
        </>
      )}
    </div>
  );
}

export default App;
