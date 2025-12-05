// Premium easing curve for all motion
export const PREMIUM_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)'

// Motion presets for consistent animation language
export const motionPresets = {
  // Page transitions
  pageEnter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: PREMIUM_EASING },
  },

  // Staggered children for smooth cascading
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  },

  // Card hover effect: subtle scale
  cardHover: {
    whileHover: { scale: 1.01, transition: { duration: 0.3 } },
  },

  // Button press state
  buttonPress: {
    whileTap: { scale: 0.97, transition: { duration: 0.1 } },
  },

  // Icon micro-animations
  iconFloat: {
    animate: {
      y: [0, -2, 0],
      transition: { duration: 3, repeat: Infinity },
    },
  },

  // Modal/popover entrance
  modalEnter: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.3, ease: PREMIUM_EASING },
  },

  // Skeleton shimmer
  shimmer: {
    animate: {
      backgroundPosition: ['0% 0%', '100% 0%'],
      transition: { duration: 2, repeat: Infinity, ease: 'linear' },
    },
  },
}
