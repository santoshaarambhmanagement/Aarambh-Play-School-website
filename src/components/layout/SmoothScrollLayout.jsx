// src/components/layout/SmoothScrollLayout.jsx
import { useEffect } from 'react'
import Lenis from 'lenis'
import { frame } from 'motion'

export default function SmoothScrollLayout({ children }) {
  useEffect(() => {
    // Initialize Lenis without auto-requestAnimationFrame
    const lenis = new Lenis({ autoRaf: false })
    
    // Sync Lenis with Framer Motion's frame loop for perfect performance
    const update = ({ timestamp }) => lenis.raf(timestamp)
    frame.setup(update, true)

    return () => lenis.destroy()
  }, [])

  // This layout doesn't render any visible UI, it just wraps the app in scroll physics
  return <>{children}</>
}