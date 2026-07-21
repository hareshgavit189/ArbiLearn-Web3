/**
 * simulator.js — Block Mining Simulator
 *
 * Inspired by Anders Brownworth's Blockchain Demo
 * https://andersbrownworth.com/blockchain/
 *
 * Uses real SHA-256 via Web Crypto API (window.crypto.subtle)
 * Simulates Proof-of-Work: mines until hash starts with '00'
 * Demonstrates chain immutability: changing Block 1 invalidates Block 2
 */

(function () {
  'use strict';

  /* ─── Config ──────────────────────────────────────────────────────── */
  const DIFFICULTY_PREFIX = '00';  // Hash must start with this

  /* ─── State ───────────────────────────────────────────────────────── */
  const blocks = [
    {
      index: 1,
      data: '',
      prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
      nonce: 0,
      hash: '',
      mined: false,
    },
    {
      index: 2,
      data: '',
      prevHash: '',  // Will be set from block 1's hash
      nonce: 0,
      hash: '',
      mined: false,
    }
  ];

  /* ─── SHA-256 via Web Crypto API ──────────────────────────────────── */
  async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /* ─── Compute block hash ──────────────────────────────────────────── */
  async function computeHash(blockIndex, data, prevHash, nonce) {
    const input = `${blockIndex}:${data}:${prevHash}:${nonce}`;
    return await sha256(input);
  }

  /* ─── Check validity ──────────────────────────────────────────────── */
  function isValidHash(hash) {
    return hash.startsWith(DIFFICULTY_PREFIX);
  }

  /* ─── Get DOM elements for a block ───────────────────────────────── */
  function getBlockEl(blockIndex) {
    const i = blockIndex - 1;
    return {
      card:       document.getElementById(`block-${blockIndex}`),
      dataInput:  document.getElementById(`block${blockIndex}-data`),
      prevInput:  document.getElementById(`block${blockIndex}-prevhash`),
      nonceInput: document.getElementById(`block${blockIndex}-nonce`),
      hashEl:     document.getElementById(`block${blockIndex}-hash`),
      statusEl:   document.getElementById(`block${blockIndex}-status`),
      mineBtn:    document.getElementById(`btn-mine-${blockIndex}`),
      progress:   document.getElementById(`block${blockIndex}-progress`),
      nonceCount: document.getElementById(`block${blockIndex}-nonce-count`),
    };
  }

  /* ─── Render block UI state ───────────────────────────────────────── */
  function renderBlock(blockIndex) {
    const b = blocks[blockIndex - 1];
    const el = getBlockEl(blockIndex);
    if (!el.card) return;

    // Inputs
    el.dataInput.value  = b.data;
    el.prevInput.value  = b.prevHash;
    el.nonceInput.value = b.nonce;

    // Hash display
    if (b.hash) {
      const prefix = b.hash.slice(0, 2);
      const rest   = b.hash.slice(2);
      const isValid = isValidHash(b.hash);

      el.hashEl.innerHTML = isValid
        ? `<span class="hash-prefix">${prefix}</span>${rest}`
        : b.hash;
      el.hashEl.className = `hash-value ${isValid ? 'valid-hash' : 'invalid-hash'}`;

      // Card + status
      el.card.className     = `block-card ${isValid ? 'valid' : 'invalid'}`;
      el.statusEl.className = `block-status ${isValid ? 'valid' : 'invalid'}`;
      el.statusEl.innerHTML = isValid
        ? `<span>✓</span> Valid`
        : `<span>✗</span> Invalid`;
    } else {
      el.hashEl.textContent = 'Not yet computed…';
      el.hashEl.className   = 'hash-value';
      el.card.className     = 'block-card';
      el.statusEl.className = 'block-status pending';
      el.statusEl.innerHTML = `<span>◌</span> Pending`;
    }
  }

  /* ─── Update chain after block 1 changes ─────────────────────────── */
  async function updateChain(fromBlockIndex) {
    for (let i = fromBlockIndex; i <= blocks.length; i++) {
      const b = blocks[i - 1];

      // Block 2's prevHash always comes from Block 1's hash
      if (i > 1) {
        b.prevHash = blocks[i - 2].hash || '';
      }

      // Recompute this block's hash
      if (b.prevHash !== undefined && b.data !== undefined) {
        b.hash = await computeHash(b.index, b.data, b.prevHash, b.nonce);
      }

      renderBlock(i);
    }

    // Update connector
    updateConnector();
    updateTamperAlert();
  }

  /* ─── Update chain connector ──────────────────────────────────────── */
  function updateConnector() {
    const connector = document.getElementById('chain-connector-line');
    const label     = document.getElementById('chain-connector-label');
    if (!connector) return;

    const b2 = blocks[1];
    const chainBroken = b2.prevHash !== blocks[0].hash ||
      (b2.mined && !isValidHash(b2.hash));

    const isIntact = blocks[0].mined && blocks[1].mined &&
      blocks[1].prevHash === blocks[0].hash &&
      isValidHash(blocks[0].hash) &&
      isValidHash(blocks[1].hash);

    connector.classList.toggle('broken', !isIntact && blocks[1].mined);
    if (label) {
      label.classList.toggle('broken', !isIntact && blocks[1].mined);
      label.textContent = isIntact ? 'Chain Intact' : (blocks[1].mined ? 'Chain Broken!' : 'prevHash →');
    }
  }

  /* ─── Show/hide tamper alert ──────────────────────────────────────── */
  function updateTamperAlert() {
    const alert = document.getElementById('tamper-alert');
    if (!alert) return;

    const b1 = blocks[0];
    const b2 = blocks[1];

    const broken =
      b1.mined && b2.mined &&
      (b2.prevHash !== b1.hash || !isValidHash(b2.hash));

    alert.classList.toggle('visible', broken);
  }

  /* ─── Mine a block ────────────────────────────────────────────────── */
  async function mine(blockIndex) {
    const b  = blocks[blockIndex - 1];
    const el = getBlockEl(blockIndex);

    // Disable button, show progress
    el.mineBtn.disabled = true;
    el.mineBtn.classList.add('mining');
    if (el.progress) el.progress.classList.add('active');

    b.nonce = 0;
    b.mined = false;

    const MAX_ITERS = 100_000;
    const BATCH_SIZE = 200;

    let found = false;

    while (b.nonce < MAX_ITERS && !found) {
      // Batch: run BATCH_SIZE hashes per animation frame to keep UI alive
      const batchEnd = Math.min(b.nonce + BATCH_SIZE, MAX_ITERS);

      for (; b.nonce < batchEnd; b.nonce++) {
        const h = await computeHash(b.index, b.data, b.prevHash, b.nonce);
        if (isValidHash(h)) {
          b.hash  = h;
          b.mined = true;
          found   = true;
          break;
        }
      }

      // Update nonce counter display
      if (el.nonceCount) el.nonceCount.textContent = b.nonce.toLocaleString();
      el.nonceInput.value = b.nonce;

      if (!found) {
        // Yield to browser for re-render
        await new Promise(r => setTimeout(r, 0));
      }
    }

    if (!found) {
      b.hash  = await computeHash(b.index, b.data, b.prevHash, b.nonce);
      b.mined = false;
    }

    // Update downstream blocks
    await updateChain(blockIndex);

    // Re-enable button
    el.mineBtn.disabled = false;
    el.mineBtn.classList.remove('mining');
    if (el.progress) el.progress.classList.remove('active');

    // If found, play success pulse on card
    if (found && el.card) {
      el.card.style.animation = 'none';
      el.card.offsetHeight; // reflow
      el.card.style.animation = '';
    }
  }

  /* ─── Wire up event listeners ─────────────────────────────────────── */
  function initBlock(blockIndex) {
    const b  = blocks[blockIndex - 1];
    const el = getBlockEl(blockIndex);
    if (!el.card) return;

    // Data input → recompute hash in real-time (no mining)
    if (el.dataInput) {
      el.dataInput.addEventListener('input', async () => {
        b.data  = el.dataInput.value;
        b.mined = false;
        b.hash  = await computeHash(b.index, b.data, b.prevHash, b.nonce);
        await updateChain(blockIndex);
      });
    }

    // Nonce input → manual change
    if (el.nonceInput) {
      el.nonceInput.addEventListener('input', async () => {
        b.nonce = parseInt(el.nonceInput.value, 10) || 0;
        b.hash  = await computeHash(b.index, b.data, b.prevHash, b.nonce);
        b.mined = isValidHash(b.hash);
        await updateChain(blockIndex);
      });
    }

    // Mine button
    if (el.mineBtn) {
      el.mineBtn.addEventListener('click', () => mine(blockIndex));
    }
  }

  /* ─── Reset all blocks ────────────────────────────────────────────── */
  function resetAll() {
    blocks.forEach((b, i) => {
      b.data   = '';
      b.nonce  = 0;
      b.hash   = '';
      b.mined  = false;
      if (i > 0) b.prevHash = '';
    });

    for (let i = 1; i <= blocks.length; i++) renderBlock(i);

    const connector = document.getElementById('chain-connector-line');
    const label     = document.getElementById('chain-connector-label');
    if (connector) connector.classList.remove('broken');
    if (label) { label.classList.remove('broken'); label.textContent = 'prevHash →'; }

    const alert = document.getElementById('tamper-alert');
    if (alert) alert.classList.remove('visible');
  }

  /* ─── Init ────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', async () => {
    // Initialize block 1 with genesis prevHash
    blocks[0].prevHash = '0000000000000000000000000000000000000000000000000000000000000000';
    blocks[0].hash     = await computeHash(1, '', blocks[0].prevHash, 0);
    blocks[1].prevHash = blocks[0].hash;
    blocks[1].hash     = await computeHash(2, '', blocks[1].prevHash, 0);

    for (let i = 1; i <= blocks.length; i++) {
      initBlock(i);
      renderBlock(i);
    }

    updateConnector();

    // Reset button
    const resetBtn = document.getElementById('btn-reset');
    if (resetBtn) resetBtn.addEventListener('click', resetAll);
  });

})();
