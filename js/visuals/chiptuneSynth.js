// ==============================================================================
// 8-BIT RETRO CHIPTUNE WEB AUDIO SYNTHESIZER
// Generates nostalgic square-wave melodies, noise bursts, and retro game SFX
// Zero external MP3 downloads, sub-millisecond latency
// ==============================================================================

import { store } from '../state/store.js';

class ChiptuneSynthesizer {
  constructor() {
    this.ctx = null;
  }

  initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  isSoundActive() {
    return store.getState().soundEnabled;
  }

  // Play a retro 8-bit tone
  playTone(freq, type = 'square', duration = 0.1, gainVal = 0.08) {
    if (!this.isSoundActive()) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Chiptune tone error:', e);
    }
  }

  // Pixel Paint / Canvas Click (High blip)
  playPixelBlip() {
    this.playTone(880, 'square', 0.05, 0.05);
  }

  // Coin / Sparks collected sound (Two ascending square tones)
  playCoin() {
    if (!this.isSoundActive()) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, t); // B5
      osc.frequency.setValueAtTime(1318.51, t + 0.08); // E6

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(t + 0.28);
    } catch (e) {
      console.warn('Chiptune coin error:', e);
    }
  }

  // Jump / Toss SFX (Rapid pitch slide)
  playJump() {
    if (!this.isSoundActive()) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(600, t + 0.15);

      gain.gain.setValueAtTime(0.07, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(t + 0.15);
    } catch (e) {
      console.warn('Chiptune jump error:', e);
    }
  }

  // Marshmallow Sizzle (White noise buffer)
  playSizzle() {
    if (!this.isSoundActive()) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.12;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {
      console.warn('Chiptune sizzle error:', e);
    }
  }

  // 8-Bit Victory / Fanfare Melody
  playFanfare() {
    if (!this.isSoundActive()) return;
    const notes = [
      { f: 523.25, d: 0.1 }, // C5
      { f: 659.25, d: 0.1 }, // E5
      { f: 783.99, d: 0.1 }, // G5
      { f: 1046.5, d: 0.25 }, // C6
    ];

    let delay = 0;
    notes.forEach((note) => {
      setTimeout(() => {
        this.playTone(note.f, 'triangle', note.d, 0.1);
      }, delay * 1000);
      delay += note.d * 0.85;
    });
  }

  // 8-Bit Roast Reaction (Buzzy low square pulse)
  playRoastBuzzer() {
    this.playTone(180, 'sawtooth', 0.18, 0.08);
  }
}

export const chiptune = new ChiptuneSynthesizer();
