import { motion } from 'framer-motion'
import { ArrowRight, Zap, ExternalLink, TrendingDown, Clock, Flame, CircleDollarSign, LineChart, ShieldCheck, Cpu, Search, Droplet, FileText, Link as LinkIcon, Hexagon, BookOpen, BarChart2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Reveal from '../components/ui/Reveal'

import React from 'react'

/* ── Hero section ─────────────────────────────────────── */
function Hero() {
  const words = ['Layer 2.', 'Arbitrum.', 'Web3.']
  const [wordIdx, setWordIdx] = React.useState(0)

  React.useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % words.length), 2800)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Grid texture */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#5B5EFF 1px, transparent 1px), linear-gradient(to right, #5B5EFF 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

      <div className="relative max-w-[1200px] mx-auto px-6 py-24 w-full">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/25 bg-primary/8 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
            <span className="text-xs font-semibold text-primary tracking-wider uppercase">Arbitrum Builder Labs · 2025</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-balance leading-[1.06] mb-6"
            style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
          >
            <span className="text-white">Build on</span>
            <br />
            <span className="text-gradient">
              <motion.span
                key={wordIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                {words[wordIdx]}
              </motion.span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-muted text-lg md:text-xl leading-relaxed max-w-xl mb-10"
          >
            A beginner-friendly guide to Web3 — from blockchain fundamentals to live
            crypto data and interactive mining, all powered by Arbitrum.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/concepts" className="btn-glow group">
              Explore Concepts
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/simulator" className="btn-outline group">
              Try Block Simulator
              <ArrowRight size={16} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-8 mt-16 pt-10 border-t border-border/60"
          >
            {[
              { value: '40,000', suffix: '+', label: 'Transactions/sec', icon: Zap, color: 'text-accent' },
              { value: '90',     suffix: '%',  label: 'Lower Gas Fees',  icon: TrendingDown, color: 'text-secondary' },
              { value: '0.25',   suffix: 's',  label: 'Avg Block Time',  icon: Clock,        color: 'text-primary' },
            ].map(({ value, suffix, label, icon: Icon, color }) => (
              <div key={label}>
                <div className={`font-display font-bold text-3xl ${color} leading-none mb-1`}>
                  {value}<span className="text-xl">{suffix}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <Icon size={12} />
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-muted/40 to-transparent" />
        <span className="text-[10px] text-muted tracking-widest uppercase">Scroll</span>
      </motion.div>
    </section>
  )
}

/* ── Why L2 section ───────────────────────────────────── */
function WhyL2() {
  const cards = [
    {
      icon: Flame,
      title: 'Network Congestion',
      desc: 'Ethereum handles ~15 TPS. During peak demand — NFT drops, DeFi events — the network grinds to a halt and transactions queue for hours.',
      color: 'from-red-500/5 to-transparent',
      border: 'border-red-500/20',
    },
    {
      icon: CircleDollarSign,
      title: 'Skyrocketing Gas Fees',
      desc: 'A simple token swap can cost $50–$200 in gas during congestion. This makes Ethereum inaccessible for everyday users and learners.',
      color: 'from-yellow-500/5 to-transparent',
      border: 'border-yellow-500/20',
    },
    {
      icon: LineChart,
      title: 'Scalability Ceiling',
      desc: 'For Web3 to reach billions of users, the infrastructure needs millions of TPS — not 15. Ethereum\'s design prevents scaling without sacrificing security.',
      color: 'from-primary/5 to-transparent',
      border: 'border-primary/20',
    },
  ]

  return (
    <section className="py-24 relative">
      <div className="max-w-[1200px] mx-auto px-6">
        <Reveal>
          <p className="section-label mb-4">The Problem</p>
          <h2 className="font-display font-bold text-white mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Why Ethereum Needed <span className="text-gradient">Layer 2</span>
          </h2>
          <p className="text-muted max-w-lg mb-14">
            Ethereum is the most secure smart contract platform — but at peak demand, it struggles.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.1} direction="scale">
              <div className={`glass-hover p-8 bg-gradient-to-br ${card.color} border ${card.border} h-full`}>
                <div className="mb-4"><card.icon size={28} className="text-white opacity-80" /></div>
                <h3 className="font-display font-bold text-white text-lg mb-3">{card.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{card.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Arbitrum explainer ───────────────────────────────── */
function ArbitrumExplainer() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <Reveal>
              <p className="section-label mb-4">The Solution</p>
              <h2 className="font-display font-bold text-white mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                What is <span className="text-gradient">Arbitrum?</span>
              </h2>
              <p className="text-muted leading-relaxed mb-8">
                Arbitrum is a Layer 2 scaling solution using <span className="text-primary font-medium">Optimistic Rollup</span> technology.
                It processes thousands of transactions off-chain and posts compressed proofs to Ethereum — inheriting its full security.
              </p>
            </Reveal>

            <div className="space-y-4">
              {[
                { icon: Zap, title: '40,000+ TPS', desc: 'vs Ethereum\'s 15 TPS', color: 'text-accent' },
                { icon: CircleDollarSign, title: '90% Cheaper',  desc: 'Gas fees vs mainnet',   color: 'text-secondary' },
                { icon: ShieldCheck, title: 'L1 Security',  desc: 'Secured by Ethereum',   color: 'text-primary' },
                { icon: Cpu, title: 'EVM Native',   desc: 'Zero code changes',      color: 'text-accent' },
              ].map((item, i) => (
                <Reveal key={item.title} delay={i * 0.08}>
                  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-border">
                    <div className="w-9 h-9 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-base flex-shrink-0">
                      <item.icon size={16} className="text-muted" />
                    </div>
                    <div>
                      <div className={`font-semibold text-sm ${item.color}`}>{item.title}</div>
                      <div className="text-muted text-xs mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Rollup diagram */}
          <Reveal direction="left" delay={0.2}>
            <div className="glass p-8 space-y-3">
              <p className="text-xs font-bold text-muted tracking-widest uppercase mb-6">Optimistic Rollup Architecture</p>

              {[
                { label: 'Layer 2', name: 'Arbitrum', detail: 'Transactions execute here', color: 'border-primary/30 bg-primary/5', badge: 'bg-primary/10 text-primary' },
                null,
                { label: 'Bridge', name: 'Rollup Proof', detail: 'Compressed data + fraud window', color: 'border-yellow-500/20 bg-yellow-500/3', badge: 'bg-yellow-500/10 text-yellow-400', small: true },
                null,
                { label: 'Layer 1', name: 'Ethereum Mainnet', detail: 'Settlement & security anchor', color: 'border-secondary/30 bg-secondary/5', badge: 'bg-secondary/10 text-secondary' },
              ].map((layer, i) =>
                layer === null ? (
                  <div key={i} className="flex flex-col items-center py-1">
                    <div className="w-px h-6 bg-gradient-to-b from-primary/40 to-secondary/30" />
                    <span className="text-xs text-muted py-0.5">⬇</span>
                  </div>
                ) : (
                  <div key={layer.label} className={`border ${layer.color} rounded-xl p-4 ${layer.small ? 'py-2 text-center' : ''}`}>
                    <div className={`inline-flex text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${layer.badge} mb-2`}>
                      {layer.label}
                    </div>
                    <div className="font-display font-bold text-white text-sm">{layer.name}</div>
                    {!layer.small && <div className="text-muted text-xs mt-0.5">{layer.detail}</div>}
                    {layer.small && <div className="text-muted text-xs">{layer.detail}</div>}
                  </div>
                )
              )}

              <div className="mt-4 p-3 rounded-lg bg-accent/5 border border-accent/15">
                <div className="text-xs text-accent font-semibold mb-0.5">✓ Real-World Benefit</div>
                <div className="text-xs text-muted">Deploy on Arbitrum Sepolia for free — same Solidity, zero mainnet cost.</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ── Comparison table ─────────────────────────────────── */
function ComparisonTable() {
  const rows = [
    { feature: 'Avg Gas Fee',           arb: '~$0.01–$0.10',   eth: '$5–$100+',      arbGood: true },
    { feature: 'Transactions/sec',      arb: '40,000+ TPS',    eth: '~15 TPS',       arbGood: true },
    { feature: 'Block Time',            arb: '~0.25 seconds',  eth: '~12 seconds',   arbGood: true },
    { feature: 'Security Model',        arb: 'Ethereum L1',    eth: 'Native PoS',    arbGood: true },
    { feature: 'EVM Compatible',        arb: '✓ Fully',        eth: '✓ Native',      arbGood: true },
    { feature: 'Final Settlement',      arb: '~7 day window',  eth: '~12 minutes',   arbGood: false },
    { feature: 'Best Use Case',         arb: 'DeFi / dApps',   eth: 'High-value txns', arbGood: true },
  ]

  return (
    <section className="py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <Reveal className="mb-12">
          <p className="section-label mb-4">At a Glance</p>
          <h2 className="font-display font-bold text-white" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Arbitrum vs <span className="text-gradient">Ethereum Mainnet</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="glass overflow-hidden">
            <table className="w-full text-sm" aria-label="Arbitrum vs Ethereum comparison">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-5 text-xs font-bold text-muted tracking-widest uppercase w-1/3">Feature</th>
                  <th className="text-left p-5 text-xs font-bold text-primary tracking-widest uppercase">Arbitrum</th>
                  <th className="text-left p-5 text-xs font-bold text-secondary tracking-widest uppercase">Ethereum</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <motion.tr
                    key={row.feature}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-border/50 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-5 font-semibold text-white text-xs">{row.feature}</td>
                    <td className={`p-5 font-medium ${row.arbGood ? 'text-accent' : 'text-yellow-400'}`}>{row.arb}</td>
                    <td className={`p-5 text-muted`}>{row.eth}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ── Resources band ───────────────────────────────────── */
function Resources() {
  const links = [
    { label: 'Arbiscan Explorer', href: 'https://sepolia.arbiscan.io/', icon: Search },
    { label: 'LamprosDAO Faucet', href: 'https://faucet.lamprosdao.com/', icon: Droplet },
    { label: 'Sample Transaction', href: 'https://sepolia.arbiscan.io/tx/0x9bd03034b13299ca0bf0d316b3b407e1bf0ca2250a725b99753457a6bb054ba8', icon: FileText },
    { label: 'Blockchain Visual Demo', href: 'https://andersbrownworth.com/blockchain/', icon: LinkIcon },
    { label: 'MetaMask Setup Guide', href: 'https://github.com/purvik6062/session-guide/blob/main/metamask/README.md', icon: Hexagon },
    { label: 'XCAN Register', href: 'https://www.xcan.dev/builder-pods/register?token=47a5f21f2b9fe5dfaf728a99da97d5a6', icon: ShieldCheck },
  ]

  return (
    <section className="py-16 border-y border-border bg-surface/30">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="text-center text-xs text-muted tracking-widest uppercase mb-8 font-semibold">
          Ecosystem Resources
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          {links.map(link => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2, scale: 1.02 }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                         text-muted border border-border hover:text-white hover:border-muted/50
                         hover:bg-surface-2 transition-colors bg-surface"
            >
              <link.icon size={14} className="opacity-70" />
              {link.label}
              <ExternalLink size={11} className="opacity-50" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── CTA ──────────────────────────────────────────────── */
function CTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-[700px] mx-auto px-6 text-center relative">
        <Reveal>
          <h2 className="font-display font-bold text-white mb-4" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}>
            Ready to go deeper?
          </h2>
          <p className="text-muted text-lg mb-10 max-w-md mx-auto">
            Explore all four modules — from core concepts to live data and hands-on blockchain simulation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/concepts"  className="btn-glow group"><BookOpen size={16} /> Web3 Concepts <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" /></Link>
            <Link to="/prices"    className="btn-outline"><BarChart2 size={16} /> Live Prices</Link>
            <Link to="/simulator" className="btn-outline"><Cpu size={16} /> Block Simulator</Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ── Page ─────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <Hero />
      <div className="gradient-divider" />
      <WhyL2 />
      <div className="gradient-divider" />
      <ArbitrumExplainer />
      <div className="gradient-divider" />
      <ComparisonTable />
      <Resources />
      <CTA />
    </>
  )
}
