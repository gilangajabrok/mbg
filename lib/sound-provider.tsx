'use client'

import React, { createContext, useContext, useState } from 'react'

interface SoundContextType {
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  playSound: (type: 'click' | 'hover' | 'success' | 'error' | 'whoosh') => void
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

// Simple sound generation using Web Audio API
const generateSound = (type: 'click' | 'hover' | 'success' | 'error' | 'whoosh') => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const now = audioContext.currentTime

  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  gainNode.gain.setValueAtTime(0.1, now)
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1)

  switch (type) {
    case 'click':
      oscillator.frequency.setValueAtTime(800, now)
      oscillator.start(now)
      oscillator.stop(now + 0.05)
      break
    case 'hover':
      oscillator.frequency.setValueAtTime(600, now)
      oscillator.start(now)
      oscillator.stop(now + 0.03)
      break
    case 'success':
      oscillator.frequency.setValueAtTime(1200, now)
      oscillator.start(now)
      oscillator.stop(now + 0.08)
      break
    case 'error':
      oscillator.frequency.setValueAtTime(300, now)
      oscillator.start(now)
      oscillator.stop(now + 0.1)
      break
    case 'whoosh':
      oscillator.frequency.setValueAtTime(400, now)
      oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.15)
      oscillator.start(now)
      oscillator.stop(now + 0.15)
      break
  }
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true)

  const playSound = (type: 'click' | 'hover' | 'success' | 'error' | 'whoosh') => {
    if (soundEnabled) {
      try {
        generateSound(type)
      } catch (e) {
        // Audio context might not be available
      }
    }
  }

  return (
    <SoundContext.Provider value={{ soundEnabled, setSoundEnabled, playSound }}>
      {children}
    </SoundContext.Provider>
  )
}

export function useSound() {
  const context = useContext(SoundContext)
  if (!context) {
    throw new Error('useSound must be used within SoundProvider')
  }
  return context
}
