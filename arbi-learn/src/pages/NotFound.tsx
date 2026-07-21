import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-bg">
      <div className="text-center relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="font-mono font-bold text-[8rem] leading-none text-gradient opacity-30 mb-4 select-none">404</div>
          <h1 className="font-display font-bold text-3xl text-white mb-3">Page not found</h1>
          <p className="text-muted mb-8 max-w-xs mx-auto">
            This block doesn't exist in our chain. Let's get you back to a valid state.
          </p>
          <Link to="/" className="btn-glow">← Back to Home</Link>
        </motion.div>
      </div>
    </div>
  )
}
