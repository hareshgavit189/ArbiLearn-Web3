import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Hexagon } from 'lucide-react'

const NAV_LINKS = [
  { to: '/',           label: 'Home' },
  { to: '/concepts',   label: 'Concepts' },
  { to: '/prices',     label: 'Live Prices' },
  { to: '/simulator',  label: 'Simulator' },
]

export default function Navbar() {
  const location  = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open,     setOpen]     = useState(false)
  const prevY = useRef(0)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 20)
      setHidden(y > prevY.current && y > 100)
      prevY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [location.pathname])

  return (
    <>
      <motion.header
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 inset-x-0 z-[100] transition-all duration-300
          ${scrolled
            ? 'bg-bg/80 backdrop-blur-2xl border-b border-white/[0.05] shadow-[0_4px_32px_rgba(0,0,0,0.4)]'
            : 'bg-transparent'
          }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" aria-label="ArbiLearn home">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-sm shadow-glow-primary transition-transform duration-300 group-hover:scale-110">
              <Hexagon size={16} className="text-bg" />
            </div>
            <div className="leading-none">
              <div className="font-display font-bold text-sm text-white">ArbiLearn</div>
              <div className="text-[10px] text-muted tracking-widest uppercase">Web3 Education</div>
            </div>
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map(({ to, label }) => {
              const active = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${active ? 'text-white' : 'text-muted hover:text-white'}`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg bg-white/[0.07] border border-white/[0.08]"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </Link>
              )
            })}
          </nav>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-3">
            <a
              href="https://sepolia.arbiscan.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex btn-glow text-xs px-4 py-2"
            >
              Explorer ↗
            </a>
            <button
              onClick={() => setOpen(v => !v)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:text-white hover:bg-white/[0.06] transition-all"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 z-[95] w-72 bg-surface border-l border-border flex flex-col p-6 md:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="font-display font-bold text-gradient">ArbiLearn</div>
                <button onClick={() => setOpen(false)} className="text-muted hover:text-white" aria-label="Close menu">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
                {NAV_LINKS.map(({ to, label }, i) => (
                  <motion.div
                    key={to}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <Link
                      to={to}
                      className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all
                        ${location.pathname === to
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'text-muted hover:text-white hover:bg-white/[0.04]'
                        }`}
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-auto">
                <a href="https://sepolia.arbiscan.io/" target="_blank" rel="noopener noreferrer"
                   className="btn-glow w-full justify-center text-xs">
                  Arbiscan Explorer ↗
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
