import React from "react";
import { motion } from "framer-motion";

const getOffset = (direction) => {
  const offset = 40;
  switch (direction) {
    case "up": return { x: 0, y: offset };
    case "down": return { x: 0, y: -offset };
    case "left": return { x: offset, y: 0 };
    case "right": return { x: -offset, y: 0 };
    default: return { x: 0, y: offset };
  }
};

const getVariants = (direction, duration) => {
  const { x, y } = getOffset(direction);
  return {
    hidden: { opacity: 0, x, y },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, ease: [0.25, 0.1, 0.25, 1] },
    },
  };
};

export const ScrollReveal = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  className,
  once = true,
}) => (
  <motion.div
    variants={getVariants(direction, duration)}
    initial="hidden"
    whileInView="visible"
    viewport={{ once, amount: 0.15 }}
    transition={{ delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerContainer = ({
  children,
  className,
  staggerDelay = 0.1,
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.1 }}
    variants={{
      hidden: {},
      visible: { transition: { staggerChildren: staggerDelay } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({
  children,
  className,
  direction = "up",
}) => (
  <motion.div
    variants={getVariants(direction, 0.5)}
    className={className}
  >
    {children}
  </motion.div>
);