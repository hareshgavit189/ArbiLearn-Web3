import { useEffect, useRef, type ReactNode } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'

interface RevealProps {
  children: ReactNode
  delay?: number
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale'
}

export default function Reveal({ children, delay = 0, className = '', direction = 'up' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px 0px' })
  const controls = useAnimation()

  const variants = {
    hidden: {
      opacity: 0,
      y:     direction === 'up'    ? 24 : direction === 'down'  ? -24 : 0,
      x:     direction === 'left'  ? 24 : direction === 'right' ? -24 : 0,
      scale: direction === 'scale' ? 0.95 : 1,
    },
    visible: { opacity: 1, y: 0, x: 0, scale: 1 },
  }

  useEffect(() => {
    if (inView) controls.start('visible')
  }, [inView, controls])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
