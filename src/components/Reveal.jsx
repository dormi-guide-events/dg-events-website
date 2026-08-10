import { motion, useReducedMotion } from "framer-motion";

/**
 * The page's only scroll animation: a short fade and a small rise, once.
 * Keeping it in one component stops the motion vocabulary from sprawling.
 *
 * With prefers-reduced-motion the content starts visible and nothing moves —
 * there is no transform to reduce, so the element simply renders.
 */
export function Reveal({ children, className = "", delay = 0 }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
