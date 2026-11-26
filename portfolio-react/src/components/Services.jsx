import SectionHeading from "./SectionHeading.jsx";
import Icon from "./Icon.jsx";
import Reveal from "./Reveal.jsx";
import { skills, services } from "../data/portfolio.js";

function Services() {
  return (
    <section id="services" className="section">
      <div className="container">
        <SectionHeading
          label="03 / What I bring"
          before="Good ideas,"
          highlight="made real"
          subtitle="From a thoughtful first screen to the systems that make it work."
        />

        <div className="services-layout">
          <Reveal as="article" className="card skills-card">
            <Icon name="code" size={26} />
            <span className="small-label">My toolkit</span>
            <h3>Tools I reach for</h3>
            <p>A growing set of tools for shaping complete, useful web experiences.</p>
            <div className="skill-list">
              {skills.map((skill) => (
                <span className="skill" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </Reveal>

          {services.map((service, index) => (
            <Reveal as="article" className="card service-card" key={service.title} delay={index * 0.08}>
              <Icon name={service.icon} size={26} />
              <span className="small-label">{service.tag}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
