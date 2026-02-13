import './SlideFive.css';

const LINES = [
 
  'We take LRT 1, then transfer to LRT 2.',
  'Lunch at Don Rafael.',
  'Coffee at Señorita Rica.',
  'And the rest of the day is ours.',
];

function SlideFive() {
  return (
    <section className="slide-five">
      <div className="slide-five__inner">
        <h2 className="slide-five__title">The Plan</h2>
        <p className="slide-five__date">February 16, 2026</p>
        <p className="slide-five__pickup">9:00 AM – I'll pick you up.</p>
        <div className="slide-five__content">
          {LINES.map((line, i) => (
            <p key={i} className={`slide-five__line ${i === LINES.length - 1 ? 'slide-five__line--last' : ''}`}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SlideFive;
