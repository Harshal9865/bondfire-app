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
      emoji: '🏃‍♂️'
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
      const obstacleTypes = ['🕳️', '🐕', '🛺', '👵'];
      const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
      this.obstacles.push({
        x: this.width + 20,
        y: 135,
        type,
        speed: 3.5
      });
    }

    // Move obstacles & check collision
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const ob = this.obstacles[i];
      ob.x -= ob.speed;

      // Hitbox check
      if (Math.abs(ob.x - this.player.x) < 20 && this.player.y > 115) {
        this.isGameOver = true;
        this.isRunning = false;
        audio.playWrongBuzzer();
        if (this.timerId) clearInterval(this.timerId);
        break;
      }

      if (ob.x < -30) {
        this.obstacles.splice(i, 1);
        this.score += 10;
      }
    }
  }

  draw() {
    this.ctx.fillStyle = '#0B0E17';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Ground line
    this.ctx.strokeStyle = '#262B40';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, 155);
    this.ctx.lineTo(this.width, 155);
    this.ctx.stroke();

    // Draw Player (Carrying Chai tray)
    this.ctx.font = '24px sans-serif';
    this.ctx.fillText(this.player.emoji, this.player.x - 10, this.player.y + 20);
    this.ctx.font = '16px sans-serif';
    this.ctx.fillText('☕', this.player.x + 8, this.player.y + 4);

    // Draw Obstacles
    for (const ob of this.obstacles) {
      this.ctx.font = '20px sans-serif';
      this.ctx.fillText(ob.type, ob.x, ob.y + 15);
    }

    // HUD: Timer & Score
    this.ctx.fillStyle = '#FFAE33';
    this.ctx.font = 'bold 12px monospace';
    this.ctx.fillText(`⏱️ 00:${this.gameTimer.toString().padStart(2, '0')}s`, 15, 25);
    this.ctx.fillStyle = '#4DE082';
    this.ctx.fillText(`PTS: ${this.score}`, this.width - 70, 25);

    // Overlays
    if (!this.isRunning && !this.isGameOver && !this.hasWon) {
      this.ctx.fillStyle = 'rgba(11, 14, 23, 0.75)';
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = 'bold 14px "Space Grotesk", sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('☕ Tap or Press Space to Deliver Chai!', this.width / 2, this.height / 2 - 5);
      this.ctx.font = '11px monospace';
      this.ctx.fillStyle = '#FFAE33';
      this.ctx.fillText('Dodge potholes & rickshaws for 15s', this.width / 2, this.height / 2 + 18);
      this.ctx.textAlign = 'left';
    } else if (this.isGameOver) {
      this.ctx.fillStyle = 'rgba(11, 14, 23, 0.85)';
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.fillStyle = '#FF5A5F';
      this.ctx.font = 'bold 16px "Space Grotesk", sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('💥 CHAI SPILLED!', this.width / 2, this.height / 2 - 5);
      this.ctx.font = '11px monospace';
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.fillText('Tap to Try Again', this.width / 2, this.height / 2 + 18);
      this.ctx.textAlign = 'left';
    } else if (this.hasWon) {
      this.ctx.fillStyle = 'rgba(11, 14, 23, 0.85)';
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.fillStyle = '#4DE082';
      this.ctx.font = 'bold 16px "Space Grotesk", sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('🎉 CHAI DELIVERED TO THE TABLE!', this.width / 2, this.height / 2 - 5);
      this.ctx.font = '11px monospace';
      this.ctx.fillStyle = '#FFAE33';
      this.ctx.fillText('+200 Sparks Awarded! Tap to Replay', this.width / 2, this.height / 2 + 18);
      this.ctx.textAlign = 'left';
    }
  }
}
