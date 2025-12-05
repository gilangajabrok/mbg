import { Variants } from 'framer-motion'

export const mbgMotion = {
  panelReveal: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: 'easeOut' },
  } as Variants,

  menuHoverBloom: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { type: 'spring', stiffness: 400, damping: 30 },
  } as Variants,

  toastSlideIn: {
    initial: { x: 400, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 400, opacity: 0 },
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  } as Variants,

  modalPopSpring: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
    transition: { type: 'spring', stiffness: 500, damping: 30 },
  } as Variants,

  buttonPressDepress: {
    initial: { scale: 1 },
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  } as Variants,

  cardFloatHover: {
    initial: { y: 0 },
    whileHover: { y: -4 },
    transition: { duration: 0.2 },
  } as Variants,

  sidebarHover: {
    initial: { opacity: 0.7, x: -5 },
    whileHover: { opacity: 1, x: 0 },
    transition: { duration: 0.2 },
  } as Variants,

  activeIndicatorPulse: {
    animate: { opacity: [0.8, 1, 0.8] },
    transition: { duration: 2, repeat: Infinity },
  } as Variants,
}
