import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  DON_RAFAEL,
  SENORITA_RICA,
  fetchWalkingRoute,
  LIGHT_MAP_TILE_URL,
  LIGHT_MAP_ATTRIBUTION,
} from '../action';
import './SlideFour.css';

const heartIcon = L.divIcon({
  className: 'slide-four-heart-marker',
  html: '<span aria-hidden="true">❤</span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function FitWalkingBounds({ coordinates }) {
  const map = useMap();
  useEffect(() => {
    if (!coordinates?.length) return;
    const bounds = L.latLngBounds(coordinates);
    map.fitBounds(bounds, { padding: [24, 24], maxZoom: 17 });
  }, [map, coordinates]);
  return null;
}

function SlideFour() {
  const [walkPath, setWalkPath] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetchWalkingRoute(DON_RAFAEL, SENORITA_RICA)
      .then((coords) => { if (!cancelled) setWalkPath(coords); })
      .catch(() => { if (!cancelled) setWalkPath([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    // Load images sr_1 through sr_4
    const loadImages = async () => {
      const images = [];
      for (let i = 1; i <= 4; i++) {
        try {
          const jpg = await import(`../images/sr_${i}.jpg`);
          images.push(jpg.default);
        } catch {
          try {
            const png = await import(`../images/sr_${i}.png`);
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

  const center = [(DON_RAFAEL[0] + SENORITA_RICA[0]) / 2, (DON_RAFAEL[1] + SENORITA_RICA[1]) / 2];

  return (
    <section className="slide-four">
      <div className="slide-four__inner">
        <div className="slide-four__left">
          <h2 className="slide-four__title">Maybe after…</h2>
          <p className="slide-four__text">
            We could walk over to Señorita Rica for coffee.
          </p>
          <div className="slide-four__map-wrap">
            <MapContainer
              center={center}
              zoom={16}
              className="slide-four__map"
              zoomControl={true}
              scrollWheelZoom={true}
            >
              <TileLayer attribution={LIGHT_MAP_ATTRIBUTION} url={LIGHT_MAP_TILE_URL} />
              {walkPath.length > 0 && (
                <Polyline positions={walkPath} color="#a62d4a" weight={5} opacity={1} />
              )}
              <Marker position={SENORITA_RICA} icon={heartIcon} />
              {walkPath.length > 0 && <FitWalkingBounds coordinates={walkPath} />}
            </MapContainer>
            {loading && <div className="slide-four__map-loading">Loading…</div>}
          </div>
        </div>
        <div className="slide-four__collage">
          {loadedImages.length > 0 ? (
            <>
              {loadedImages[0] && (
                <img src={loadedImages[0]} alt="Señorita Rica 1" className="slide-four__img slide-four__img--a" />
              )}
              {loadedImages[1] && (
                <img src={loadedImages[1]} alt="Señorita Rica 2" className="slide-four__img slide-four__img--b" />
              )}
              {loadedImages[2] && (
                <img src={loadedImages[2]} alt="Señorita Rica 3" className="slide-four__img slide-four__img--c" />
              )}
              {loadedImages[3] && (
                <img src={loadedImages[3]} alt="Señorita Rica 4" className="slide-four__img slide-four__img--d" />
              )}
            </>
          ) : (
            <>
              <div className="slide-four__img slide-four__img--a">Image</div>
              <div className="slide-four__img slide-four__img--b">Image</div>
              <div className="slide-four__img slide-four__img--c">Image</div>
              <div className="slide-four__img slide-four__img--d">Image</div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default SlideFour;
