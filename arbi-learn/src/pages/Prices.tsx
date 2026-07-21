import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, TrendingUp, TrendingDown, Fuel, Coins, Radio, Bitcoin, Boxes, Hexagon, Circle, AlertTriangle } from 'lucide-react'
import Reveal from '../components/ui/Reveal'

/* ── Types ────────────────────────────────────────────── */
interface CoinData {
  usd: number
  usd_24h_change: number
}

type PriceMap = Record<string, CoinData>

/* ── Coin config ──────────────────────────────────────── */
const COINS = [
  { id: 'bitcoin',  name: 'Bitcoin',  symbol: 'BTC', icon: Bitcoin, cls: 'btc', accent: '#f97316', accentDim: '#c2410c' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', icon: Boxes, cls: 'eth', accent: '#5B5EFF', accentDim: '#4338ca' },
  { id: 'solana',   name: 'Solana',   symbol: 'SOL', icon: Circle, cls: 'sol', accent: '#a855f7', accentDim: '#7c3aed' },
  { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB', icon: Hexagon, cls: 'arb', accent: '#3b82f6', accentDim: '#1d4ed8' },
]

const API = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,arbitrum&vs_currencies=usd&include_24hr_change=true'

/* ── Helpers ──────────────────────────────────────────── */
function fmtPrice(p: number) {
  if (p >= 1000) return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (p >= 1)    return p.toFixed(2)
  return p.toFixed(4)
}

/* ── Sparkline bars ───────────────────────────────────── */
function Sparkline({ change, accent }: { change: number; accent: string }) {
  const bars = Array.from({ length: 7 }, (_, i) => {
    const base = 30 + (i / 6) * 70
    const wave = Math.sin((i + 2) * 1.4) * 25
    return Math.max(8, Math.min(100, base + wave))
  })

  return (
    <div className="flex items-end gap-0.5 h-8 mt-2">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${h}%` }}
          transition={{ delay: i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 rounded-sm"
          style={{ background: change >= 0 ? `${accent}60` : '#ef444460' }}
        />
      ))}
    </div>
  )
}

/* ── Price card ───────────────────────────────────────── */
function PriceCard({ coin, data, updated }: {
  coin: typeof COINS[0]
  data: CoinData
  updated: boolean
}) {
  const isUp = data.usd_24h_change >= 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className={`glass relative overflow-hidden p-6 flex flex-col gap-4 ${updated ? 'card-updated' : ''}`}
      style={{ borderTop: `2px solid ${coin.accent}30` }}
    >
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5"
           style={{ background: coin.accent, filter: 'blur(32px)' }} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold"
               style={{ background: `${coin.accent}15`, border: `1px solid ${coin.accent}20` }}>
            <coin.icon size={20} className="text-white opacity-90" />
          </div>
          <div>
            <div className="font-display font-bold text-white text-sm">{coin.name}</div>
            <div className="text-muted text-xs font-mono">{coin.symbol}</div>
          </div>
        </div>

        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
          isUp ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
        }`}>
          {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {isUp ? '+' : ''}{data.usd_24h_change.toFixed(2)}%
        </div>
      </div>

      {/* Price */}
      <div>
        <AnimatePresence mode="wait">
          <motion.div
            key={data.usd}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="font-mono font-bold text-white"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}
          >
            ${fmtPrice(data.usd)}
          </motion.div>
        </AnimatePresence>
        <div className="text-muted text-xs mt-0.5">USD</div>
      </div>

      {/* Sparkline */}
      <Sparkline change={data.usd_24h_change} accent={coin.accent} />

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[10px] text-muted">
        <span>24h change</span>
        <span className="font-mono">{new Date().toLocaleTimeString()}</span>
      </div>
    </motion.div>
  )
}

/* ── Loading skeleton ─────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="glass p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-border" />
        <div className="space-y-1.5">
          <div className="h-3 w-20 rounded bg-border" />
          <div className="h-2 w-12 rounded bg-border" />
        </div>
      </div>
      <div className="h-7 w-32 rounded bg-border mb-2" />
      <div className="flex items-end gap-0.5 h-8 mt-3">
        {[40, 70, 55, 80, 45, 65, 90].map((h, i) => (
          <div key={i} className="flex-1 rounded-sm bg-border" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────── */
export default function Prices() {
  const [prices, setPrices]     = useState<PriceMap | null>(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [lastUpd, setLastUpd]   = useState<string>('')
  const [countdown, setCd]      = useState(60)
  const [updated, setUpdated]   = useState<string>('')

  const fetchPrices = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(API)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: PriceMap = await res.json()
      setPrices(data)
      setLastUpd(new Date().toLocaleTimeString())
      setCd(60)
      // Flash all cards
      COINS.forEach(c => {
        setUpdated(c.id)
        setTimeout(() => setUpdated(''), 700)
      })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPrices() }, [fetchPrices])

  useEffect(() => {
    const t = setInterval(() => {
      setCd(c => {
        if (c <= 1) { fetchPrices(); return 60 }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [fetchPrices])

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <Reveal>
          <p className="section-label mb-3">Live Data</p>
          <h1 className="font-display font-bold text-white" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            Crypto <span className="text-gradient">Price Dashboard</span>
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-muted">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live data
            </div>
            <span>Source: <a href="https://www.coingecko.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-white transition-colors">CoinGecko</a></span>
            {lastUpd && <span className="font-mono">Updated: {lastUpd}</span>}
          </div>
        </Reveal>

        <Reveal delay={0.1} direction="left">
          <div className="flex items-center gap-3">
            <div className="glass px-4 py-2 text-xs text-muted flex items-center gap-2 rounded-xl">
              <Radio size={12} className="text-accent" />
              Refreshing in <span className="font-mono font-bold text-accent">{countdown}s</span>
            </div>
            <button
              onClick={fetchPrices}
              disabled={loading}
              className="btn-glow text-xs px-4 py-2 disabled:opacity-60"
              aria-label="Refresh prices"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </Reveal>
      </div>

      {/* Cards */}
      {error ? (
        <div className="glass border-red-500/20 bg-red-500/3 p-12 text-center">
          <div className="flex justify-center mb-4"><AlertTriangle size={32} className="text-red-400 opacity-80" /></div>
          <h3 className="font-display font-bold text-red-400 text-xl mb-2">Failed to fetch prices</h3>
          <p className="text-muted text-sm mb-6">{error}</p>
          <button onClick={fetchPrices} className="btn-outline text-sm">Try Again</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {prices
            ? COINS.map(coin => (
                <PriceCard
                  key={coin.id}
                  coin={coin}
                  data={prices[coin.id] || { usd: 0, usd_24h_change: 0 }}
                  updated={updated === coin.id}
                />
              ))
            : Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16">
        {[
          { icon: Fuel,   title: 'Gas Cost Awareness',    color: 'text-primary',   desc: 'ETH price directly affects gas costs on Ethereum L1. On Arbitrum, gas is paid in ETH too — but at a fraction of the cost. Track ETH to estimate deployment costs.' },
          { icon: Coins,  title: 'ARB Token Governance',  color: 'text-secondary', desc: 'ARB is the native token of Arbitrum — used for governance votes. Holders decide protocol upgrades, grants, and the future of the network.' },
          { icon: Radio,  title: 'CoinGecko API',         color: 'text-accent',    desc: 'This dashboard uses CoinGecko\'s free public API — a rite of passage for Web3 developers. Fetching on-chain data with no API key is your first step.' },
        ].map(({ icon: Icon, title, color, desc }, i) => (
          <Reveal key={title} delay={i * 0.1}>
            <div className="glass-hover p-6 h-full">
              <Icon size={20} className={`${color} mb-3`} />
              <h3 className="font-display font-semibold text-white text-sm mb-2">{title}</h3>
              <p className="text-muted text-xs leading-relaxed">{desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
