import { useLayoutEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { profile } from "../data/portfolio.js";

function LoadingScreen({ onComplete }) {
  const rootRef = useRef(null);
  const markRef = useRef(null);
  const nameRef = useRef(null);
  const captionRef = useRef(null);
  const progressRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    const duration = shouldReduceMotion ? 0.12 : 0.48;
    const context = gsap.context(() => {
      gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "left center" });

      gsap.timeline({ onComplete })
        .fromTo(
          markRef.current,
          { autoAlpha: 0, scale: 0.7, rotate: -12 },
          { autoAlpha: 1, scale: 1, rotate: 0, duration, ease: "back.out(1.7)" }
        )
        .fromTo(
          nameRef.current,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration, ease: "power3.out" },
          "-=0.2"
        )
        .fromTo(
          captionRef.current,
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, duration: duration * 0.8, ease: "power2.out" },
          "-=0.22"
        )
        .to(
          progressRef.current,
          { scaleX: 1, duration: shouldReduceMotion ? 0.08 : 0.68, ease: "power2.inOut" },
          "-=0.05"
        );
    }, rootRef);

    return () => context.revert();
  }, [onComplete, shouldReduceMotion]);

  return (
    <motion.div
      ref={rootRef}
      className="loader"
      role="status"
      aria-label={`Loading ${profile.name}'s portfolio`}
      exit={{
        y: "-100%",
        transition: {
          duration: shouldReduceMotion ? 0 : 0.58,
          ease: [0.76, 0, 0.24, 1],
        },
      }}
    >
      <div className="loader-content">
        <div className="loader-mark" ref={markRef} aria-hidden="true">c<span>.</span></div>
        <p className="loader-name" ref={nameRef}>{profile.name}</p>
        <p className="loader-caption" ref={captionRef}>Thoughtful design. Reliable code.</p>
        <div className="loader-progress" aria-hidden="true">
          <span ref={progressRef} />
        </div>
      </div>
    </motion.div>
  );
}

export default LoadingScreen;
