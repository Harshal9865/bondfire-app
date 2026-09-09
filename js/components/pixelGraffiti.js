// ==============================================================================
// 32x32 COLLABORATIVE RETRO PIXEL MEMORY GRAFFITI WALL (Refined & Enhanced)
// Multi-Tool Pixel Suite: Pencil, Bucket Fill, Eraser, Eyedropper, Grid Toggle,
// Undo History, Stamp Library & 1-Click Pod Yearbook Export
// Matches Warm Analog Cyber Aesthetics
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

// Preset pixel art stamps (relative offsets [dx, dy, color])
const STAMPS = {
  FIRE: [
    [0, -2, '#FDE047'],
    [-1, -1, '#FFB703'], [0, -1, '#FDE047'], [1, -1, '#FFB703'],
    [-1, 0, '#FF5A5F'], [0, 0, '#FFB703'], [1, 0, '#FF5A5F'],
    [-2, 1, '#78350F'], [-1, 1, '#FF5A5F'], [0, 1, '#FF5A5F'], [1, 1, '#FF5A5F'], [2, 1, '#78350F'],
  ],
  HEART: [
    [-1, -1, '#F72585'], [1, -1, '#F72585'],
    [-2, 0, '#FF5A5F'], [-1, 0, '#F72585'], [0, 0, '#F72585'], [1, 0, '#F72585'], [2, 0, '#FF5A5F'],
    [-2, 1, '#FF5A5F'], [-1, 1, '#FF5A5F'], [0, 1, '#FF5A5F'], [1, 1, '#FF5A5F'], [2, 1, '#FF5A5F'],
    [-1, 2, '#FF5A5F'], [0, 2, '#FF5A5F'], [1, 2, '#FF5A5F'],
    [0, 3, '#FF5A5F'],
  ],
  STAR: [
    [0, -2, '#FDE047'],
    [0, -1, '#FDE047'],
    [-2, 0, '#FDE047'], [-1, 0, '#FDE047'], [0, 0, '#FFFFFF'], [1, 0, '#FDE047'], [2, 0, '#FDE047'],
    [-1, 1, '#FFB703'], [1, 1, '#FFB703'],
    [-2, 2, '#FFB703'], [2, 2, '#FFB703'],
  ],
  GHOST: [
    [-1, -2, '#FFFFFF'], [0, -2, '#FFFFFF'], [1, -2, '#FFFFFF'],
    [-2, -1, '#FFFFFF'], [-1, -1, '#0B0E17'], [0, -1, '#FFFFFF'], [1, -1, '#0B0E17'], [2, -1, '#FFFFFF'],
    [-2, 0, '#FFFFFF'], [-1, 0, '#FFFFFF'], [0, 0, '#FFFFFF'], [1, 0, '#FFFFFF'], [2, 0, '#FFFFFF'],
    [-2, 1, '#FFFFFF'], [-1, 1, '#0B0E17'], [0, 1, '#FFFFFF'], [1, 1, '#0B0E17'], [2, 1, '#FFFFFF'],
  ]
};

let selectedColor = '#FFB703';
let activeTool = 'PENCIL'; // 'PENCIL' | 'BUCKET' | 'ERASER' | 'PICKER'
let showGrid = true;
let pixelGrid = Array(GRID_SIZE * GRID_SIZE).fill('#0B0E17');
let historyStack = [];
let isMouseDown = false;

