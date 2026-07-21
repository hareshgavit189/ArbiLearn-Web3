import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pickaxe, RotateCcw, ExternalLink, Lightbulb, AlertOctagon, Hexagon } from 'lucide-react'
import Reveal from '../components/ui/Reveal'

/* ── SHA-256 via Web Crypto API ─────────────────────── */
async function sha256(msg: string): Promise<string> {
  const buf  = new TextEncoder().encode(msg)
  const hash = await window.crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function computeHash(idx: number, data: string, prevHash: string, nonce: number): Promise<string> {
  return sha256(`${idx}:${data}:${prevHash}:${nonce}`)
}

const GENESIS = '0000000000000000000000000000000000000000000000000000000000000000'
const PREFIX  = '00'

/* ── Block state type ──────────────────────────────── */
interface Block {
  index:    number
  data:     string
  prevHash: string
  nonce:    number
  hash:     string
  mined:    boolean
}

/* ── Hash display ──────────────────────────────────── */
function HashDisplay({ hash, valid }: { hash: string; valid: boolean | null }) {
  if (!hash) return <div className="hash-display text-muted/40 italic text-[11px]">Not yet computed…</div>

  const prefix = hash.slice(0, 2)
  const rest   = hash.slice(2)
  const cls    = valid === null ? '' : valid ? 'valid' : 'invalid'

  return (
    <div className={`hash-display ${cls} text-[11px] leading-relaxed`}>
      <span className={valid ? 'hash-prefix' : valid === false ? 'text-red-400' : 'text-muted'}>
        {prefix}
      </span>
      {rest}
    </div>
  )
}

/* ── Block card ────────────────────────────────────── */
interface BlockCardProps {
  block: Block
  onDataChange: (data: string) => void
  onNonceChange: (nonce: number) => void
  onMine: () => void
  mining: boolean
  nonceCount: number
}

function BlockCard({ block, onDataChange, onNonceChange, onMine, mining, nonceCount }: BlockCardProps) {
  const valid     = block.hash ? block.hash.startsWith(PREFIX) : null
  const cardClass = valid === true ? 'border-green-500/40 shadow-glow-accent' : valid === false ? 'border-red-500/40' : 'border-border'

  return (
    <motion.div
      layout
      className={`glass rounded-2xl overflow-hidden border-2 transition-all duration-500 ${cardClass}`}
    >
      {/* Block header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-2/50">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted">#{block.index}</span>
          <span className="font-display font-bold text-white text-sm">
            {block.index === 1 ? 'Block 1 — Genesis' : 'Block 2'}
          </span>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all duration-500 ${
          valid === true  ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
          valid === false ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                           'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
        }`}>
          <span>{valid === true ? '✓' : valid === false ? '✗' : '◌'}</span>
          {valid === true ? 'Valid' : valid === false ? 'Invalid' : 'Pending'}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-5">
        {/* Data */}
        <div>
          <label className="block text-[10px] font-bold text-muted tracking-widest uppercase mb-2">
            Block Data
          </label>
          <textarea
            value={block.data}
            onChange={e => onDataChange(e.target.value)}
            placeholder={block.index === 1 ? "e.g. 'Alice sends 5 ETH to Bob'" : "e.g. 'Bob sends 2 ETH to Carol'"}
            rows={2}
            className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm text-white
                       placeholder:text-muted/40 font-mono resize-none
                       focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
          {block.index === 1 && (
            <p className="text-[10px] text-muted mt-1.5">💡 Try changing this after mining to see the chain break</p>
          )}
        </div>

        {/* Prev hash */}
        <div>
          <label className="block text-[10px] font-bold text-muted tracking-widest uppercase mb-2">
            Previous Hash
            {block.index === 2 && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-[9px] bg-secondary/10 text-secondary border border-secondary/20 normal-case tracking-normal font-semibold">
                Auto — from Block 1
              </span>
            )}
          </label>
          <div className="bg-bg border border-border/50 rounded-xl px-4 py-3">
            <div className="font-mono text-[10px] text-muted/70 break-all leading-relaxed">
              {block.prevHash || '—'}
            </div>
          </div>
        </div>

        {/* Nonce + Mine */}
        <div>
          <label className="block text-[10px] font-bold text-muted tracking-widest uppercase mb-2">Nonce</label>
          <div className="flex gap-3">
            <input
              type="number"
              min={0}
              value={block.nonce}
              onChange={e => onNonceChange(parseInt(e.target.value) || 0)}
              className="flex-1 bg-bg border border-border rounded-xl px-4 py-2.5 text-sm font-mono text-white
                         focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
            <button
              onClick={onMine}
              disabled={mining}
              className="btn-glow text-xs px-4 py-2.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
            >
              {mining ? (
                <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mining…</>
              ) : (
                <><Pickaxe size={13} /> Mine</>
              )}
            </button>
          </div>
        </div>

        {/* Mining progress */}
        <AnimatePresence>
          {mining && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-bg border border-border rounded-xl p-3">
                <div className="h-1 bg-border rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-gradient-primary rounded-full progress-indeterminate" />
                </div>
                <div className="text-[10px] text-muted font-mono">
                  Trying nonce: <span className="text-accent font-bold">{nonceCount.toLocaleString()}</span>
                  {' '}— searching for hash starting with <span className="text-primary font-bold">'{PREFIX}'</span>…
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hash output */}
        <div>
          <label className="block text-[10px] font-bold text-muted tracking-widest uppercase mb-2">
            SHA-256 Hash
          </label>
          <div className={`bg-bg border rounded-xl px-4 py-3 transition-all duration-300 ${
            valid === true  ? 'border-green-500/30 bg-green-500/3' :
            valid === false ? 'border-red-500/30 bg-red-500/3' : 'border-border/50'
          }`}>
            <HashDisplay hash={block.hash} valid={valid} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Chain connector ───────────────────────────────── */
function ChainConnector({ intact }: { intact: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-4 lg:py-0 lg:px-4 gap-2">
      <motion.div
        animate={{ backgroundColor: intact ? '#00E6A860' : '#ef444460' }}
        className="hidden lg:block w-12 h-0.5 rounded-full"
        style={{ background: intact ? 'rgba(0,230,168,0.5)' : 'rgba(239,68,68,0.5)' }}
      />
      {/* Mobile vertical */}
      <motion.div
        animate={{ backgroundColor: intact ? '#00E6A860' : '#ef444460' }}
        className="lg:hidden w-0.5 h-10 rounded-full"
      />
      <motion.div
        animate={{ color: intact ? '#00E6A8' : '#ef4444' }}
        className="text-[9px] font-mono text-center whitespace-nowrap"
      >
        {intact ? 'prevHash →' : 'Chain Broken!'}
      </motion.div>
      <div className="hidden lg:block w-12 h-0.5 rounded-full"
           style={{ background: intact ? 'rgba(0,230,168,0.5)' : 'rgba(239,68,68,0.5)' }} />
      <div className="lg:hidden w-0.5 h-10 rounded-full"
           style={{ background: intact ? 'rgba(0,230,168,0.5)' : 'rgba(239,68,68,0.5)' }} />
    </div>
  )
}

/* ── Page ──────────────────────────────────────────── */
export default function Simulator() {
  const [blocks, setBlocks] = useState<Block[]>([
    { index: 1, data: '', prevHash: GENESIS, nonce: 0, hash: '', mined: false },
    { index: 2, data: '', prevHash: '',       nonce: 0, hash: '', mined: false },
  ])
  const [mining, setMining]         = useState<number | null>(null)
  const [nonceCounts, setNc]        = useState({ 1: 0, 2: 0 })
  const [tamperAlert, setTamperAlert] = useState(false)
  const cancelRef = useRef(false)

  /* Recompute chain from blockIdx onwards */
  const recompute = useCallback(async (draft: Block[]): Promise<Block[]> => {
    for (let i = 0; i < draft.length; i++) {
      if (i > 0) draft[i].prevHash = draft[i - 1].hash
      draft[i].hash = await computeHash(draft[i].index, draft[i].data, draft[i].prevHash, draft[i].nonce)
    }
    return [...draft]
  }, [])

  // Initial hash
  useEffect(() => {
    (async () => {
      const draft = [...blocks]
      for (let i = 0; i < draft.length; i++) {
        if (i > 0) draft[i].prevHash = draft[i - 1].hash
        draft[i].hash = await computeHash(draft[i].index, draft[i].data, draft[i].prevHash, draft[i].nonce)
      }
      setBlocks(draft)
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDataChange = useCallback(async (idx: number, data: string) => {
    const draft = blocks.map(b => ({ ...b }))
    draft[idx - 1].data  = data
    draft[idx - 1].mined = false
    draft[idx - 1].hash  = await computeHash(draft[idx - 1].index, data, draft[idx - 1].prevHash, draft[idx - 1].nonce)
    if (idx === 1) draft[1].prevHash = draft[0].hash
    draft[1].hash = await computeHash(draft[1].index, draft[1].data, draft[1].prevHash, draft[1].nonce)
    const next = await recompute(draft)
    setBlocks(next)
    const b1 = next[0], b2 = next[1]
    setTamperAlert(b1.mined && b2.mined && (!b1.hash.startsWith(PREFIX) || !b2.hash.startsWith(PREFIX) || b2.prevHash !== b1.hash))
  }, [blocks, recompute])

  const handleNonceChange = useCallback(async (idx: number, nonce: number) => {
    const draft = blocks.map(b => ({ ...b }))
    draft[idx - 1].nonce = nonce
    draft[idx - 1].hash  = await computeHash(draft[idx - 1].index, draft[idx - 1].data, draft[idx - 1].prevHash, nonce)
    draft[idx - 1].mined = draft[idx - 1].hash.startsWith(PREFIX)
    const next = await recompute(draft)
    setBlocks(next)
  }, [blocks, recompute])

  const handleMine = useCallback(async (idx: number) => {
    if (mining !== null) return
    setMining(idx)
    cancelRef.current = false

    const draft = blocks.map(b => ({ ...b }))
    const b = draft[idx - 1]
    b.nonce = 0
    b.mined = false

    const BATCH = 200

    for (let n = 0; n < 100_000 && !cancelRef.current; n++) {
      const h = await computeHash(b.index, b.data, b.prevHash, n)
      b.nonce = n

      if (n % BATCH === 0) {
        setNc(prev => ({ ...prev, [idx]: n }))
        await new Promise(r => setTimeout(r, 0))
      }

      if (h.startsWith(PREFIX)) {
        b.hash  = h
        b.nonce = n
        b.mined = true
        break
      }
    }

    if (!b.mined) {
      b.hash = await computeHash(b.index, b.data, b.prevHash, b.nonce)
    }

    const next = await recompute(draft)
    setBlocks(next)
    setMining(null)
    setNc(prev => ({ ...prev, [idx]: 0 }))
    const b1 = next[0], b2 = next[1]
    setTamperAlert(b1.mined && b2.mined && (b2.prevHash !== b1.hash))
  }, [blocks, mining, recompute])

  const handleReset = useCallback(async () => {
    cancelRef.current = true
    setMining(null)
    const draft: Block[] = [
      { index: 1, data: '', prevHash: GENESIS, nonce: 0, hash: '', mined: false },
      { index: 2, data: '', prevHash: '',       nonce: 0, hash: '', mined: false },
    ]
    const next = await recompute(draft)
    setBlocks(next)
    setTamperAlert(false)
  }, [recompute])

  const b1 = blocks[0], b2 = blocks[1]
  const chainIntact = !b1.mined || !b2.mined || (b1.mined && b2.mined && b1.hash.startsWith(PREFIX) && b2.hash.startsWith(PREFIX) && b2.prevHash === b1.hash)

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-20">
      {/* Header */}
      <Reveal className="text-center max-w-2xl mx-auto mb-12">
        <p className="section-label mb-4 justify-center">Interactive Demo</p>
        <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
          Block Mining <span className="text-gradient">Simulator</span>
        </h1>
        <p className="text-muted text-lg mb-4">
          Mine real blocks using SHA-256 cryptography. See how changing data in Block 1
          instantly breaks Block 2 — this is <span className="text-primary font-semibold">immutability in action</span>.
        </p>
        <a href="https://andersbrownworth.com/blockchain/" target="_blank" rel="noopener noreferrer"
           className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-secondary transition-colors">
          <ExternalLink size={11} /> Inspired by Anders Brownworth's Blockchain Demo
        </a>
      </Reveal>

      {/* Insight banner */}
      <Reveal className="mb-8">
        <div className="glass border-primary/15 bg-primary/3 p-5 flex items-start gap-4">
          <div className="flex-shrink-0 mt-0.5"><Lightbulb size={24} className="text-secondary opacity-80" /></div>
          <p className="text-sm text-muted leading-relaxed">
            <strong className="text-white">The Core Insight:</strong> Each block's hash includes the <em className="text-secondary">previous block's hash</em>.
            When you tamper with Block 1's data, its hash changes — Block 2's <code className="text-primary bg-primary/10 px-1 rounded text-xs">prevHash</code> no longer matches.{' '}
            <strong className="text-white">The chain breaks.</strong>
          </p>
        </div>
      </Reveal>

      {/* Tamper alert */}
      <AnimatePresence>
        {tamperAlert && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="glass border-red-500/30 bg-red-500/5 p-5 flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5 animate-bounce"><AlertOctagon size={24} className="text-red-400 opacity-80" /></div>
              <div>
                <h3 className="font-display font-bold text-red-400 text-sm mb-1">Chain Tamper Detected!</h3>
                <p className="text-muted text-xs leading-relaxed">
                  Block 1's hash no longer matches Block 2's previous hash. The chain is broken — just like a real blockchain would reject this.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chain */}
      <div className="flex flex-col lg:flex-row items-stretch gap-0 mb-8">
        <div className="flex-1">
          <BlockCard
            block={b1}
            onDataChange={d => handleDataChange(1, d)}
            onNonceChange={n => handleNonceChange(1, n)}
            onMine={() => handleMine(1)}
            mining={mining === 1}
            nonceCount={nonceCounts[1]}
          />
        </div>
        <ChainConnector intact={chainIntact} />
        <div className="flex-1">
          <BlockCard
            block={b2}
            onDataChange={d => handleDataChange(2, d)}
            onNonceChange={n => handleNonceChange(2, n)}
            onMine={() => handleMine(2)}
            mining={mining === 2}
            nonceCount={nonceCounts[2]}
          />
        </div>
      </div>

      {/* Reset */}
      <div className="flex justify-center mb-16">
        <button onClick={handleReset} className="btn-outline flex items-center gap-2 text-sm">
          <RotateCcw size={14} /> Reset Simulator
        </button>
      </div>

      {/* How it works */}
      <div className="gradient-divider mb-12" />
      <Reveal className="mb-8">
        <p className="section-label mb-3">Concept Guide</p>
        <h2 className="font-display font-bold text-white" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}>
          How Mining & Immutability Work
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {[
          { n: '01', title: 'Hashing',         desc: 'SHA-256 takes any input and produces a fixed 64-char hex string. Even a single character change produces a completely different hash.' },
          { n: '02', title: 'Proof of Work',   desc: 'Mining means incrementing the nonce until the hash starts with "00". Hard to find, trivial to verify. That\'s the magic.' },
          { n: '03', title: 'Chain Linking',   desc: 'Each block includes the previous block\'s hash — creating a cryptographic chain. Any change ripples forward and breaks every subsequent block.' },
          { n: '04', title: 'Immutability',    desc: 'To rewrite history, an attacker must re-mine every subsequent block faster than the whole network. This is why blockchains are tamper-evident.' },
        ].map((step, i) => (
          <Reveal key={step.n} delay={i * 0.1} direction="scale">
            <div className="glass-hover p-6 h-full">
              <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center
                              text-xs font-mono font-bold text-primary mb-4">{step.n}</div>
              <h3 className="font-display font-semibold text-white text-sm mb-2">{step.title}</h3>
              <p className="text-muted text-xs leading-relaxed">{step.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Arbitrum connection */}
      <Reveal>
        <div className="glass p-8 flex items-start gap-5">
          <div className="flex-shrink-0 mt-1"><Hexagon size={32} className="text-accent opacity-80" /></div>
          <div>
            <h3 className="font-display font-bold text-white text-lg mb-2">How Arbitrum Uses This</h3>
            <p className="text-muted text-sm leading-relaxed mb-4">
              Arbitrum inherits Ethereum's immutability guarantees. Transactions batched on Arbitrum are
              compressed and posted to Ethereum L1 as calldata — where they become permanent and tamper-proof.
              The fraud proof system means any validator can challenge dishonest blocks within the 7-day challenge window.
            </p>
            <a href="https://sepolia.arbiscan.io/" target="_blank" rel="noopener noreferrer" className="btn-outline text-xs flex items-center gap-1.5 w-fit">
              <ExternalLink size={12} /> View Live Blocks on Arbiscan
            </a>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
