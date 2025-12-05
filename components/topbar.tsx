'use client'

import { Moon, Sun, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSound } from '@/hooks/use-sound'

export default function Topbar() {
  const [isDark, setIsDark] = useState(false)
  const { play } = useSound()

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    play('tap')
    const html = document.documentElement
    if (html.classList.contains('dark')) {
      html.classList.remove('dark')
      setIsDark(false)
    } else {
      html.classList.add('dark')
      setIsDark(true)
    }
  }

  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-16 border-b border-white/10 dark:border-white/5 bg-white/50 dark:bg-white/5 backdrop-blur-sm flex items-center justify-between px-8"
    >
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <h2 className="text-sm font-medium text-foreground/90">Welcome back</h2>
      </motion.div>
      
      <div className="flex items-center gap-2">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => play('tap')}
            className="w-9 h-9"
          >
            <motion.div animate={{ y: [0, -1, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <Bell className="w-4 h-4" />
            </motion.div>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="outline" 
            size="icon"
            onClick={toggleTheme}
            className="w-9 h-9"
          >
            <motion.div
              initial={false}
              animate={{ rotate: isDark ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.div>
          </Button>
        </motion.div>
      </div>
    </motion.header>
  )
}
