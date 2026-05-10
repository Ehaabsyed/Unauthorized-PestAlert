'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface LogoProps {
  /** Size of the logo mark in px (square). Defaults to 40. */
  size?: number
  /** Show the "AgriTech / Sentinel" wordmark beside the icon. Defaults to true. */
  showText?: boolean
  /** Animate on mount with fade+scale. Defaults to false. */
  animate?: boolean
  /** Additional class names for the outer wrapper. */
  className?: string
  /**
   * Colour variant for the wordmark text.
   * - 'default'  → follows foreground / primary tokens (auto light/dark)
   * - 'sidebar'  → sidebar-foreground / sidebar-primary tokens (always on dark bg)
   * - 'light'    → hardcoded white (for use on coloured / dark hero sections)
   */
  variant?: 'default' | 'sidebar' | 'light'
  /**
   * Force a specific logo image regardless of the current theme.
   * - 'auto'     → picks green logo on light, white logo on dark (default)
   * - 'green'    → /logo.png (green mark, white bg — good on light surfaces)
   * - 'white'    → /logo-white.png (all-white — good on dark surfaces)
   */
  logoVariant?: 'auto' | 'green' | 'white'
}

export function Logo({
  size = 40,
  showText = true,
  animate = false,
  className,
  variant = 'default',
  logoVariant = 'auto',
}: LogoProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Choose the right logo image
  const logoSrc = (() => {
    if (logoVariant === 'green') return '/logo.png'
    if (logoVariant === 'white') return '/logo-white.png'
    // 'auto' — during SSR always use green (no flash)
    if (!mounted) return '/logo.png'
    return resolvedTheme === 'dark' ? '/logo-white.png' : '/logo.png'
  })()

  // Wordmark text colours per variant
  const textColors: Record<NonNullable<LogoProps['variant']>, { primary: string; sub: string }> = {
    default: {
      primary: 'text-foreground dark:text-white',
      sub: 'text-primary dark:text-primary',
    },
    sidebar: {
      primary: 'text-sidebar-foreground',
      sub: 'text-sidebar-primary',
    },
    light: {
      primary: 'text-white',
      sub: 'text-white/70',
    },
  }

  const colors = textColors[variant]

  const Wrapper = animate ? motion.div : 'div'
  const wrapperProps = animate
    ? {
        initial: { opacity: 0, scale: 0.88 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] },
      }
    : {}

  return (
    <Wrapper
      {...(wrapperProps as object)}
      className={cn('flex items-center gap-2.5 group select-none', className)}
    >
      {/* Logo mark */}
      <div
        className="relative flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(94,156,18,0.6)]"
        style={{ width: size, height: size }}
      >
        <Image
          src={logoSrc}
          alt="AgriTech Sentinel"
          width={size}
          height={size}
          quality={100}
          priority
          className="object-contain"
          style={{ imageRendering: 'crisp-edges' }}
          suppressHydrationWarning
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={cn('font-bold tracking-tight leading-none', colors.primary)}
            style={{ fontSize: Math.round(size * 0.36) }}
          >
            AgriTech
          </span>
          <span
            className={cn(
              'font-semibold tracking-[0.18em] uppercase leading-none mt-[3px]',
              colors.sub
            )}
            style={{ fontSize: Math.round(size * 0.24) }}
          >
            Sentinel
          </span>
        </div>
      )}
    </Wrapper>
  )
}
