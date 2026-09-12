// ==============================================================================
// 16-BIT RETRO PIXEL CANVAS ENGINE
// Renders animated campfire glade, parallax starry sky, ember physics, and pixel avatars
// ==============================================================================

import { store } from '../state/store.js';

export class PixelGladeEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.animationFrame = null;
    this.lastTime = 0;
    this.time = 0;

    // Embers particle system
    this.embers = [];
    this.stars = [];

    const state = store?.getState();
    const user = state?.currentUser;
    const hostName = (user && user.isLoggedIn && user.displayName) ? user.displayName.split(' ')[0] : 'Host (You)';
    const roomPlayers = state?.activeRoom?.players || [];

    const seatColors = ['#FF5A5F', '#FFB703', '#F72585', '#4ADE80', '#38BDF8', '#A78BFA'];
    const seatPositions = [
      { x: 0.22, y: 0.68 },
      { x: 0.36, y: 0.74 },
      { x: 0.64, y: 0.74 },
      { x: 0.78, y: 0.68 },
      { x: 0.30, y: 0.62 },
      { x: 0.70, y: 0.62 },
    ];

    if (roomPlayers.length > 0) {
      this.characters = roomPlayers.slice(0, 6).map((p, idx) => ({
        id: p.id || `c_${idx}`,
        name: p.name,
        role: p.role || 'Camper',
        color: seatColors[idx % seatColors.length],
        x: seatPositions[idx % seatPositions.length].x,
        y: seatPositions[idx % seatPositions.length].y,
        quote: idx === 0 ? 'Welcome to the campfire ✨' : 'Squad vibe locked in 🔥',
        speechTimer: 0,
        animFrame: 0,
      }));
    } else {
      this.characters = [
        { id: 'c1', name: hostName, role: 'Host', color: '#FF5A5F', x: 0.50, y: 0.70, quote: 'Welcome to the Campfire ✨', speechTimer: 0, animFrame: 0 },
      ];
    }

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Generate parallax stars
    this.stars = [];
    for (let i = 0; i < 70; i++) {
      this.stars.push({
        x: Math.random(),
        y: Math.random() * 0.5,
        size: Math.random() > 0.8 ? 3 : 2,
        twinkleSpeed: Math.random() * 2 + 1,
        alpha: Math.random() * 0.7 + 0.3,
      });
    }

    // Seed embers
    this.embers = [];
    for (let i = 0; i < 35; i++) {
      this.embers.push(this.createEmber());
    }

    // Bind canvas clicks & touch taps to trigger character speech bubbles
    this.canvas.addEventListener('click', (e) => this.handleCanvasInteraction(e));
    this.canvas.addEventListener('touchstart', (e) => this.handleCanvasInteraction(e), { passive: false });

    this.start();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    // Disable image smoothing for crisp pixel aesthetics
    this.ctx.imageSmoothingEnabled = false;
  }

  createEmber() {
    const fireX = this.canvas.width * 0.5;
    const fireY = this.canvas.height * 0.72;
    return {
      x: fireX + (Math.random() - 0.5) * 24,
      y: fireY,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -(Math.random() * 2.2 + 1.2),
      size: Math.floor(Math.random() * 3 + 2),
      life: Math.random() * 50 + 40,
      maxLife: 90,
      color: Math.random() > 0.4 ? '#FFB703' : '#FF5A5F',
    };
  }

  handleCanvasInteraction(e) {
    let clientX = e.clientX;
    let clientY = e.clientY;

    if (e.type === 'touchstart') {
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
    }

    const rect = this.canvas.getBoundingClientRect();
    const clickX = (clientX - rect.left) / rect.width;
    const clickY = (clientY - rect.top) / rect.height;

    // Check if a character was clicked / tapped
    this.characters.forEach((char) => {
      const dist = Math.hypot(char.x - clickX, char.y - clickY);
      if (dist < 0.14) {
        char.speechTimer = 180; // Display speech bubble for 3 seconds (60fps * 3)
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(15);
        }
      }
    });
  }

  triggerRandomSpeech() {
    const randomChar = this.characters[Math.floor(Math.random() * this.characters.length)];
    if (randomChar) randomChar.speechTimer = 180;
  }

  start() {
    const loop = (timestamp) => {
      if (!this.lastTime) this.lastTime = timestamp;
      const dt = (timestamp - this.lastTime) / 1000;
      this.lastTime = timestamp;
      this.time += dt;

      this.update(dt);
      this.render();

      this.animationFrame = requestAnimationFrame(loop);
    };
    this.animationFrame = requestAnimationFrame(loop);
  }

  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  update(dt) {
    // Update embers
    this.embers.forEach((ember) => {
      ember.x += ember.vx + Math.sin(this.time * 4 + ember.y * 0.05) * 0.4;
      ember.y += ember.vy;
      ember.life--;
      if (ember.life <= 0 || ember.y < this.canvas.height * 0.1) {
        Object.assign(ember, this.createEmber());
      }
    });

    // Update characters
    this.characters.forEach((char) => {
      if (char.speechTimer > 0) char.speechTimer--;
      char.animFrame = Math.floor(this.time * 3) % 2;
    });
  }

  render() {
    const { width, height } = this.canvas;
    const ctx = this.ctx;

    // 1. Clear & Background Gradient (Deep Midnight Forest)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, '#070A12');
    skyGrad.addColorStop(0.65, '#0E1424');
    skyGrad.addColorStop(1, '#0B0F19');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Parallax Twinkling Stars
    this.stars.forEach((star) => {
      const alpha = star.alpha * (0.6 + 0.4 * Math.sin(this.time * star.twinkleSpeed));
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(Math.floor(star.x * width), Math.floor(star.y * height), star.size, star.size);
    });

    // 3. Moon in top right
    const moonX = width * 0.85;
    const moonY = height * 0.18;
    ctx.fillStyle = 'rgba(255, 243, 205, 0.9)';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#070A12';
    ctx.beginPath();
    ctx.arc(moonX + 6, moonY - 3, 15, 0, Math.PI * 2);
    ctx.fill();

    // 4. Forest Tree Silhouettes (Backdrop)
    ctx.fillStyle = '#090D18';
    this.renderTreeLine(ctx, width, height * 0.58, 16);

    // 5. Campsite Ground (Soft warm dirt)
    ctx.fillStyle = '#141824';
    ctx.fillRect(0, height * 0.65, width, height * 0.35);

    // Ground grass edge
    ctx.fillStyle = '#1B2234';
    for (let x = 0; x < width; x += 12) {
      ctx.fillRect(x, height * 0.65 - 4, 8, 4);
    }

    // 6. Warm Campfire Ambient Radial Glow
    const fireX = width * 0.5;
    const fireY = height * 0.72;
    const glowRadius = 140 + Math.sin(this.time * 8) * 15;
    const glowGrad = ctx.createRadialGradient(fireX, fireY, 5, fireX, fireY, glowRadius);
    glowGrad.addColorStop(0, 'rgba(255, 183, 3, 0.45)');
    glowGrad.addColorStop(0.4, 'rgba(255, 90, 95, 0.2)');
    glowGrad.addColorStop(1, 'rgba(255, 90, 95, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(fireX, fireY, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    // 7. Wooden Log Benches
    ctx.fillStyle = '#3E2723';
    // Left log
    ctx.fillRect(width * 0.18, height * 0.75, width * 0.22, 12);
    // Right log
    ctx.fillRect(width * 0.6, height * 0.75, width * 0.22, 12);

    // 8. Pixel Campfire Logs & Stones
    ctx.fillStyle = '#4B5563';
    for (let i = -3; i <= 3; i++) {
      ctx.fillRect(fireX + i * 8 - 4, fireY + 12, 8, 6);
    }
    ctx.fillStyle = '#5D4037';
    ctx.fillRect(fireX - 16, fireY + 8, 32, 6);
    ctx.fillRect(fireX - 12, fireY + 2, 24, 6);

    // 9. Animated 16-Bit Campfire Flame (Layered flickering pixel blocks)
    const flicker = Math.sin(this.time * 12) * 3;
    // Outer flame (Coral Red)
    ctx.fillStyle = '#FF5A5F';
    ctx.fillRect(fireX - 12, fireY - 14 + flicker, 24, 22);
    ctx.fillRect(fireX - 8, fireY - 22 + flicker, 16, 12);
    ctx.fillRect(fireX - 4, fireY - 30 + flicker, 8, 10);

    // Inner flame (Amber Gold)
    ctx.fillStyle = '#FFB703';
    ctx.fillRect(fireX - 8, fireY - 10 + flicker, 16, 16);
    ctx.fillRect(fireX - 4, fireY - 18 + flicker, 8, 10);

    // Flame Core (White-Yellow)
    ctx.fillStyle = '#FFF9DB';
    ctx.fillRect(fireX - 4, fireY - 6 + flicker, 8, 10);

    // 10. Embers Particles
    this.embers.forEach((ember) => {
      ctx.fillStyle = ember.color;
      ctx.fillRect(Math.floor(ember.x), Math.floor(ember.y), ember.size, ember.size);
    });

    // 11. Render Pixel Characters around the fire
    this.characters.forEach((char) => {
      this.renderPixelCharacter(ctx, char, width, height);
    });
  }

  renderTreeLine(ctx, width, y, count) {
    const step = width / count;
    for (let i = 0; i < count; i++) {
      const tx = i * step + step * 0.5;
      const th = 40 + (i % 3) * 15;
      ctx.beginPath();
      ctx.moveTo(tx, y - th);
      ctx.lineTo(tx - 18, y + 15);
      ctx.lineTo(tx + 18, y + 15);
      ctx.closePath();
      ctx.fill();
    }
  }

  renderPixelCharacter(ctx, char, width, height) {
    const cx = Math.floor(char.x * width);
    const cy = Math.floor(char.y * height);
    const bob = char.animFrame === 1 ? -2 : 0;

    // Head (14x14 pixel square)
    ctx.fillStyle = '#F8D7DA';
    ctx.fillRect(cx - 7, cy - 26 + bob, 14, 14);

    // Hair
    ctx.fillStyle = char.color;
    ctx.fillRect(cx - 8, cy - 30 + bob, 16, 6);
    ctx.fillRect(cx - 8, cy - 26 + bob, 4, 8);

    // Eyes
    ctx.fillStyle = '#0B0E17';
    ctx.fillRect(cx - 3, cy - 21 + bob, 2, 3);
    ctx.fillRect(cx + 3, cy - 21 + bob, 2, 3);

    // Body / Hoodie
    ctx.fillStyle = char.color;
    ctx.fillRect(cx - 8, cy - 12 + bob, 16, 16);

    // Legs / Pants
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(cx - 6, cy + 4, 5, 8);
    ctx.fillRect(cx + 1, cy + 4, 5, 8);

    // Character Name Tag
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 10px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(char.name, cx, cy + 22);

    // Speech Bubble (If triggered)
    if (char.speechTimer > 0) {
      const bubbleW = 160;
      const bubbleH = 40;
      const bx = Math.min(width - bubbleW - 10, Math.max(10, cx - bubbleW / 2));
      const by = cy - 65;

      // Bubble Box
      ctx.fillStyle = '#161926';
      ctx.strokeStyle = char.color;
      ctx.lineWidth = 2;
      ctx.fillRect(bx, by, bubbleW, bubbleH);
      ctx.strokeRect(bx, by, bubbleW, bubbleH);

      // Bubble text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '9px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`"${char.quote}"`, bx + bubbleW / 2, by + 22, bubbleW - 14);
    }
  }
}
