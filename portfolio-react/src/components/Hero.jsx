import { motion, useReducedMotion } from "framer-motion";
import Icon from "./Icon.jsx";
import { profile } from "../data/portfolio.js";

function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const introTransition = {
    duration: shouldReduceMotion ? 0 : 0.68,
    ease: [0.22, 1, 0.36, 1],
  };

  return (
    <section id="home" className="hero">
      <div className="container hero-content">
        <motion.div
          className="hero-copy"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={introTransition}
        >
          <p className="eyebrow"><span className="status-dot" /> {profile.role} <span className="eyebrow-divider">/</span> Portfolio</p>
          <h1>
            Hi, I’m <span className="name-highlight">{profile.name.split(" ")[0]}.</span>
            <br />
            I build <span className="headline-accent">thoughtful</span>
            <br className="desktop-break" /> things for the web.
          </h1>
          <p className="hero-intro">{profile.intro}</p>
          <div className="hero-actions">
            <a href="#work" className="btn">
              Explore my work <Icon name="arrow" size={16} />
            </a>
            <a href="#about" className="btn btn-quiet">A little about me</a>
          </div>
          <p className="hero-footnote">Curious by nature <span>✳</span> Thoughtful by design <span>✳</span> Full-stack by craft</p>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...introTransition, delay: shouldReduceMotion ? 0 : 0.12 }}
        >
          <div className="hero-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85"
              alt="A bright, welcoming workspace with a laptop and notebook"
            />
          </div>
          <div className="hero-sticker" aria-hidden="true">
            <span>Made with</span>
            <strong>curiosity</strong>
            <span>& care ✿</span>
          </div>
          <div className="hero-code-card" aria-hidden="true">
            <span className="code-dots"><i /><i /><i /></span>
            <code><b>const</b> idea = <em>"hello, web!"</em>;</code>
          </div>
          <span className="hero-orbit" aria-hidden="true">✳</span>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
