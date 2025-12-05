// Sound effect utilities for MBG admin UI
export const mbgSoundEffects = {
  navOpen: { url: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==', volume: 0.3 },
  buttonPress: { url: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==', volume: 0.2 },
  toggleChange: { url: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==', volume: 0.25 },
  success: { url: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==', volume: 0.4 },
  warning: { url: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==', volume: 0.35 },
  modalOpen: { url: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==', volume: 0.3 },
}

export function playMBGSound(soundKey: keyof typeof mbgSoundEffects) {
  try {
    const effect = mbgSoundEffects[soundKey]
    const audio = new Audio(effect.url)
    audio.volume = effect.volume
    audio.play().catch(() => {})
  } catch (error) {
    // Silent fail for audio playback
  }
}
