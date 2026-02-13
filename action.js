// action.js — Slide navigation, intro, floating hearts, map routes (OSRM)

const TRANSITION_DURATION_MS = 500;
const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
const INTRO_AUTO_HIDE_MS = 6000;
const OSRM_DRIVING = 'https://router.project-osrm.org/route/v1/driving';
const OSRM_FOOT = 'https://router.project-osrm.org/route/v1/foot';

// ——— Slide flow (Previous + Next) ———

export const TOTAL_SLIDES = 5;

export function canGoNext(currentIndex) {
  return currentIndex < TOTAL_SLIDES - 1;
}

export function canGoPrev(currentIndex) {
  return currentIndex > 0;
}

export function getNextSlideIndex(currentIndex) {
  if (currentIndex >= TOTAL_SLIDES - 1) return currentIndex;
  return currentIndex + 1;
}

export function getPrevSlideIndex(currentIndex) {
  if (currentIndex <= 0) return 0;
  return currentIndex - 1;
}

export function getSlideTransitionStyle() {
  return `opacity ${TRANSITION_DURATION_MS}ms ${EASING}`;
}

// ——— Intro overlay ———

export function getIntroAutoHideDelay() {
  return INTRO_AUTO_HIDE_MS;
}

export function runIntroFadeOut(overlayElement, onDone) {
  if (!overlayElement) return;
  overlayElement.style.transition = `opacity ${TRANSITION_DURATION_MS}ms ${EASING}`;
  overlayElement.style.opacity = '0';
  const t = setTimeout(() => {
    if (typeof onDone === 'function') onDone();
  }, TRANSITION_DURATION_MS);
  return () => clearTimeout(t);
}

// ——— Floating hearts (opacity < 0.2, minimal) ———

export function createFloatingHearts(container, count = 12) {
  if (!container) return () => {};
  const hearts = [];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'floating-heart';
    el.innerHTML = '❤';
    const size = 10 + Math.random() * 10;
    const left = Math.random() * 100;
    const duration = 20 + Math.random() * 10;
    const delay = Math.random() * 10;
    const opacity = 0.04 + Math.random() * 0.14; // max < 0.2
    el.style.cssText = `
      left: ${left}%;
      font-size: ${size}px;
      opacity: ${opacity};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;
    container.appendChild(el);
    hearts.push(el);
  }
  return () => hearts.forEach((h) => h.remove());
}

// ——— Main route (Slide 1): waypoints for OSRM driving ———
// Don Rafael: 14.612621, 121.154600
export const DON_RAFAEL = [14.612621, 121.1546];
export const SENORITA_RICA = [14.612596, 121.154323];
export const MONUMENTO_STATION = [14.6533, 120.9833]; // LRT 1 Monumento station

/** Waypoints [lat, lng] for driving route: Monumento → LRT 2 → Antipolo (Masinag) → Sumulong → Don Rafael */
export const MAIN_ROUTE_WAYPOINTS = [
  MONUMENTO_STATION,    // LRT 1 Monumento
  [14.618, 121.001],    // Transfer LRT 2
  [14.6256, 121.1247],  // LRT 2 Antipolo (Masinag)
  [14.62, 121.14],      // Sumulong Highway
  DON_RAFAEL,           // Don Rafael Restaurant and Coffee Shop
];

export const COMMUTE_STEPS = [
  { label: '9:00 AM – I\'ll pick you up from your house.', detail: 'Pickup time' },
  { label: 'LRT 1 (Monumento)', detail: 'Board at Monumento station' },
  { label: 'Transfer to LRT 2', detail: 'Connect to LRT 2 line' },
  { label: 'LRT 2 Antipolo (Masinag)', detail: 'Alight at terminal station' },
  { label: 'Sumulong Highway', detail: 'Toward the restaurant' },
  { label: 'Don Rafael', detail: 'Sumulong Highway, Brgy. Mambugan, Antipolo City' },
];

/** Fetch driving route from OSRM. Returns { fullCoordinates: [[lat,lng], ...], legs: [[[lat,lng],...], ...] }. */
export async function fetchDrivingRoute(waypoints) {
  const coords = waypoints.map(([lat, lng]) => `${lng},${lat}`).join(';');
  const url = `${OSRM_DRIVING}/${coords}?overview=full&geometries=geojson&steps=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Route fetch failed');
  const data = await res.json();
  if (data.code !== 'Ok' || !data.routes?.[0]) throw new Error('No route');
  const route = data.routes[0];
  const fullCoordinates = (route.geometry?.coordinates || []).map(([lng, lat]) => [lat, lng]);
  const legs = (route.legs || []).map((leg) =>
    (leg.steps || []).flatMap((s) => (s.geometry?.coordinates || [])).map(([lng, lat]) => [lat, lng])
  ).filter((arr) => arr.length > 0);
  if (legs.length === 0 && fullCoordinates.length) legs.push([...fullCoordinates]);
  return { fullCoordinates, legs };
}

/** Fetch walking route. Returns [[lat,lng], ...]. */
export async function fetchWalkingRoute(fromLatLng, toLatLng) {
  const from = `${fromLatLng[1]},${fromLatLng[0]}`;
  const to = `${toLatLng[1]},${toLatLng[0]}`;
  const url = `${OSRM_FOOT}/${from};${to}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Walking route fetch failed');
  const data = await res.json();
  if (data.code !== 'Ok' || !data.routes?.[0]) throw new Error('No route');
  const geom = data.routes[0].geometry.coordinates;
  return geom.map(([lng, lat]) => [lat, lng]);
}

/** Bounds for a step: segment (leg) or single point. L = Leaflet. */
export function getSegmentBounds(L, segment) {
  if (!L || !segment || !segment.length) return null;
  if (segment.length === 1) {
    const [lat, lng] = segment[0];
    return L.latLngBounds([lat - 0.006, lng - 0.006], [lat + 0.006, lng + 0.006]);
  }
  return L.latLngBounds(segment);
}

// ——— Map: MapTiler light theme ———
const MAPTILER_API_KEY = 'NL2YKEfq3MX1Ez08BvWV';
export const LIGHT_MAP_TILE_URL = `https://api.maptiler.com/maps/openstreetmap/{z}/{x}/{y}.png?key=${MAPTILER_API_KEY}`;
export const LIGHT_MAP_ATTRIBUTION = '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

// ——— Image expand modal ———
export const IMAGE_MODAL_TRANSITION_MS = 300;
export function getImageModalTransitionStyle() {
  return `opacity ${IMAGE_MODAL_TRANSITION_MS}ms ${EASING}, transform ${IMAGE_MODAL_TRANSITION_MS}ms ${EASING}`;
}
