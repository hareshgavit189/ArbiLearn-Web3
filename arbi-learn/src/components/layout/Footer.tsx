import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'


import { Hexagon } from 'lucide-react'

const FOOTER_LINKS = {
  Pages: [
    { label: 'Home',            to: '/' },
    { label: 'Concepts',        to: '/concepts' },
    { label: 'Live Prices',     to: '/prices' },
    { label: 'Block Simulator', to: '/simulator' },
  ],
  Resources: [
    { label: 'Arbiscan Explorer',  href: 'https://sepolia.arbiscan.io/' },
    { label: 'LamprosDAO Faucet',  href: 'https://faucet.lamprosdao.com/' },
    { label: 'Sample Transaction', href: 'https://sepolia.arbiscan.io/tx/0x9bd03034b13299ca0bf0d316b3b407e1bf0ca2250a725b99753457a6bb054ba8' },
    { label: 'Blockchain Demo',    href: 'https://andersbrownworth.com/blockchain/' },
    { label: 'MetaMask Guide',     href: 'https://github.com/purvik6062/session-guide/blob/main/metamask/README.md' },
  ],
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-bg/50 pt-20 pb-10">
      <div className="relative max-w-[1200px] mx-auto px-6 pt-16 pb-8">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center text-base shadow-glow-primary transition-transform duration-300 group-hover:scale-110"><Hexagon size={20} className="text-bg" /></div>
              <span className="font-display font-bold text-lg text-gradient">ArbiLearn</span>
            </Link>
            <p className="text-muted text-sm leading-relaxed max-w-xs mb-6">
              A premium Web3 educational project built from scratch for the Arbitrum Builder Labs by LamprosDAO program.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com/hareshgavit189/Arbitrum-Builder-Labs-4-Page-Web3"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-muted border border-border hover:text-white hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
              >
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub Repository
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-bold text-white tracking-widest uppercase mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    {'to' in link ? (
                      <Link to={link.to} className="text-sm text-muted hover:text-white transition-colors flex items-center gap-1.5">
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted hover:text-white transition-colors flex items-center gap-1.5 group"
                      >
                        {link.label}
                        <ExternalLink size={10} className="opacity-0 group-hover:opacity-60 transition-opacity" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="gradient-divider mb-6" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted">
          <span>© 2025 <span className="text-white font-medium">Haresh Gavit</span> · Arbitrum Builder Labs by LamprosDAO</span>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
            <span>Arbitrum Builder Pods 2025</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
