import SectionHeading from "./SectionHeading.jsx";
import Reveal from "./Reveal.jsx";
import { workApproach } from "../data/portfolio.js";

function Approach() {
  return (
    <section id="approach" className="section approach-section">
      <div className="container">
        <SectionHeading
          label="04 / A considered process"
          before="How I like"
          highlight="to work"
          subtitle="A simple process, with room for curiosity and care."
        />
        <div className="approach-grid">
          {workApproach.map((step, index) => (
            <Reveal as="article" className="approach-card" key={step.number} delay={index * 0.1}>
              <span className="approach-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Approach;
