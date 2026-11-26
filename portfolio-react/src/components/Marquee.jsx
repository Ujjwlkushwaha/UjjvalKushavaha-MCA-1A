import { marqueeItems } from "../data/portfolio.js";

// The list is rendered twice so the scrolling loop has no gap.
function Marquee() {
  const items = [...marqueeItems, ...marqueeItems];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.map((item, index) => (
          <span className="marquee-item" key={index}>
            <span className="burst">✺</span> {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Marquee;
