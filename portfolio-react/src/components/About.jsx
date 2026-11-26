import SectionHeading from "./SectionHeading.jsx";
import Reveal from "./Reveal.jsx";
import { profile } from "../data/portfolio.js";

function About() {
  return (
    <section id="about" className="section about-section">
      <div className="container">
        <div className="about-layout">
          <Reveal className="about-image">
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85"
              alt="A team sharing ideas around a laptop"
              loading="lazy"
              decoding="async"
            />
            <div className="about-image-label">
              <span>My kind of work</span>
              <strong>Thoughtful, useful, human.</strong>
            </div>
          </Reveal>

          <Reveal className="about-copy" delay={0.12}>
            <SectionHeading label="02 / The person behind the pixels" before="A little" highlight="about me" subtitle="" />
            <p>{profile.about}</p>
            <p className="about-note">
              I believe good technology should feel clear, welcoming, and a little delightful to use.
            </p>
            <a href="#contact" className="text-link">
              Let’s say hello <span aria-hidden="true">↗</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default About;
