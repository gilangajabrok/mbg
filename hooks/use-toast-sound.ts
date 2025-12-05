'use client'

import { useSound } from './use-sound'
import { useToast } from '@/hooks/use-toast'

type ToastVariant = 'default' | 'destructive' | 'success'

export function useToastWithSound() {
  const { toast } = useToast()
  const { play } = useSound()

  return (props: Parameters<typeof toast>[0]) => {
    const variant = (props as any).variant as ToastVariant || 'default'
    
    // Play appropriate sound based on variant
    if (variant === 'destructive') {
      play('error')
    } else if (variant === 'success') {
      play('chime')
    } else {
      play('tap')
    }

    return toast(props)
  }
}
