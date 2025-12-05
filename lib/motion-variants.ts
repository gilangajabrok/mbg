// Framer Motion animation variants for consistent motion across UI
export const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
}

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

export const hoverScaleVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98 },
}

export const slideInLeftVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
}

export const slideInRightVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
}

export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
}

export const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
}
