// Web Audio API ambient Tanpura synthesizer & harmonic soundscape engine
// Generates warm acoustic drone frequencies without relying on external media files.

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private filter: BiquadFilterNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;

  // Initialize audio context lazily on user interaction
  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public start() {
    try {
      this.initContext();
      if (!this.ctx) return;

      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.stop(); // Clear any existing

      const now = this.ctx.currentTime;
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, now);
      // Gentle fade in
      this.masterGain.gain.exponentialRampToValueAtTime(0.12, now + 2.5);

      // Lowpass warmth filter
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(450, now);
      this.filter.Q.setValueAtTime(2.5, now);

      // Subtle breath modulation LFO
      this.lfo = this.ctx.createOscillator();
      this.lfoGain = this.ctx.createGain();
      this.lfo.frequency.setValueAtTime(0.15, now); // slow breathing cycle ~6.5 seconds
      this.lfoGain.gain.setValueAtTime(40, now);
      this.lfo.connect(this.lfoGain);
      this.lfoGain.connect(this.filter.frequency);
      this.lfo.start();

      // Tanpura frequencies: C# tuning (Sa: 138.59 Hz, Pa: 207.65 Hz, higher Sa: 277.18 Hz)
      const droneNotes = [
        { freq: 138.59, type: 'sawtooth' as OscillatorType, gainVal: 0.08 },
        { freq: 207.65, type: 'triangle' as OscillatorType, gainVal: 0.09 },
        { freq: 277.18, type: 'sine' as OscillatorType, gainVal: 0.06 },
        { freq: 69.3, type: 'triangle' as OscillatorType, gainVal: 0.12 }, // Sub bass foundation
      ];

      this.oscillators = droneNotes.map((note) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        osc.type = note.type;
        // Subtle detuning for natural acoustic organic beating
        osc.frequency.setValueAtTime(note.freq + (Math.random() * 0.4 - 0.2), now);
        noteGain.gain.setValueAtTime(note.gainVal, now);

        osc.connect(noteGain);
        noteGain.connect(this.filter!);
        osc.start();
        return osc;
      });

      this.filter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
      this.isPlaying = true;
    } catch (e) {
      console.warn('Audio autoplay or initialization prevented', e);
    }
  }

  public stop() {
    if (!this.ctx || !this.isPlaying) return;
    try {
      const now = this.ctx.currentTime;
      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      }
      setTimeout(() => {
        this.oscillators.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {
            // ignore
          }
        });
        this.oscillators = [];
        if (this.lfo) {
          try {
            this.lfo.stop();
            this.lfo.disconnect();
          } catch {
            // ignore
          }
        }
        this.isPlaying = false;
      }, 1200);
    } catch {
      this.isPlaying = false;
    }
  }

  // Play a short resonant musical chime/chord for interactive moments (e.g. Rasa selection)
  public playRasaHarmonic(frequencies: number[]) {
    try {
      this.initContext();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      const chimeGain = this.ctx.createGain();
      chimeGain.gain.setValueAtTime(0.001, now);
      chimeGain.gain.linearRampToValueAtTime(0.06, now + 0.05);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      frequencies.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.connect(chimeGain);
        osc.start(now);
        osc.stop(now + 2.3);
      });

      chimeGain.connect(this.ctx.destination);
    } catch {
      // safe fallback
    }
  }
}

export const audioEngine = new AmbientAudioEngine();
