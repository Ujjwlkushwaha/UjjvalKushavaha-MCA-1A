import Reveal from "./Reveal.jsx";

function SectionHeading({ label, before, highlight, subtitle }) {
  return (
    <Reveal className="section-heading">
      {label && <p className="section-label">{label}</p>}
      <h2>
        {before} <span className="accent">{highlight}</span>
      </h2>
      {subtitle && <p>{subtitle}</p>}
    </Reveal>
  );
}

export default SectionHeading;
