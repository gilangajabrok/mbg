'use client'

import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useSound } from '@/hooks/use-sound'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  const { play } = useSound()

  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-1 text-sm text-foreground/60 mb-6"
    >
      <Link
        href="/"
        onClick={() => play('tap')}
        className="flex items-center gap-1 hover:text-foreground/90 transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>

      {items.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: (idx + 1) * 0.05 }}
          className="flex items-center gap-1"
        >
          <ChevronRight className="w-4 h-4 text-foreground/40" />
          {item.href ? (
            <Link
              href={item.href}
              onClick={() => play('tap')}
              className="hover:text-foreground/90 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground/90 font-medium">{item.label}</span>
          )}
        </motion.div>
      ))}
    </motion.nav>
  )
}
