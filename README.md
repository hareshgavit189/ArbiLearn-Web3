# ArbiLearn — Web3 Education Website

A **4-page educational Web3 website** built from scratch using plain HTML, CSS, and JavaScript — no frameworks, no scaffolding. Built as an assignment for the **Arbitrum Builder Labs by LamprosDAO** program.

> **Live URL: https://hareshgavit189.github.io/ArbiLearn-Web3/

---

## 🗂 Pages

| Page | File | Description |
|---|---|---|
| **Home / Landing** | `index.html` | Arbitrum & Layer 2 overview — hero, problem cards, rollup diagram, comparison table, resource links |
| **Web3 Concepts** | `concepts.html` | Visual comparison cards — Web2 vs Web3, ETH vs BTC, Public vs Private Key, Blockchain vs Traditional DB |
| **Live Prices** | `prices.html` | Live BTC, ETH, SOL, ARB prices from CoinGecko API with auto-refresh |
| **Block Simulator** | `simulator.html` | Interactive SHA-256 block mining simulator demonstrating nonce, hashing, and chain immutability |

---

## ✨ Features

- **100% Scratch-Built** — no frameworks, no Tailwind, no React. Pure HTML + CSS + JS
- **Premium Dark Mode** — custom HSL color system with Web3-native purple/cyan palette
- **Real SHA-256 Hashing** — Block Simulator uses `window.crypto.subtle` (Web Crypto API)
- **Live API Data** — CoinGecko public API, no API key required
- **Chain Immutability Demo** — modifying Block 1's data visually breaks Block 2
- **Responsive Design** — works on desktop, tablet, and mobile
- **Accessibility** — semantic HTML, ARIA labels, keyboard navigation on all interactive elements
- **Glassmorphism Cards** — `backdrop-filter` blur effects throughout
- **Scroll Animations** — IntersectionObserver-based reveal animations
- **Auto-refresh** — live prices refresh every 60 seconds with countdown display

---

## 📁 Project Structure

```
AI+W3/
├── index.html           ← Page 1: Home / Landing
├── concepts.html        ← Page 2: Web3 Concepts
├── prices.html          ← Page 3: Live Prices
├── simulator.html       ← Page 4: Block Simulator
├── css/
│   ├── style.css        ← Global design system (tokens, reset, utilities)
│   ├── nav.css          ← Navigation + footer
│   ├── home.css         ← Home page styles
│   ├── concepts.css     ← Concept cards and comparison tables
│   ├── prices.css       ← Price dashboard styles
│   └── simulator.css    ← Block simulator styles
├── js/
│   ├── nav.js           ← Active nav highlighting, mobile menu, scroll reveal
│   ├── prices.js        ← CoinGecko API fetch, card rendering, auto-refresh
│   └── simulator.js     ← SHA-256 mining, chain validation, tamper detection
└── README.md
```

---

## 🚀 How to Run Locally

**No installation or build step required.**

1. Clone or download this repository:
   ```bash
   git clone https://github.com/hareshgavit189/Arbitrum-Builder-Labs-4-Page-Web3.git
   ```

2. Open `index.html` directly in any modern browser (Chrome, Firefox, Edge, Safari):
   ```
   Double-click index.html  →  Opens in default browser
   ```

   Or use a local server (optional, for CORS-free development):
   ```bash
   # Python
   python -m http.server 3000

   # Node.js
   npx serve .
   ```
   Then open `http://localhost:3000`

---

## 🔗 External Resources Referenced

| Resource | URL |
|---|---|
| Arbitrum Sepolia Explorer | https://sepolia.arbiscan.io/ |
| LamprosDAO Faucet | https://faucet.lamprosdao.com/ |
| Sample Transaction | https://sepolia.arbiscan.io/tx/0x9bd0... |
| CoinGecko API | https://api.coingecko.com/api/v3/simple/price |
| Blockchain Visual Demo | https://andersbrownworth.com/blockchain/ |
| MetaMask Setup Guide | https://github.com/purvik6062/session-guide |
| XCAN Builder Registration | https://www.xcan.dev/builder-pods/register |

---

## 🛠 Tech Stack

- **HTML5** — Semantic structure, ARIA accessibility
- **CSS3** — Custom properties, Grid, Flexbox, `backdrop-filter`, `@keyframes`
- **JavaScript ES2022** — Async/await, `crypto.subtle.digest`, `IntersectionObserver`, `fetch`
- **CoinGecko API** — Free public endpoint, no authentication
- **Web Crypto API** — Real SHA-256 for the block simulator

---

## ⚠️ Known Issues & Future Improvements

- **CoinGecko rate limiting**: The free API allows ~30 requests/minute. If the prices page shows an error, wait 60 seconds and refresh.
- **Mining speed**: The PoW difficulty (`00` prefix) is intentionally light to run in-browser. Increasing to `000` would take minutes per block.
- **Block Simulator**: Currently demonstrates 2 blocks. A future version could extend to N blocks.
- **Batch name**: Will be updated once announced by LamprosDAO.

---

## 👤 Author

**Haresh Gavit**
- GitHub: [hareshgavit189](https://github.com/hareshgavit189/Arbitrum-Builder-Labs-4-Page-Web3)
- Program: Arbitrum Builder Labs by LamprosDAO — Builder Pods 2026
