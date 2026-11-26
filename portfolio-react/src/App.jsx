import { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import Marquee from "./components/Marquee.jsx";
import Projects from "./components/Projects.jsx";
import About from "./components/About.jsx";
import Services from "./components/Services.jsx";
import Approach from "./components/Approach.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  const finishLoading = useCallback(() => setIsLoading(false), []);

  return (
    <>
      <AnimatePresence initial={false}>
        {isLoading && <LoadingScreen key="loading" onComplete={finishLoading} />}
      </AnimatePresence>
      <motion.div
        className="site-shell"
        initial={false}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.42, ease: "easeOut" }}
      >
        <Navbar />
        <main>
          <Hero />
          <Marquee />
          <Projects />
          <About />
          <Services />
          <Approach />
          <Contact />
        </main>
        <Footer />
      </motion.div>
    </>
  );
}

export default App;
