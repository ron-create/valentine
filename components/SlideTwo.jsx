import './SlideTwo.css';
import donRafaelImage from '../images/don_rafael.jpg';

const INFO_BLOCKS = [
  { label: 'Cuisine', value: 'Filipino, Coffee' },
  { label: 'Price Range', value: '₱1–500' },
  { label: 'Opening Hours', value: '7:00 AM – 3:00 AM' },
  { label: 'Ambiance', value: 'Cozy, relaxed, scenic' },
  {
    label: 'Privacy',
    value: 'Private kubo-style seating is available for a more intimate dining experience.',
  },
  {
    label: 'Why I chose this',
    value: 'I wanted somewhere we could talk without rush, with good food and a view. The kubo option gives us a little space of our own if we want it.',
  },
];

const TIKTOK_LINKS = [
  'https://www.tiktok.com/@marjcruzz/video/7565490086628936978?q=don%20rafael%20restaurant%20antipolo%20menu&t=1771009888520',
  'https://www.tiktok.com/@kimcavln/video/7541257340985593106?q=don%20rafael%20restaurant%20antipolo%20menu&t=1771009888520',
  'https://www.tiktok.com/@donrafael86/video/7551793264349744402?q=don%20rafael%20restaurant%20antipolo%20menu&t=1771009888520',
  'https://www.tiktok.com/@mijayrah/video/7533853309887614215?q=don%20rafael%20restaurant%20antipolo%20menu&t=1771009888520',
];

function TikTokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

function SlideTwo() {
  return (
    <section className="slide-two">
      <div className="slide-two__inner">
        <h2 className="slide-two__title">I thought of this…</h2>
        <div className="slide-two__grid">
          <div className="slide-two__visual">
            <img src={donRafaelImage} alt="Don Rafael Restaurant" className="slide-two__image" />
          </div>
          <div className="slide-two__blocks">
            {INFO_BLOCKS.map((block, i) => (
              <div key={i} className="slide-two__block">
                <h3 className="slide-two__block-label">{block.label}</h3>
                <p className="slide-two__block-value">{block.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="slide-two__tiktok">
          <h3 className="slide-two__tiktok-title">You can see these videos</h3>
          <div className="slide-two__tiktok-list">
            {TIKTOK_LINKS.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="slide-two__tiktok-link"
              >
                <TikTokIcon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SlideTwo;
