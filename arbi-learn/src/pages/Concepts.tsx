import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Scale, LockOpen, Lock, Key, Database, Link as LinkIcon, RefreshCw, Undo2 } from 'lucide-react'
import Reveal from '../components/ui/Reveal'

/* ── Flip card ────────────────────────────────────────── */
interface FlipCardProps {
  title: string
  subtitle: string
  icon: React.ElementType
  leftLabel: string
  rightLabel: string
  leftSub: string
  rightSub: string
  accentColor: string
  rows: { label: string; a: string; b: string }[]
  summary: string
}

function FlipCard({ title, subtitle, icon: Icon, leftLabel, rightLabel, leftSub, rightSub, accentColor, rows, summary }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className="perspective cursor-pointer group"
      style={{ minHeight: 360 }}
      onClick={() => setFlipped(f => !f)}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setFlipped(f => !f)}
      tabIndex={0}
      role="button"
      aria-label={`${title} flip card. ${flipped ? 'Click to see summary' : 'Click to see comparison'}`}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative preserve-3d w-full h-full"
        style={{ minHeight: 360 }}
      >
        {/* Front */}
        <div className="backface-hidden absolute inset-0 glass p-8 flex flex-col" style={{ borderTop: `2px solid ${accentColor}30` }}>
          <div className="mb-4 text-white opacity-80"><Icon size={40} /></div>
          <h3 className="font-display font-bold text-white text-xl mb-2">{title}</h3>
          <p className="text-muted text-sm mb-6">{subtitle}</p>

          {/* VS split */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center mt-auto">
            <div className="bg-primary/8 border border-primary/15 rounded-xl p-4 text-center">
              <div className="text-[10px] font-bold text-primary tracking-widest uppercase mb-1">{leftLabel}</div>
              <div className="font-display font-bold text-white text-sm">{leftSub}</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface-2 border border-border flex items-center justify-center text-[10px] font-black text-muted">VS</div>
            <div className="bg-secondary/8 border border-secondary/15 rounded-xl p-4 text-center">
              <div className="text-[10px] font-bold text-secondary tracking-widest uppercase mb-1">{rightLabel}</div>
              <div className="font-display font-bold text-white text-sm">{rightSub}</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-muted mt-4 self-end">
            <RefreshCw size={10} /> Click to compare
          </div>
        </div>

        {/* Back */}
        <div className="backface-hidden rotate-y-180 absolute inset-0 glass-hover bg-surface-2/60 p-6 flex flex-col overflow-auto">
          <p className="font-display font-bold text-white text-sm mb-4 pb-3 border-b border-border">
            {title} — Side by Side
          </p>
          <div className="space-y-0.5 flex-1">
            {/* Header */}
            <div className="grid grid-cols-3 gap-2 text-[10px] font-bold tracking-widest uppercase text-muted mb-2">
              <span>Feature</span>
              <span style={{ color: accentColor }}>{leftLabel}</span>
              <span className="text-secondary">{rightLabel}</span>
            </div>
            {rows.map(row => (
              <div key={row.label} className="grid grid-cols-3 gap-2 py-2 border-b border-border/40 text-xs">
                <span className="text-muted font-medium">{row.label}</span>
                <span style={{ color: accentColor }} className="font-medium">{row.a}</span>
                <span className="text-secondary font-medium">{row.b}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10 text-xs text-muted leading-relaxed">
            💡 {summary}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted mt-3 self-end">
            <Undo2 size={10} /> Click to flip back
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Key visual ───────────────────────────────────────── */
function KeyVisual() {
  return (
    <Reveal>
      <div className="glass p-8">
        <h3 className="font-display font-bold text-white text-xl mb-2">🔑 Public Key vs Private Key</h3>
        <p className="text-muted text-sm mb-8">Your identity and your access. One you share — one you guard with your life.</p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-center">
          {/* Public */}
          <div className="bg-secondary/5 border border-secondary/15 rounded-2xl p-6">
            <div className="mb-4 text-secondary opacity-90"><LockOpen size={32} /></div>
            <div className="font-semibold text-secondary text-sm mb-2">Public Key / Address</div>
            <p className="text-muted text-xs leading-relaxed mb-4">
              Your Ethereum address derived from your public key. Share this freely to receive ETH or tokens.
              Like your bank account number.
            </p>
            <div className="font-mono text-[10px] bg-bg rounded-lg p-3 text-muted break-all leading-relaxed border border-border">
              0x71C7656EC7ab88b098defB751B7401B5f6d8976F
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold text-secondary bg-secondary/10 border border-secondary/20">
              ✓ Safe to share publicly
            </div>
          </div>

          {/* Separator */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-border to-transparent hidden lg:block" />
            <div className="text-muted opacity-80"><Lock size={24} /></div>
            <div className="text-[10px] text-muted max-w-[8ch]">Cryptographic link</div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-border to-transparent hidden lg:block" />
          </div>

          {/* Private */}
          <div className="bg-primary/5 border border-primary/15 rounded-2xl p-6">
            <div className="mb-4 text-primary opacity-90"><Key size={32} /></div>
            <div className="font-semibold text-primary text-sm mb-2">Private Key / Seed Phrase</div>
            <p className="text-muted text-xs leading-relaxed mb-4">
              Master key to your wallet. <strong className="text-white">Never share it</strong> — not with MetaMask support,
              LamprosDAO, or anyone. Whoever has it controls your funds.
            </p>
            <div className="font-mono text-[10px] bg-bg rounded-lg p-3 text-muted border border-border select-none"
                 style={{ filter: 'blur(5px)', userSelect: 'none' }}>
              word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20">
              ⚠️ NEVER share this
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-border text-xs text-muted leading-relaxed">
          💡 <strong className="text-white">Think of it like email</strong>: your address is public — anyone can send you mail.
          Your password is private — it unlocks your inbox. In Web3, your private key unlocks your entire financial identity.
          <strong className="text-white"> MetaMask stores it locally; no one else should ever see it.</strong>
        </div>
      </div>
    </Reveal>
  )
}

/* ── Matrix table ─────────────────────────────────────── */
function MatrixTable() {
  const rows = [
    { feature: 'Control',              bc: 'Decentralized — no single owner',    db: 'Centralized — one company or server' },
    { feature: 'Immutability',         bc: '✓ Records cannot be altered',         db: '✗ Admins can modify records' },
    { feature: 'Transparency',         bc: '✓ All transactions are public',       db: '✗ Private, audit required' },
    { feature: 'Trust Model',          bc: 'Math + cryptography (trustless)',     db: 'Trust the database provider' },
    { feature: 'Speed',                bc: '~ Slower (consensus overhead)',       db: '✓ Very fast (milliseconds)' },
    { feature: 'Fault Tolerance',      bc: '✓ No single point of failure',        db: '✗ Server failure = downtime' },
    { feature: 'Censorship Resistance',bc: '✓ No one can block transactions',     db: '✗ Admin can freeze accounts' },
    { feature: 'Best For',             bc: 'Finance, ownership, identity',        db: 'Fast apps, private data' },
  ]

  return (
    <Reveal>
      <div className="glass overflow-hidden">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="flex -space-x-2 text-muted">
            <LinkIcon size={20} className="bg-surface relative z-10" />
            <Database size={20} className="bg-surface relative z-0 opacity-60" />
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-xl">Blockchain vs Traditional Database</h3>
            <p className="text-muted text-sm mt-1">Both store data — but their trust models are fundamentally different.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs" aria-label="Blockchain vs Traditional Database comparison">
            <thead>
              <tr className="border-b border-border bg-surface-2/50">
                <th className="text-left p-4 font-bold text-muted tracking-wider uppercase text-[10px]">Feature</th>
                <th className="text-left p-4 font-bold text-primary tracking-wider uppercase text-[10px]">Blockchain</th>
                <th className="text-left p-4 font-bold text-secondary tracking-wider uppercase text-[10px]">Traditional DB</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <motion.tr
                  key={row.feature}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-border/40 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="p-4 font-semibold text-white">{row.feature}</td>
                  <td className="p-4 text-muted">{row.bc}</td>
                  <td className="p-4 text-muted">{row.db}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-5 border-t border-border bg-primary/3">
          <p className="text-xs text-muted leading-relaxed">
            💡 <strong className="text-white">The key insight:</strong> A blockchain replaces trust in a company with
            trust in mathematics. You don't need to believe Arbitrum will behave honestly —
            the smart contract code guarantees it.
          </p>
        </div>
      </div>
    </Reveal>
  )
}

/* ── Page ─────────────────────────────────────────────── */
export default function Concepts() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-20 space-y-16">
      {/* Header */}
      <Reveal className="text-center max-w-xl mx-auto">
        <p className="section-label mb-4 justify-center">Reference Guide</p>
        <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
          Web3 <span className="text-gradient">Core Concepts</span>
        </h1>
        <p className="text-muted">
          Hover over each card to flip it and see a detailed comparison. These are the building blocks
          of everything you'll build on Arbitrum.
        </p>
      </Reveal>

      {/* Flip cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Reveal delay={0.05}>
          <FlipCard
            title="Web2 vs Web3"
            subtitle="The internet as we know it — vs the internet you own."
            icon={Globe}
            leftLabel="Web2" rightLabel="Web3"
            leftSub="Platform Owned" rightSub="User Owned"
            accentColor="#5B5EFF"
            rows={[
              { label: 'Data Ownership', a: 'Platforms (Google)', b: 'You (private keys)' },
              { label: 'Trust Model',    a: 'Centralized servers', b: 'Smart contracts' },
              { label: 'Identity',       a: 'Username/password', b: 'Wallet (0x...)' },
              { label: 'Payments',       a: 'Banks / PayPal', b: 'Native crypto' },
              { label: 'Censorship',     a: 'Company can ban you', b: 'Code is law' },
            ]}
            summary="In Web3, you interact with code directly — not companies. Your wallet is your identity and your bank."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <FlipCard
            title="Ethereum vs Bitcoin"
            subtitle="Both are blockchains — built for very different purposes."
            icon={Scale}
            leftLabel="Bitcoin" rightLabel="Ethereum"
            leftSub="Digital Gold" rightSub="World Computer"
            accentColor="#f97316"
            rows={[
              { label: 'Primary Purpose', a: 'Store of value',   b: 'Programmable platform' },
              { label: 'Smart Contracts', a: 'Limited / none',   b: '✓ Full EVM support' },
              { label: 'Consensus',       a: 'Proof of Work',    b: 'Proof of Stake' },
              { label: 'Block Time',      a: '~10 minutes',      b: '~12 seconds' },
              { label: 'Supply Cap',      a: '21 million BTC',   b: 'No hard cap' },
            ]}
            summary="Bitcoin is digital gold — scarce and trusted. Ethereum is the internet itself — a platform where anyone can build."
          />
        </Reveal>
      </div>

      {/* Key visual */}
      <KeyVisual />

      {/* Matrix table */}
      <MatrixTable />
    </div>
  )
}
