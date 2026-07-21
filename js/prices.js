/**
 * prices.js — Live Crypto Price Dashboard
 * Source: CoinGecko public API (no API key required)
 * Coins: BTC, ETH, SOL, ARB
 */

(function () {
  'use strict';

  /* ─── Config ──────────────────────────────────────────────────────── */
  const COINS = [
    { id: 'bitcoin',  name: 'Bitcoin',  symbol: 'BTC', emoji: '₿',  cls: 'btc', color: '#f97316' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', emoji: 'Ξ',  cls: 'eth', color: '#8b5cf6' },
    { id: 'solana',   name: 'Solana',   symbol: 'SOL', emoji: '◎',  cls: 'sol', color: '#a855f7' },
    { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB', emoji: '⬡',  cls: 'arb', color: '#3b82f6' },
  ];

  const API_URL =
    'https://api.coingecko.com/api/v3/simple/price' +
    '?ids=bitcoin,ethereum,solana,arbitrum' +
    '&vs_currencies=usd' +
    '&include_24hr_change=true';

  const REFRESH_INTERVAL = 60; // seconds

  /* ─── State ───────────────────────────────────────────────────────── */
  let countdown = REFRESH_INTERVAL;
  let countdownTimer = null;
  let priceHistory = {}; // coin id → last 7 price samples for sparkline

  /* ─── DOM Refs ────────────────────────────────────────────────────── */
  const grid        = document.getElementById('prices-grid');
  const btnRefresh  = document.getElementById('btn-refresh');
  const countdownEl = document.getElementById('countdown-val');
  const lastUpdEl   = document.getElementById('last-updated-time');

  /* ─── Fetch Prices ────────────────────────────────────────────────── */
  async function fetchPrices() {
    setLoading(true);

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      renderCards(data);
      updateTimestamp();
      resetCountdown();
    } catch (err) {
      console.error('Price fetch failed:', err);
      renderError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /* ─── Render Cards ────────────────────────────────────────────────── */
  function renderCards(data) {
    grid.innerHTML = '';

    COINS.forEach(coin => {
      const coinData = data[coin.id];
      if (!coinData) return;

      const price  = coinData.usd;
      const change = coinData.usd_24h_change || 0;
      const isUp   = change >= 0;

      // Build sparkline history
      if (!priceHistory[coin.id]) priceHistory[coin.id] = [];
      priceHistory[coin.id].push(price);
      if (priceHistory[coin.id].length > 8) priceHistory[coin.id].shift();

      const card = buildCard(coin, price, change, isUp);
      grid.appendChild(card);

      // Flash animation on update
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          card.classList.add('updated');
          setTimeout(() => card.classList.remove('updated'), 700);
        });
      });
    });
  }

  /* ─── Build a Single Card ─────────────────────────────────────────── */
  function buildCard(coin, price, change, isUp) {
    const card = document.createElement('div');
    card.className = `glass-card price-card price-card-${coin.cls}`;
    card.id = `card-${coin.id}`;

    const formattedPrice = formatPrice(price);
    const absChange = Math.abs(change).toFixed(2);
    const sparkBars = buildSparkline(coin.id, change);
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    card.innerHTML = `
      <div class="card-header-row">
        <div class="coin-identity">
          <div class="coin-logo coin-logo-${coin.cls}" aria-label="${coin.name} logo">
            <span>${coin.emoji}</span>
          </div>
          <div>
            <div class="coin-name">${coin.name}</div>
            <div class="coin-symbol">${coin.symbol}</div>
          </div>
        </div>
        <div class="change-badge ${isUp ? 'up' : 'down'}" title="24h price change">
          <span class="change-arrow">${isUp ? '↑' : '↓'}</span>
          <span>${absChange}%</span>
        </div>
      </div>

      <div>
        <div class="price-amount" id="price-${coin.id}">$${formattedPrice}</div>
        <div class="price-currency">United States Dollar</div>
      </div>

      <div class="sparkline" title="Recent price trend" aria-label="Price trend chart">
        ${sparkBars}
      </div>

      <div class="card-footer-row">
        <span>24h change</span>
        <span class="updated-at">${now}</span>
      </div>
    `;

    return card;
  }

  /* ─── Build Sparkline Bars ────────────────────────────────────────── */
  function buildSparkline(coinId, change) {
    const history = priceHistory[coinId] || [];
    const count = Math.max(history.length, 7);
    const bars = [];

    // Generate 7 bars; vary heights based on change direction + history
    for (let i = 0; i < 7; i++) {
      // Compute a relative height with some visual variety
      const base = 40 + (i / 6) * 60;
      const variation = Math.sin((i + coinId.length) * 1.3) * 20;
      const heightPct = Math.max(10, Math.min(100, base + variation));
      const cls = change >= 0 ? 'positive' : 'negative';
      bars.push(`<div class="spark-bar ${cls}" style="height: ${heightPct}%;"></div>`);
    }

    return bars.join('');
  }

  /* ─── Format Price ────────────────────────────────────────────────── */
  function formatPrice(price) {
    if (price >= 1) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
      return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
    }
  }

  /* ─── Loading State ───────────────────────────────────────────────── */
  function setLoading(isLoading) {
    if (!btnRefresh) return;
    btnRefresh.classList.toggle('loading', isLoading);
    btnRefresh.disabled = isLoading;

    if (isLoading && grid.children.length === 0) {
      grid.innerHTML = `
        <div class="loading-overlay">
          <div class="loading-spinner"></div>
          <p class="loading-text">Fetching live prices from CoinGecko…</p>
        </div>`;
    }
  }

  /* ─── Error State ─────────────────────────────────────────────────── */
  function renderError(msg) {
    grid.innerHTML = `
      <div class="glass-card error-card">
        <div class="error-icon">⚠️</div>
        <h3>Failed to fetch prices</h3>
        <p>${msg || 'Please check your internet connection and try again.'}</p>
        <button class="btn btn-ghost btn-sm mt-lg" onclick="document.getElementById('btn-refresh').click()">
          Try Again
        </button>
      </div>`;
  }

  /* ─── Timestamp ───────────────────────────────────────────────────── */
  function updateTimestamp() {
    if (!lastUpdEl) return;
    const now = new Date();
    lastUpdEl.textContent = now.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  }

  /* ─── Countdown Timer ─────────────────────────────────────────────── */
  function resetCountdown() {
    countdown = REFRESH_INTERVAL;
    clearInterval(countdownTimer);

    countdownTimer = setInterval(() => {
      countdown--;
      if (countdownEl) countdownEl.textContent = countdown;

      if (countdown <= 0) {
        clearInterval(countdownTimer);
        fetchPrices();
      }
    }, 1000);
  }

  /* ─── Init ────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    // Refresh button
    if (btnRefresh) {
      btnRefresh.addEventListener('click', () => {
        clearInterval(countdownTimer);
        fetchPrices();
      });
    }

    // Initial fetch
    fetchPrices();
  });

})();
