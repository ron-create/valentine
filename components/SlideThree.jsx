import { useState, useEffect } from 'react';
import { getImageModalTransitionStyle } from '../action';
import './SlideThree.css';

const FACEBOOK_URL = 'https://www.facebook.com/permalink.php?story_fbid=pfbid0T9mhmBkddycpAKTm1WTYbTQvnugqqtj2kvQTxgDQoPvK6PeRYhqwX4Mxv5rStFCyl&id=61555199685907';

// Import images - Vite will handle the paths
function getImagePath(num) {
  try {
    return new URL(`../images/image_${num}.jpg`, import.meta.url).href;
  } catch {
    try {
      return new URL(`../images/image_${num}.png`, import.meta.url).href;
    } catch {
      return null;
    }
  }
}

// Try to load images - fallback to placeholder if not found
const IMAGE_PATHS = [1, 2, 3, 4, 5, 6].map(getImagePath).filter(Boolean);

function SlideThree() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [loadedImages, setLoadedImages] = useState([]);

  useEffect(() => {
    // Load images and handle errors
    const loadImages = async () => {
      const images = [];
      for (let i = 1; i <= 6; i++) {
        try {
          const jpg = await import(`../images/image_${i}.jpg`);
          images.push(jpg.default);
        } catch {
          try {
            const png = await import(`../images/image_${i}.png`);
            images.push(png.default);
          } catch {
            // Image not found, skip
          }
        }
      }
      setLoadedImages(images);
    };
    loadImages();
  }, []);

  const close = () => setExpandedIndex(null);

  useEffect(() => {
    if (expandedIndex === null) return;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expandedIndex]);

  if (loadedImages.length === 0) {
    return (
      <section className="slide-three">
        <div className="slide-three__inner">
          <h2 className="slide-three__title">Here are some photos</h2>
          <p className="slide-three__loading">Loading photos...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="slide-three">
      <div className="slide-three__inner">
        <h2 className="slide-three__title">Here are some photos</h2>
        <div className="slide-three__grid">
          {loadedImages.map((img, i) => (
            <button
              key={i}
              type="button"
              className="slide-three__image-wrap"
              onClick={() => (expandedIndex === i ? close() : setExpandedIndex(i))}
              aria-label={`View photo ${i + 1}`}
            >
              <img src={img} alt={`Photo ${i + 1}`} className="slide-three__image" />
            </button>
          ))}
        </div>
        <p className="slide-three__footer">
          You can also visit their{' '}
          <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="slide-three__link">
            Facebook page
          </a>{' '}
          for more photos and updates.
        </p>
      </div>
      {expandedIndex !== null && loadedImages[expandedIndex] && (
        <div
          className="slide-three__overlay"
          onClick={close}
          role="button"
          tabIndex={0}
          aria-label="Close"
          style={{ transition: getImageModalTransitionStyle() }}
        >
          <button
            type="button"
            className="slide-three__expanded-wrap"
            onClick={close}
            style={{ transition: getImageModalTransitionStyle() }}
          >
            <img
              src={loadedImages[expandedIndex]}
              alt={`Photo ${expandedIndex + 1}`}
              className="slide-three__expanded-image"
            />
          </button>
        </div>
      )}
    </section>
  );
}

export default SlideThree;
