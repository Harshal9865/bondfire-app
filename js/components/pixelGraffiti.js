// ==============================================================================
// 32x32 COLLABORATIVE RETRO PIXEL MEMORY GRAFFITI WALL
// Squad pixel drawing board with 16-color palette and 1-click 3D Yearbook export
// ==============================================================================

import { store } from '../state/store.js';
import { chiptune } from '../visuals/chiptuneSynth.js';

const GRID_SIZE = 32;
const PALETTE = [
  '#0B0E17', '#1F2937', '#4B5563', '#FFFFFF',
  '#FF5A5F', '#FFB703', '#F72585', '#4ADE80',
  '#00E3FD', '#3B82F6', '#9D4EDD', '#78350F',
  '#FDE047', '#F43F5E', '#10B981', '#6366F1'
];

let selectedColor = '#FFB703';
let pixelGrid = Array(GRID_SIZE * GRID_SIZE).fill('#0B0E17');
let isMouseDown = false;

export function renderPixelGraffiti() {
  return `
    <div class="glass-card" style="border-color: var(--accent-amber); margin-bottom: var(--space-xl);">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-xs); margin-bottom: var(--space-md);">
        <div>
          <span class="badge badge-amber" style="font-size: 10px;">RETRO MINI-GAME 1</span>
          <h3 style="font-size: var(--text-lg); margin-top: 4px;">🎨 Collaborative Pixel Memory Wall (32x32)</h3>
          <p style="font-size: var(--text-xs); color: var(--text-muted);">
            Draw inside jokes, memes, or badges. Click or drag to paint with your squad.
          </p>
        </div>
        <div style="display: flex; gap: var(--space-xs);">
          <button class="btn btn-ghost btn-sm" id="btn-pixel-clear">CLEAR</button>
          <button class="btn btn-secondary btn-sm" id="btn-pixel-export">
            <span>📖</span> EXPORT TO YEARBOOK
          </button>
        </div>
      </div>

      <!-- Canvas & Tools Container -->
      <div style="display: flex; flex-direction: column; align-items: center; gap: var(--space-md);">
        <!-- 32x32 Pixel Canvas Element -->
        <div style="background: #0B0E17; padding: 4px; border: 2px solid var(--border-medium); border-radius: var(--radius-xs); box-shadow: 0 8px 30px rgba(0,0,0,0.8);">
          <canvas id="graffiti-canvas" width="320" height="320" style="display: block; cursor: crosshair; image-rendering: pixelated; touch-action: none; -webkit-user-select: none; user-select: none;"></canvas>
        </div>

        <!-- 16-Color Palette Selector -->
        <div style="display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; max-width: 360px;" id="graffiti-palette">
          ${PALETTE.map(
            (c) => `
            <button class="palette-swatch" data-color="${c}" style="width: 24px; height: 24px; border-radius: 4px; background-color: ${c}; border: 2px solid ${c === selectedColor ? '#FFFFFF' : 'transparent'}; cursor: pointer; transition: transform 0.1s;"></button>
          `
          ).join('')}
        </div>

        <div id="graffiti-feedback" style="min-height: 20px; font-size: var(--text-xs); font-family: var(--font-display); font-weight: 700; color: var(--accent-mint); text-align: center;"></div>
      </div>
    </div>
  `;
}

export function bindPixelGraffitiEvents() {
  const canvas = document.getElementById('graffiti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const cellSize = canvas.width / GRID_SIZE;

  // Redraw the canvas from pixelGrid state
  const redraw = () => {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        ctx.fillStyle = pixelGrid[r * GRID_SIZE + c];
        ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
      }
    }
  };

  redraw();

  const paintAt = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * GRID_SIZE);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * GRID_SIZE);

    if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
      const idx = y * GRID_SIZE + x;
      if (pixelGrid[idx] !== selectedColor) {
        pixelGrid[idx] = selectedColor;
        chiptune.playPixelBlip();
        redraw();
      }
    }
  };

  // Mouse drawing handlers
  canvas.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    paintAt(e);
  });

  window.addEventListener('mouseup', () => {
    isMouseDown = false;
  });

  canvas.addEventListener('mousemove', (e) => {
    if (isMouseDown) paintAt(e);
  });

  // Touch screen drawing handlers (Tablets, iPads & Mobile phones)
  const getTouchCoords = (touchEvent) => {
    const touch = touchEvent.touches[0] || touchEvent.changedTouches[0];
    return { clientX: touch.clientX, clientY: touch.clientY };
  };

  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isMouseDown = true;
    const coords = getTouchCoords(e);
    paintAt(coords);
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (isMouseDown) {
      const coords = getTouchCoords(e);
      paintAt(coords);
    }
  }, { passive: false });

  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    isMouseDown = false;
  }, { passive: false });

  canvas.addEventListener('touchcancel', () => {
    isMouseDown = false;
  });

  // Color palette selection
  const paletteEl = document.getElementById('graffiti-palette');
  if (paletteEl) {
    paletteEl.addEventListener('click', (e) => {
      const swatch = e.target.closest('.palette-swatch');
      if (!swatch) return;
      selectedColor = swatch.dataset.color;
      chiptune.playPixelBlip();
      paletteEl.querySelectorAll('.palette-swatch').forEach((s) => (s.style.borderColor = 'transparent'));
      swatch.style.borderColor = '#FFFFFF';
    });
  }

  // Clear canvas
  const clearBtn = document.getElementById('btn-pixel-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      chiptune.playRoastBuzzer();
      pixelGrid = Array(GRID_SIZE * GRID_SIZE).fill('#0B0E17');
      redraw();
    });
  }

  // Export to 3D Yearbook
  const exportBtn = document.getElementById('btn-pixel-export');
  const feedbackEl = document.getElementById('graffiti-feedback');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      chiptune.playFanfare();
      const dataUrl = canvas.toDataURL('image/png');

      // Add to vault memories as a dedicated Pixel Art artifact
      const newMemory = {
        id: `pixel_art_${Date.now()}`,
        type: 'PIXEL_GRAFFITI',
        title: 'Campfire Squad Pixel Art',
        quote: 'Drawn collaboratively in the Pixel Glade · Archived for 2026 Yearbook',
        author: store.getState().currentUser.displayName,
        timestamp: 'Just now',
        imageData: dataUrl,
        isPlayable: true,
      };

      const currentMemories = store.getState().vaultMemories;
      store.setState({ vaultMemories: [newMemory, ...currentMemories] });

      if (feedbackEl) {
        feedbackEl.textContent = '✨ Pixel masterpiece archived! Added to Pod Vault & 2026 Hardcover Yearbook.';
        setTimeout(() => (feedbackEl.textContent = ''), 4000);
      }
    });
  }
}
