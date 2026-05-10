'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface SplashScreenProps {
  /** Duration in ms before the splash hides. Defaults to 1800. */
  duration?: number
}

export function SplashScreen({ duration = 1800 }: SplashScreenProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration)
    return () => clearTimeout(timer)
  }, [duration])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: '#0B1F0B' }}
        >
          {/* Radial glow backdrop */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(94,156,18,0.18) 0%, transparent 70%)',
            }}
          />

          {/* Logo mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.72, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative"
          >
            {/* Glow ring behind logo */}
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full"
              style={{
                boxShadow: '0 0 60px 20px rgba(94, 156, 18, 0.5)',
                transform: 'scale(0.85)',
              }}
            />
            <Image
              src="/logo-white.png"
              alt="AgriTech Sentinel"
              width={140}
              height={140}
              quality={100}
              priority
              className="object-contain relative z-10"
            />
          </motion.div>

          {/* Wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3, ease: 'easeOut' }}
            className="mt-6 text-center"
          >
            <p className="text-white text-2xl font-bold tracking-tight leading-none">
              AgriTech
            </p>
            <p
              className="tracking-[0.28em] uppercase font-semibold leading-none mt-1.5"
              style={{ color: '#8BC34A', fontSize: '0.85rem' }}
            >
              Sentinel
            </p>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.55, ease: 'easeOut' }}
            className="mt-3 text-xs font-medium tracking-widest uppercase"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            AI-Powered Agricultural Intelligence
          </motion.p>

          {/* Progress bar */}
          <motion.div
            className="absolute bottom-10 w-32 h-0.5 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >
            <motion.div
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: (duration - 400) / 1000, delay: 0.3, ease: 'linear' }}
              className="h-full rounded-full"
              style={{ background: '#5E9C12' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
