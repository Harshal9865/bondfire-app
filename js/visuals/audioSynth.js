// ==============================================================================
// PROCEDURAL WEB AUDIO SYNTHESIZER
// Generates zero-latency tactile sound effects via native Web Audio API
// ==============================================================================

import { store } from '../state/store.js';

class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    if (typeof window !== 'undefined') {
      window.__bondfireAudio = this;
      this.setupMobileUnlock();
    }
  }

  setupMobileUnlock() {
    if (typeof window === 'undefined') return;
    const unlock = () => {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    };
    ['touchstart', 'touchend', 'click', 'keydown'].forEach((ev) => {
      window.addEventListener(ev, unlock, { once: true, passive: true });
    });
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && !this.masterGain) {
      try {
        this.masterGain = this.ctx.createGain();
        const settings = store.getState().settings;
        const volumePercent = (settings && typeof settings.masterVolume === 'number') ? settings.masterVolume : 80;
        this.masterGain.gain.setValueAtTime(volumePercent / 100, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      } catch (_) {}
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  getDestination() {
    this.init();
    return this.masterGain || (this.ctx ? this.ctx.destination : null);
  }

  setMasterVolume(percent) {
    const clamped = Math.max(0, Math.min(100, Number(percent) || 0));
    if (this.ctx && this.masterGain) {
      try {
        this.masterGain.gain.setValueAtTime(clamped / 100, this.ctx.currentTime);
      } catch (_) {}
    }
  }

  triggerHaptic(duration = 15) {
    const state = store.getState();
    const hapticsEnabled = state.settings ? (state.settings.hapticsEnabled !== false) : true;
    if (!hapticsEnabled) return;
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(duration);
      } catch (_) {}
    }
  }

  isEnabled() {
    const state = store.getState();
    const sfxEnabled = state.settings ? (state.settings.sfxEnabled !== false) : true;
    const soundEnabled = state.soundEnabled !== false;
    const masterVolume = state.settings ? (state.settings.masterVolume ?? 80) : 80;
    return soundEnabled && sfxEnabled && masterVolume > 0;
  }

  /**
   * Warm ambient chime
   */
  playChime() {
    if (!this.isEnabled()) return;
    this.init();
    this.triggerHaptic(20);
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.3);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.getDestination());

    osc.start(now);
    osc.stop(now + 0.3);
  }

  /**
   * Tactile click / tap snap
   */
  playClick() {
    if (!this.isEnabled()) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.getDestination());

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  /**
   * Countdown timer tick
   */
  playTick() {
    if (!this.isEnabled()) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(this.getDestination());

    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }

  /**
   * Countdown bip / pulse sound for pre-game countdown
   */
  playBip() {
    if (!this.isEnabled()) return;
    this.init();
    this.triggerHaptic(15);
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.getDestination());

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (_) {}
  }

  /**
   * Correct Answer Chime
   */
  playCorrect() {
    if (!this.isEnabled()) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0, now + idx * 0.07);
      gain.gain.linearRampToValueAtTime(0.14, now + idx * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);

      osc.connect(gain);
      gain.connect(this.getDestination());

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.25);
    });
  }

  /**
   * Victory Fanfare
   */
  playFanfare() {
    if (!this.isEnabled()) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chords = [
      { freqs: [440, 554.37, 659.25], time: 0 },
      { freqs: [523.25, 659.25, 783.99], time: 0.15 },
      { freqs: [587.33, 739.99, 880], time: 0.3 },
    ];

    chords.forEach(({ freqs, time }) => {
      freqs.forEach((f) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + time);

        gain.gain.setValueAtTime(0.1, now + time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + 0.4);

        osc.connect(gain);
        gain.connect(this.getDestination());

        osc.start(now + time);
        osc.stop(now + time + 0.4);
      });
    });
  }

  // ============================================================================
  // HOST PARTY SOUNDBOARD (Procedural Web Audio)
  // ============================================================================

  /**
   * Comedic "Wrong Buzzer" (low discordant saw/square wave)
   */
  playWrongBuzzer() {
    if (!this.isEnabled()) return;
    this.init();
    if (!this.ctx) return;
    this.triggerHaptic([40, 60, 100]);

    const now = this.ctx.currentTime;
    [130, 138].forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.linearRampToValueAtTime(freq * 0.85, now + 0.35);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.getDestination());

      osc.start(now);
      osc.stop(now + 0.35);
    });
  }

  /**
   * Stadium Airhorn (tri-tone brass burst)
   */
  playAirhorn() {
    if (!this.isEnabled()) return;
    this.init();
    if (!this.ctx) return;
    this.triggerHaptic(60);

    const now = this.ctx.currentTime;
    // 3 rapid blasts
    [0, 0.12, 0.24].forEach((offset) => {
      [466.16, 622.25, 932.33].forEach((f) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now + offset);

        gain.gain.setValueAtTime(0.09, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.1);

        osc.connect(gain);
        gain.connect(this.getDestination());

        osc.start(now + offset);
        osc.stop(now + offset + 0.1);
      });
    });
  }

  /**
   * Comedic Rimshot ("Ba-dum-tss")
   */
  playRimshot() {
    if (!this.isEnabled()) return;
    this.init();
    if (!this.ctx) return;
    this.triggerHaptic([20, 30, 80]);

    const now = this.ctx.currentTime;
    // Ba
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(200, now);
    osc1.frequency.exponentialRampToValueAtTime(80, now + 0.08);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc1.connect(gain1);
    gain1.connect(this.getDestination());
    osc1.start(now);
    osc1.stop(now + 0.08);

    // Dum
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(160, now + 0.12);
    osc2.frequency.exponentialRampToValueAtTime(70, now + 0.2);
    gain2.gain.setValueAtTime(0.25, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc2.connect(gain2);
    gain2.connect(this.getDestination());
    osc2.start(now + 0.12);
    osc2.stop(now + 0.2);

    // Tss (Cymbal metallic burst)
    const bufferSize = this.ctx.sampleRate * 0.25;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(5000, now + 0.26);

    const gain3 = this.ctx.createGain();
    gain3.gain.setValueAtTime(0.18, now + 0.26);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

    noise.connect(filter);
    filter.connect(gain3);
    gain3.connect(this.getDestination());
    noise.start(now + 0.26);
    noise.stop(now + 0.48);
  }

  /**
   * Crowd Cheer / Applause
   */
  playCrowdCheer() {
    if (!this.isEnabled()) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = 0.8;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.Q.setValueAtTime(1.2, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.getDestination());

    noise.start(now);
    noise.stop(now + duration);
  }

  /**
   * Crickets / Awkward Silence
   */
  playCrickets() {
    if (!this.isEnabled()) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [0, 0.08, 0.16, 0.4, 0.48].forEach((t) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(4600, now + t);

      gain.gain.setValueAtTime(0.07, now + t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.04);

      osc.connect(gain);
      gain.connect(this.getDestination());

      osc.start(now + t);
      osc.stop(now + t + 0.04);
    });
  }

  /**
   * Cyberpunk Talisman & Jade Bead String Chime
   * Plays harmonic pentatonic crystal bell tones when brushing curtain strings
   */
  playTalismanChime(pitchIndex = 0) {
    if (!this.isEnabled()) return;
    this.init();
    this.triggerHaptic(8);
    if (!this.ctx) return;

    const pentatonicNotes = [392, 440, 523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66];
    const freq = pentatonicNotes[Math.abs(pitchIndex) % pentatonicNotes.length];
    const now = this.ctx.currentTime;

    // Fundamental crystal tone
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    // Overtone shimmer (glass / jade resonance)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.756, now);

    const masterGain = this.ctx.createGain();
    gain1.gain.setValueAtTime(0.09, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    gain2.gain.setValueAtTime(0.035, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    masterGain.gain.setValueAtTime(1.0, now);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(masterGain);
    gain2.connect(masterGain);
    masterGain.connect(this.getDestination());

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.4);
    osc2.stop(now + 0.25);
  }

  /**
   * Resonant Cyber Zen Temple Bell / Holographic Gong
   * Deep metallic strike with rich reverberant sub-harmonics
   */
  playZenGong() {
    if (!this.isEnabled()) return;
    this.init();
    this.triggerHaptic(40);
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = 2.4;

    // Fundamental low strike (D3 = 146.8 Hz)
    const oscRoot = this.ctx.createOscillator();
    const gainRoot = this.ctx.createGain();
    oscRoot.type = 'sine';
    oscRoot.frequency.setValueAtTime(146.83, now);
    oscRoot.frequency.exponentialRampToValueAtTime(144.0, now + duration);

    gainRoot.gain.setValueAtTime(0.25, now);
    gainRoot.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Metallic overtone (gong rim chime)
    const oscRim = this.ctx.createOscillator();
    const gainRim = this.ctx.createGain();
    oscRim.type = 'triangle';
    oscRim.frequency.setValueAtTime(438.5, now);
    oscRim.frequency.exponentialRampToValueAtTime(432.0, now + 1.2);

    gainRim.gain.setValueAtTime(0.12, now);
    gainRim.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    // Deep sub bass warmth
    const oscSub = this.ctx.createOscillator();
    const gainSub = this.ctx.createGain();
    oscSub.type = 'sine';
    oscSub.frequency.setValueAtTime(73.4, now);

    gainSub.gain.setValueAtTime(0.18, now);
    gainSub.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    oscRoot.connect(gainRoot);
    oscRim.connect(gainRim);
    oscSub.connect(gainSub);

    gainRoot.connect(this.getDestination());
    gainRim.connect(this.getDestination());
    gainSub.connect(this.getDestination());

    oscRoot.start(now);
    oscRim.start(now);
    oscSub.start(now);

    oscRoot.stop(now + duration);
    oscRim.stop(now + 1.25);
    oscSub.stop(now + 1.85);
  }

  /**
   * Cyber Dimension Gate Warp / Portal Transition
   * Futuristic rising energy pulse with dimensional whoosh
   */
  playGateWarp() {
    if (!this.isEnabled()) return;
    this.init();
    this.triggerHaptic(50);
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = 1.2;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.8);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.8);
    filter.Q.setValueAtTime(4.0, now);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.getDestination());

    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * Royal Court Fanfare / Sitar flourish for Raja Mantri Indian party game
   */
  playRoyalFanfare() {
    if (!this.isEnabled()) return;
    this.init();
    this.triggerHaptic(40);
    if (!this.ctx) return;

    const notes = [293.66, 369.99, 440.00, 554.37, 587.33, 739.99]; // D major / Bhairavi flourish
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.02, startTime + 0.3);

      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.getDestination());

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }

  /**
   * Mechanical Polaroid Camera Shutter Snap & Film Advance
   */
  playCameraSnap() {
    if (!this.isEnabled()) return;
    this.init();
    this.triggerHaptic(30);
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Shutter blade click
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(1200, now);
    osc1.frequency.exponentialRampToValueAtTime(80, now + 0.035);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc1.connect(gain1);
    gain1.connect(this.getDestination());
    osc1.start(now);
    osc1.stop(now + 0.035);

    // Motor whirr / film ejection
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(280, now + 0.04);
    osc2.frequency.linearRampToValueAtTime(420, now + 0.22);
    gain2.gain.setValueAtTime(0.08, now + 0.04);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc2.connect(gain2);
    gain2.connect(this.getDestination());
    osc2.start(now + 0.04);
    osc2.stop(now + 0.25);
  }

  /**
   * Digital Watch / Cyber LED Ticker Micro-Blip
   */
  playLedTick() {
    if (!this.isEnabled()) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2400, now);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

    osc.connect(gain);
    gain.connect(this.getDestination());

    osc.start(now);
    osc.stop(now + 0.015);
  }
}

export const audio = new AudioSynthesizer();
