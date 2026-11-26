import { motion, useReducedMotion } from "framer-motion";

function Reveal({
  as = "div",
  className,
  children,
  delay = 0,
  amount = 0.18,
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();
  const MotionElement = motion[as] || motion.div;

  return (
    <MotionElement
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.62,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...props}
    >
      {children}
    </MotionElement>
  );
}

export default Reveal;