export function renderPixelGraffiti() {
  return `
    <div class="relative w-full rounded-2xl bg-surface-container p-4 sm:p-6 shadow-xl border border-border/80 mb-6 select-none">
      <!-- Top Title & Controls Header -->
      <div class="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-border/60">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-amber-gold/15 border border-amber-gold/30 flex items-center justify-center text-amber-gold">
            <span class="material-symbols-outlined text-[20px]">palette</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-headline-sm text-base sm:text-lg text-on-surface font-bold">Pixel Memory Studio</h3>
              <span class="px-2 py-0.5 rounded-full bg-amber-gold/20 text-amber-gold border border-amber-gold/30 text-[10px] font-mono font-bold">32x32</span>
            </div>
            <p class="text-xs text-on-surface-variant">Draw squad memes, inside jokes, and stickers for the pod album.</p>
          </div>
        </div>

        <!-- Action Suite -->
        <div class="flex items-center gap-2 flex-wrap">
          <button id="btn-pixel-undo" class="px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-bright border border-border/70 text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1.5 transition-all active:scale-95" title="Undo Last Stroke">
            <span class="material-symbols-outlined text-[15px]">undo</span>
            <span class="hidden sm:inline">Undo</span>
          </button>
          <button id="btn-pixel-grid-toggle" class="px-3 py-1.5 rounded-xl ${showGrid ? 'bg-amber-gold/20 text-amber-gold border-amber-gold/40' : 'bg-surface-container-high text-gray-400 border-border/70'} border text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95" title="Toggle Grid Lines">
            <span class="material-symbols-outlined text-[15px]">grid_4x4</span>
            <span class="hidden sm:inline">Grid</span>
          </button>
          <button id="btn-pixel-clear" class="px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-sunset-coral/20 hover:text-sunset-coral border border-border/70 text-xs font-semibold text-gray-400 transition-all active:scale-95" title="Clear Canvas">
            Clear
          </button>
          <button id="btn-pixel-export" class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sunset-coral to-amber-gold text-canvas font-bold text-xs flex items-center gap-1.5 shadow-glow-coral hover:brightness-110 active:scale-95 transition-all">
            <span class="material-symbols-outlined text-[15px]">auto_stories</span>
            <span>Archive to Yearbook</span>
          </button>
        </div>
      </div>

      <!-- Main Studio Layout: Tools + Canvas + Stamps -->
      <div class="mt-4 flex flex-col md:flex-row items-center md:items-start justify-center gap-6">
        
        <!-- Left: Tool Selector Rail -->
        <div class="flex md:flex-col items-center gap-2 p-2 bg-surface-container-lowest/80 rounded-2xl border border-border/60 shadow-inner">
          <button class="pixel-tool-btn w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeTool === 'PENCIL' ? 'bg-primary-container text-on-primary shadow-md' : 'text-gray-400 hover:text-white hover:bg-surface-bright'}" data-tool="PENCIL" title="Pencil (Draw)">
            <span class="material-symbols-outlined text-[18px]">draw</span>
          </button>
          <button class="pixel-tool-btn w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeTool === 'BUCKET' ? 'bg-primary-container text-on-primary shadow-md' : 'text-gray-400 hover:text-white hover:bg-surface-bright'}" data-tool="BUCKET" title="Bucket (Flood Fill)">
            <span class="material-symbols-outlined text-[18px]">format_color_fill</span>
          </button>
          <button class="pixel-tool-btn w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeTool === 'ERASER' ? 'bg-primary-container text-on-primary shadow-md' : 'text-gray-400 hover:text-white hover:bg-surface-bright'}" data-tool="ERASER" title="Eraser">
            <span class="material-symbols-outlined text-[18px]">ink_eraser</span>
          </button>
          <button class="pixel-tool-btn w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeTool === 'PICKER' ? 'bg-primary-container text-on-primary shadow-md' : 'text-gray-400 hover:text-white hover:bg-surface-bright'}" data-tool="PICKER" title="Eyedropper (Pick Color)">
            <span class="material-symbols-outlined text-[18px]">colorize</span>
          </button>
        </div>

        <!-- Center: Interactive 32x32 Canvas Arena -->
        <div class="flex flex-col items-center gap-3">
          <div class="relative bg-[#0B0E17] p-2 rounded-2xl border-2 border-border shadow-[0_12px_40px_rgba(0,0,0,0.8)] overflow-hidden">
            <canvas id="graffiti-canvas" width="320" height="320" class="block cursor-crosshair select-none touch-none rounded-lg" style="image-rendering: pixelated; width: 320px; height: 320px;"></canvas>
            
            <!-- Live Hover Coordinates Overlay -->
            <div id="pixel-coords-hud" class="absolute bottom-3 left-3 bg-[#0B0E17]/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-border/50 text-[10px] font-mono text-gray-400 pointer-events-none flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-mint-green"></span>
              <span id="coords-text">X: --, Y: --</span>
            </div>
          </div>

          <!-- Color Swatch Palette -->
          <div class="flex flex-col items-center gap-2 w-full max-w-[340px]">
            <div class="grid grid-cols-8 gap-1.5 w-full p-2 bg-surface-container-lowest/80 rounded-2xl border border-border/60 shadow-inner" id="graffiti-palette">
              ${PALETTE.map((c) => `
                <button class="palette-swatch w-7 h-7 rounded-lg transition-transform hover:scale-110 active:scale-95 flex items-center justify-center shadow-sm" data-color="${c}" style="background-color: ${c}; border: 2px solid ${c === selectedColor ? '#FFFFFF' : 'rgba(255,255,255,0.1)'};">
                  ${c === selectedColor ? '<div class="w-1.5 h-1.5 rounded-full bg-white shadow-sm"></div>' : ''}
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Right: Preset Stamps & Badges -->
        <div class="flex flex-col gap-2 p-3 bg-surface-container-lowest/80 rounded-2xl border border-border/60 shadow-inner w-full md:w-44">
          <span class="text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1 flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px] text-amber-gold">verified</span>
            <span>Quick Stamps</span>
          </span>
          <button class="stamp-btn flex items-center gap-2.5 px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-bright border border-border/60 text-xs font-semibold text-gray-200 transition-all active:scale-95" data-stamp="FIRE">
            <span>🔥</span>
            <span>Campfire</span>
          </button>
          <button class="stamp-btn flex items-center gap-2.5 px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-bright border border-border/60 text-xs font-semibold text-gray-200 transition-all active:scale-95" data-stamp="HEART">
            <span>💖</span>
            <span>Pod Love</span>
          </button>
          <button class="stamp-btn flex items-center gap-2.5 px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-bright border border-border/60 text-xs font-semibold text-gray-200 transition-all active:scale-95" data-stamp="STAR">
            <span>⭐</span>
            <span>Camp Star</span>
          </button>
          <button class="stamp-btn flex items-center gap-2.5 px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-bright border border-border/60 text-xs font-semibold text-gray-200 transition-all active:scale-95" data-stamp="GHOST">
            <span>👻</span>
            <span>Night Owl</span>
          </button>
        </div>
      </div>

      <!-- Feedback Banner -->
      <div id="graffiti-feedback" class="min-h-[20px] text-xs font-bold text-mint-green text-center mt-3 transition-opacity"></div>
    </div>
  `;
}

export function bindPixelGraffitiEvents() {
  const canvas = document.getElementById('graffiti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const cellSize = canvas.width / GRID_SIZE; // 10px per cell

  // Redraw canvas from pixelGrid state
  const redraw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const color = pixelGrid[r * GRID_SIZE + c];
        ctx.fillStyle = color;
        ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);

        // Faint grid lines if enabled
        if (showGrid) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
      }
    }
  };

  redraw();

  // Save history state before changes
  const saveState = () => {
    historyStack.push([...pixelGrid]);
    if (historyStack.length > 25) {
      historyStack.shift();
    }
  };

  // Flood fill algorithm for bucket tool
  const floodFill = (startX, startY, targetColor, fillColor) => {
    if (targetColor === fillColor) return;
    const queue = [[startX, startY]];
    const visited = new Uint8Array(GRID_SIZE * GRID_SIZE);

    while (queue.length > 0) {
      const [x, y] = queue.pop();
      const idx = y * GRID_SIZE + x;

      if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) continue;
      if (visited[idx]) continue;
      if (pixelGrid[idx] !== targetColor) continue;

      visited[idx] = 1;
      pixelGrid[idx] = fillColor;

      queue.push([x + 1, y]);
      queue.push([x - 1, y]);
      queue.push([x, y + 1]);
      queue.push([x, y - 1]);
    }
  };

  // Stamp stamping helper
  const applyStamp = (stampName, centerX, centerY) => {
    const stamp = STAMPS[stampName];
    if (!stamp) return;
    saveState();

    stamp.forEach(([dx, dy, color]) => {
      const px = centerX + dx;
      const py = centerY + dy;
      if (px >= 0 && px < GRID_SIZE && py >= 0 && py < GRID_SIZE) {
        pixelGrid[py * GRID_SIZE + px] = color;
      }
    });

    chiptune.playCoin();
    redraw();
  };

  // Paint / Interact at cell coordinates
  const interactAt = (x, y, isStart = false) => {
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return;
    const idx = y * GRID_SIZE + x;

    if (activeTool === 'PICKER') {
      selectedColor = pixelGrid[idx];
      activeTool = 'PENCIL';
      chiptune.playPixelBlip();
      updatePaletteUI();
      updateToolUI();
      return;
    }

    if (activeTool === 'BUCKET') {
      if (isStart) {
        saveState();
        floodFill(x, y, pixelGrid[idx], selectedColor);
        chiptune.playJump();
        redraw();
      }
      return;
    }

    if (activeTool === 'ERASER') {
      if (pixelGrid[idx] !== '#0B0E17') {
        if (isStart) saveState();
        pixelGrid[idx] = '#0B0E17';
        chiptune.playPixelBlip();
        redraw();
      }
      return;
    }

    // Default: PENCIL
    if (pixelGrid[idx] !== selectedColor) {
      if (isStart) saveState();
      pixelGrid[idx] = selectedColor;
      chiptune.playPixelBlip();
      redraw();
    }
  };

  const getCanvasCoords = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((clientX - rect.left) / rect.width) * GRID_SIZE);
    const y = Math.floor(((clientY - rect.top) / rect.height) * GRID_SIZE);
    return { x, y };
  };

  const updateCoordsHUD = (x, y) => {
    const coordsText = document.getElementById('coords-text');
    if (coordsText) {
      if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
        coordsText.textContent = `X: ${String(x).padStart(2, '0')}, Y: ${String(y).padStart(2, '0')}`;
      } else {
        coordsText.textContent = 'X: --, Y: --';
      }
    }
  };

  // Mouse handlers
  canvas.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    interactAt(x, y, true);
  });

  window.addEventListener('mouseup', () => {
    isMouseDown = false;
  });

  canvas.addEventListener('mousemove', (e) => {
    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    updateCoordsHUD(x, y);
    if (isMouseDown) {
      interactAt(x, y, false);
    }
  });

  canvas.addEventListener('mouseleave', () => {
    updateCoordsHUD(-1, -1);
  });

  // Touch handlers
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isMouseDown = true;
    const touch = e.touches[0] || e.changedTouches[0];
    const { x, y } = getCanvasCoords(touch.clientX, touch.clientY);
    updateCoordsHUD(x, y);
    interactAt(x, y, true);
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (isMouseDown) {
      const touch = e.touches[0] || e.changedTouches[0];
      const { x, y } = getCanvasCoords(touch.clientX, touch.clientY);
      updateCoordsHUD(x, y);
      interactAt(x, y, false);
    }
  }, { passive: false });

  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    isMouseDown = false;
  }, { passive: false });

  // Tool buttons
  const toolBtns = document.querySelectorAll('.pixel-tool-btn');
  const updateToolUI = () => {
    toolBtns.forEach((btn) => {
      const tool = btn.dataset.tool;
      if (tool === activeTool) {
        btn.className = 'pixel-tool-btn w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-primary-container text-on-primary shadow-md';
      } else {
        btn.className = 'pixel-tool-btn w-10 h-10 rounded-xl flex items-center justify-center transition-all text-gray-400 hover:text-white hover:bg-surface-bright';
      }
    });
  };

  toolBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      activeTool = btn.dataset.tool;
      chiptune.playPixelBlip();
      updateToolUI();
    });
  });

  // Color palette buttons
  const paletteEl = document.getElementById('graffiti-palette');
  const updatePaletteUI = () => {
    if (!paletteEl) return;
    const swatches = paletteEl.querySelectorAll('.palette-swatch');
    swatches.forEach((s) => {
      const color = s.dataset.color;
      if (color === selectedColor) {
        s.style.borderColor = '#FFFFFF';
        s.innerHTML = '<div class="w-1.5 h-1.5 rounded-full bg-white shadow-sm"></div>';
      } else {
        s.style.borderColor = 'rgba(255,255,255,0.1)';
        s.innerHTML = '';
      }
    });
  };

  if (paletteEl) {
    paletteEl.addEventListener('click', (e) => {
      const swatch = e.target.closest('.palette-swatch');
      if (!swatch) return;
      selectedColor = swatch.dataset.color;
      if (activeTool === 'ERASER') activeTool = 'PENCIL';
      chiptune.playPixelBlip();
      updatePaletteUI();
      updateToolUI();
    });
  }

  // Stamp buttons
  const stampBtns = document.querySelectorAll('.stamp-btn');
  stampBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const stamp = btn.dataset.stamp;
      // Stamp in center or random campfire spot
      const cx = 16 + Math.floor((Math.random() - 0.5) * 8);
      const cy = 16 + Math.floor((Math.random() - 0.5) * 8);
      applyStamp(stamp, cx, cy);
    });
  });

  // Undo button
  const undoBtn = document.getElementById('btn-pixel-undo');
  if (undoBtn) {
    undoBtn.addEventListener('click', () => {
      if (historyStack.length > 0) {
        chiptune.playJump();
        pixelGrid = historyStack.pop();
        redraw();
      }
    });
  }

  // Toggle Grid
  const gridToggleBtn = document.getElementById('btn-pixel-grid-toggle');
  if (gridToggleBtn) {
    gridToggleBtn.addEventListener('click', () => {
      showGrid = !showGrid;
      chiptune.playPixelBlip();
      if (showGrid) {
        gridToggleBtn.className = 'px-3 py-1.5 rounded-xl bg-amber-gold/20 text-amber-gold border-amber-gold/40 border text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95';
      } else {
        gridToggleBtn.className = 'px-3 py-1.5 rounded-xl bg-surface-container-high text-gray-400 border-border/70 border text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95';
      }
      redraw();
    });
  }

  // Clear Canvas
  const clearBtn = document.getElementById('btn-pixel-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      saveState();
      chiptune.playRoastBuzzer();
      pixelGrid = Array(GRID_SIZE * GRID_SIZE).fill('#0B0E17');
      redraw();
    });
  }

  // Export to Yearbook
  const exportBtn = document.getElementById('btn-pixel-export');
  const feedbackEl = document.getElementById('graffiti-feedback');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      chiptune.playFanfare();

      // Create high-res export canvas without grid lines
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = 640;
      exportCanvas.height = 640;
      const expCtx = exportCanvas.getContext('2d');
      expCtx.imageSmoothingEnabled = false;

      const expCell = 640 / GRID_SIZE;
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          expCtx.fillStyle = pixelGrid[r * GRID_SIZE + c];
          expCtx.fillRect(c * expCell, r * expCell, expCell, expCell);
        }
      }

      const dataUrl = exportCanvas.toDataURL('image/png');
      const author = store.getState().currentUser.displayName || 'Campfire Squad';

      const newMemory = {
        id: `pixel_art_${Date.now()}`,
        type: 'PIXEL_GRAFFITI',
        title: '32-Bit Pixel Glade Artifact',
        quote: 'Collaboratively illustrated in Pixel Glade · Archived for 2026 Yearbook',
        author: author,
        timestamp: 'Just now',
        imageData: dataUrl,
        isPlayable: true,
      };

      const currentMemories = store.getState().vaultMemories || [];
      store.setState({ vaultMemories: [newMemory, ...currentMemories] });

      if (feedbackEl) {
        feedbackEl.innerHTML = '<span class="text-mint-green flex items-center justify-center gap-1.5"><span class="material-symbols-outlined text-[16px]">check_circle</span> Pixel masterpiece archived into Pod Vault & 2026 Photobook!</span>';
        setTimeout(() => (feedbackEl.innerHTML = ''), 4000);
      }
    });
  }
}
