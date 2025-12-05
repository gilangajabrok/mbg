'use client'

import { useEffect, useRef } from 'react'

type SoundType = 'tap' | 'whoosh' | 'chime' | 'error'

const SOUND_MAP: Record<SoundType, string> = {
  tap: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==',
  whoosh: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==',
  chime: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==',
  error: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==',
}

export function useSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.volume = 0.15 // Very subtle volume
    }
  }, [])

  const play = (soundType: SoundType) => {
    if (!audioRef.current) return
    try {
      audioRef.current.src = SOUND_MAP[soundType]
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {
        // Silently fail if audio can't play (user hasn't interacted yet)
      })
    } catch (error) {
      // Silently fail in case of errors
    }
  }

  return { play }
}
