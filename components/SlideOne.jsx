import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MAIN_ROUTE_WAYPOINTS,
  COMMUTE_STEPS,
  DON_RAFAEL,
  MONUMENTO_STATION,
  fetchDrivingRoute,
  getSegmentBounds,
  LIGHT_MAP_TILE_URL,
  LIGHT_MAP_ATTRIBUTION,
} from '../action';
import './SlideOne.css';

const CENTER = [14.61, 121.07];
const ZOOM = 11;

const heartIcon = L.divIcon({
  className: 'slide-one-heart-marker',
  html: '<span aria-hidden="true">❤</span>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

function MapController({ L, activeStepIndex, legs }) {
  const map = useMap();
  useEffect(() => {
    if (activeStepIndex == null || !L) return;
    // Step 0 is pickup - no map zoom needed
    if (activeStepIndex === 0) return;
    // Step 1 (index 1) is Monumento - zoom to station
    if (activeStepIndex === 1) {
      const bounds = getSegmentBounds(L, [MONUMENTO_STATION]);
      if (bounds) map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
      return;
    }
    // Steps 2-5: zoom to route segment (legs start from Monumento→LRT2)
    // Step 2 → leg 0, Step 3 → leg 1, Step 4 → leg 2, Step 5 → leg 3
    const legIndex = activeStepIndex - 2;
    if (legs?.length && legIndex >= 0 && legIndex < legs.length) {
      const bounds = getSegmentBounds(L, legs[legIndex]);
      if (bounds) map.fitBounds(bounds, { padding: [56, 56], maxZoom: 15 });
    } else if (activeStepIndex === 5) {
      // Don Rafael destination
      const bounds = getSegmentBounds(L, [DON_RAFAEL]);
      if (bounds) map.fitBounds(bounds, { padding: [56, 56], maxZoom: 15 });
    }
  }, [map, L, activeStepIndex, legs]);
  return null;
}

function SlideOne() {
  const [activeStepIndex, setActiveStepIndex] = useState(null);
  const [route, setRoute] = useState({ fullCoordinates: [], legs: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchDrivingRoute(MAIN_ROUTE_WAYPOINTS)
      .then((data) => {
        if (!cancelled) setRoute(data);
      })
      .catch(() => {
        if (!cancelled) {
          setError('Route unavailable');
          const fallbackLegs = [];
          for (let i = 0; i < MAIN_ROUTE_WAYPOINTS.length - 1; i++) {
            fallbackLegs.push([MAIN_ROUTE_WAYPOINTS[i], MAIN_ROUTE_WAYPOINTS[i + 1]]);
          }
          setRoute({
            fullCoordinates: MAIN_ROUTE_WAYPOINTS,
            legs: fallbackLegs,
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const { fullCoordinates, legs } = route;
  const hasRoute = fullCoordinates.length > 0;

  return (
    <section className="slide-one">
      <div className="slide-one__inner">
        <div className="slide-one__left">
          <h2 className="slide-one__title">Don Rafael Restaurant and Coffee Shop ❤️</h2>
          <p className="slide-one__intro">Here’s how we get there.</p>
          <p className="slide-one__date">February 16, 2026</p>
          <p className="slide-one__pickup">Pickup time: 9:00 AM</p>
          <ol className="slide-one__steps">
            {COMMUTE_STEPS.map((step, i) => (
              <li key={i}>
                <button
                  type="button"
                  className={`slide-one__step ${activeStepIndex === i ? 'slide-one__step--active' : ''}`}
                  onClick={() => setActiveStepIndex(i)}
                >
                  <span className="slide-one__step-label">{step.label}</span>
                  <span className="slide-one__step-detail">{step.detail}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div className="slide-one__map-wrap">
          <MapContainer
            center={CENTER}
            zoom={ZOOM}
            className="slide-one__map"
            zoomControl={true}
            scrollWheelZoom={true}
          >
            <TileLayer attribution={LIGHT_MAP_ATTRIBUTION} url={LIGHT_MAP_TILE_URL} />
            {hasRoute && (
              <>
                {legs.length > 0 ? (
                  legs.map((leg, i) => {
                    // Leg 0 corresponds to step 2 (Transfer LRT 2), leg 1 to step 3, etc.
                    const stepIndex = i + 2;
                    const isActive = activeStepIndex === stepIndex;
                    return (
                      <Polyline
                        key={i}
                        positions={leg}
                        color={isActive ? '#a62d4a' : '#5c2d3a'}
                        weight={isActive ? 7 : 2}
                        opacity={isActive ? 1 : 0.4}
                      />
                    );
                  })
                ) : (
                  <Polyline
                    positions={fullCoordinates}
                    color={activeStepIndex != null ? '#a62d4a' : '#6b2d42'}
                    weight={activeStepIndex != null ? 6 : 3}
                    opacity={0.9}
                  />
                )}
                <Marker position={DON_RAFAEL} icon={heartIcon} />
                <MapController L={L} activeStepIndex={activeStepIndex} legs={legs} />
              </>
            )}
          </MapContainer>
          {loading && <div className="slide-one__map-loading">Loading route…</div>}
          {error && <div className="slide-one__map-error">Route unavailable. Showing destination.</div>}
        </div>
      </div>
    </section>
  );
}

export default SlideOne;
