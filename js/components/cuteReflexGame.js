// ==============================================================================
// BONDFIRE CUTE REFLEX MINI-GAME: CHAI DELIVERY SPRINT ☕
// 15-second retro micro-game for intermission / lobby waiting
// One-tap jump over potholes, street dogs & aunty obstacles!
// ==============================================================================

import { audio } from '../visuals/audioSynth.js';

export class CuteChaiGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width = 400;
    this.height = this.canvas.height = 180;
    
    this.player = {
      x: 50,
      y: 130,
      width: 24,
      height: 32,
      vy: 0,
      isGrounded: true,
      sprite: 'runner'
    };

    this.obstacles = [];
    this.score = 0;
    this.isGameOver = false;
    this.hasWon = false;
    this.gameTimer = 15; // 15-second challenge
    this.isRunning = false;
    this.spawnCounter = 0;

    this.bindEvents();
  }

  bindEvents() {
    this.handleJump = (e) => {
      e.preventDefault();
      if (!this.isRunning && !this.isGameOver) {
        this.start();
      }
      if (this.player.isGrounded && this.isRunning) {
        this.player.vy = -11;
        this.player.isGrounded = false;
        audio.playBip();
      } else if (this.isGameOver || this.hasWon) {
        this.reset();
        this.start();
      }
    };

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') this.handleJump(e);
    });

    if (this.canvas) {
      this.canvas.addEventListener('touchstart', this.handleJump);
      this.canvas.addEventListener('mousedown', this.handleJump);
    }
  }

  start() {
    this.isRunning = true;
    this.isGameOver = false;
    this.hasWon = false;
    this.score = 0;
    this.gameTimer = 15;
    this.obstacles = [];
    this.timerId = setInterval(() => {
      if (this.gameTimer > 0) {
        this.gameTimer--;
      } else {
        this.hasWon = true;
        this.isRunning = false;
        audio.playChime();
        clearInterval(this.timerId);
      }
    }, 1000);

    this.loop();
  }

  reset() {
    this.player.y = 130;
    this.player.vy = 0;
    this.player.isGrounded = true;
    this.obstacles = [];
    this.isGameOver = false;
    this.hasWon = false;
    this.gameTimer = 15;
    if (this.timerId) clearInterval(this.timerId);
  }

  loop() {
    if (!this.isRunning) {
      this.draw();
      return;
    }

    this.update();
    this.draw();
    requestAnimationFrame(() => this.loop());
  }

  update() {
    // Gravity
    this.player.vy += 0.65;
    this.player.y += this.player.vy;

    if (this.player.y >= 130) {
      this.player.y = 130;
      this.player.vy = 0;
      this.player.isGrounded = true;
    }

    // Spawn obstacles
    this.spawnCounter++;
    if (this.spawnCounter > 75) {
      this.spawnCounter = 0;
      const obstacleTypes = [
        { label: 'POTHOLE', color: '#FF5A5F', w: 22, h: 10 },
        { label: 'BARRIER', color: '#FFB703', w: 14, h: 22 },
        { label: 'CONE', color: '#F72585', w: 12, h: 18 }
      ];
      const ob = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
      this.obstacles.push({
        x: this.width + 20,
        y: 155 - ob.h,
        w: ob.w,
        h: ob.h,
        color: ob.color,
        speed: 3.5
      });
    }

    // Move obstacles & check collision
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const ob = this.obstacles[i];
      ob.x -= ob.speed;

      // Hitbox check
      if (
        this.player.x + 18 > ob.x &&
        this.player.x < ob.x + ob.w &&
        this.player.y + 24 > ob.y
      ) {
        this.isGameOver = true;
        this.isRunning = false;
        audio.playWrongBuzzer();
        if (this.timerId) clearInterval(this.timerId);
        break;
      }

      if (ob.x < -30) {
        this.obstacles.splice(i, 1);
        this.score += 25;
      }
    }
  }

  draw() {
    this.ctx.fillStyle = '#070910';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Grid lines for retro synthwave feel
    this.ctx.strokeStyle = '#151A28';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 30) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, 155);
      this.ctx.stroke();
    }

    // Neon Ground line
    this.ctx.strokeStyle = '#FF5A5F';
    this.ctx.lineWidth = 2;
    this.ctx.shadowColor = '#FF5A5F';
    this.ctx.shadowBlur = 6;
    this.ctx.beginPath();
    this.ctx.moveTo(0, 155);
    this.ctx.lineTo(this.width, 155);
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;

    // Draw Player (Pixel Art Runner with Chai Cup)
    const px = this.player.x;
    const py = this.player.y;

    // Head
    this.ctx.fillStyle = '#FFD166';
    this.ctx.fillRect(px + 4, py, 8, 8);
    // Body / Hoodie
    this.ctx.fillStyle = '#06D6A0';
    this.ctx.fillRect(px + 2, py + 8, 12, 12);
    // Legs
    this.ctx.fillStyle = '#3B82F6';
    const legOffset = this.isRunning ? (Math.floor(Date.now() / 100) % 2 ? 3 : -3) : 0;
    this.ctx.fillRect(px + 3 + legOffset, py + 20, 4, 8);
    this.ctx.fillRect(px + 9 - legOffset, py + 20, 4, 8);

    // Chai Tray & Tea Cup (Retro Pixel vector)
    this.ctx.fillStyle = '#FFB703';
    this.ctx.fillRect(px + 12, py + 6, 8, 3); // tray
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(px + 14, py + 1, 5, 5); // cup
    this.ctx.fillStyle = '#FF5A5F';
    this.ctx.fillRect(px + 15, py - 2, 3, 2); // steam

    // Draw Obstacles (Retro Cyber Neon Hurdles)
    for (const ob of this.obstacles) {
      this.ctx.fillStyle = ob.color;
      this.ctx.shadowColor = ob.color;
      this.ctx.shadowBlur = 6;
      this.ctx.fillRect(ob.x, ob.y, ob.w, ob.h);
      this.ctx.shadowBlur = 0;

      // Inner pixel stripe
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.fillRect(ob.x + 2, ob.y + 2, ob.w - 4, 2);
    }

    // HUD: Timer & Score in Silkscreen Retro Font
    this.ctx.fillStyle = '#FFB703';
    this.ctx.font = "bold 10px 'Silkscreen', monospace";
    this.ctx.fillText(`TIME: 00:${this.gameTimer.toString().padStart(2, '0')}S`, 15, 22);

    this.ctx.fillStyle = '#06D6A0';
    this.ctx.fillText(`SCORE: ${this.score}`, this.width - 95, 22);

    // Overlays
    if (!this.isRunning && !this.isGameOver && !this.hasWon) {
      this.ctx.fillStyle = 'rgba(7, 9, 16, 0.82)';
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = "bold 11px 'Silkscreen', monospace";
      this.ctx.textAlign = 'center';
      this.ctx.fillText('CHAI SPRINT: PRESS SPACE TO JUMP', this.width / 2, this.height / 2 - 6);
      this.ctx.font = "9px 'Silkscreen', monospace";
      this.ctx.fillStyle = '#FFB703';
      this.ctx.fillText('DELIVER TO TABLE BEFORE TIME EXPIRES', this.width / 2, this.height / 2 + 16);
      this.ctx.textAlign = 'left';
    } else if (this.isGameOver) {
      this.ctx.fillStyle = 'rgba(7, 9, 16, 0.88)';
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.fillStyle = '#FF5A5F';
      this.ctx.font = "bold 13px 'Silkscreen', monospace";
      this.ctx.textAlign = 'center';
      this.ctx.fillText('MISSION FAILED: CHAI DROPPED', this.width / 2, this.height / 2 - 6);
      this.ctx.font = "9px 'Silkscreen', monospace";
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.fillText('TAP OR PRESS SPACE TO RETRY', this.width / 2, this.height / 2 + 16);
      this.ctx.textAlign = 'left';
    } else if (this.hasWon) {
      this.ctx.fillStyle = 'rgba(7, 9, 16, 0.88)';
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.fillStyle = '#06D6A0';
      this.ctx.font = "bold 12px 'Silkscreen', monospace";
      this.ctx.textAlign = 'center';
      this.ctx.fillText('MISSION COMPLETE: CHAI DELIVERED!', this.width / 2, this.height / 2 - 6);
      this.ctx.font = "9px 'Silkscreen', monospace";
      this.ctx.fillStyle = '#FFB703';
      this.ctx.fillText('+200 SPARKS EARNED · TAP TO REPLAY', this.width / 2, this.height / 2 + 16);
      this.ctx.textAlign = 'left';
    }
  }
}
