// Web Audio API Low-Lofi Ambient Soundscape Engine
// Generates a warm, dreamy lofi Rhodes + Raag Yaman/Lydian-inspired groove with soft tape warmth
// and zero external audio file dependencies.

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private masterFilter: BiquadFilterNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayFeedback: GainNode | null = null;
  private delayFilter: BiquadFilterNode | null = null;
  private vinylSource: AudioBufferSourceNode | null = null;
  private vinylGain: GainNode | null = null;
  private schedulerId: number | null = null;
  private stopTimeoutId: number | null = null;
  private stepIndex: number = 0;

  // Initialize audio context lazily on user interaction
  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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

      if (this.stopTimeoutId !== null) {
        window.clearTimeout(this.stopTimeoutId);
        this.stopTimeoutId = null;
      }

      // Clean up any prior session immediately before starting
      this.cleanupNodes();

      const now = this.ctx.currentTime;

      // Master gain with gentle fade-in (low, comfortable background volume)
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.18, now + 2.0);

      // Warm lofi lowpass filter
      this.masterFilter = this.ctx.createBiquadFilter();
      this.masterFilter.type = 'lowpass';
      this.masterFilter.frequency.setValueAtTime(1050, now);
      this.masterFilter.Q.setValueAtTime(0.65, now);

      // Dreamy tape-style echo bus
      this.delayNode = this.ctx.createDelay(1.0);
      this.delayNode.delayTime.setValueAtTime(0.39, now);

      this.delayFeedback = this.ctx.createGain();
      this.delayFeedback.gain.setValueAtTime(0.28, now);

      this.delayFilter = this.ctx.createBiquadFilter();
      this.delayFilter.type = 'lowpass';
      this.delayFilter.frequency.setValueAtTime(720, now);

      this.delayNode.connect(this.delayFilter);
      this.delayFilter.connect(this.delayFeedback);
      this.delayFeedback.connect(this.delayNode);
      this.delayFilter.connect(this.masterFilter);

      this.masterFilter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      // Subtle warm vinyl/room texture
      this.startVinylTexture(now);

      // 4-bar soulful lofi progression (Fmaj7 -> Dm9 -> Bbmaj7#11 -> C6/9)
      const chords: number[][] = [
        [174.61, 220.0, 261.63, 329.63], // Fmaj7
        [146.83, 220.0, 261.63, 329.63], // Dm9
        [116.54, 174.61, 220.0, 293.66, 329.63], // Bbmaj7#11 (Yaman/Lydian colour)
        [130.81, 196.0, 220.0, 293.66], // C6/9
      ];

      // F Lydian / Raag Yaman pentatonic melody pool
      const melodyNotes = [349.23, 392.0, 440.0, 493.88, 523.25, 659.25];

      // 16th-note step interval at ~68 BPM (8th-note grid = ~440ms per step)
      const stepMs = 440;
      this.stepIndex = 0;

      const tick = () => {
        if (!this.ctx || !this.isPlaying) return;
        const t = this.ctx.currentTime;
        const barStep = this.stepIndex % 8; // 8 eighth-notes per bar
        const chordIdx = Math.floor(this.stepIndex / 8) % chords.length;

        // Play warm Rhodes chord on beat 1 of every bar
        if (barStep === 0) {
          this.playRhodesChord(chords[chordIdx], t);
        }

        // Soft lofi kick on beat 1 and syncopated "and of 2"
        if (barStep === 0 || barStep === 3) {
          this.playSoftKick(t, barStep === 0 ? 0.11 : 0.065);
        }

        // Soft brushed snare/rim on beats 2 and 4
        if (barStep === 2 || barStep === 6) {
          this.playSoftBrush(t);
        }

        // Delicate sparse melody plucks (humanized probability)
        if ((barStep === 1 || barStep === 4 || barStep === 5 || barStep === 7) && Math.random() < 0.45) {
          const note = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];
          const humanOffset = Math.random() * 0.025;
          this.playMelodyPluck(note, t + humanOffset);
        }

        this.stepIndex++;
      };

      this.isPlaying = true;
      // Trigger first bar immediately
      tick();
      this.schedulerId = window.setInterval(tick, stepMs);
    } catch (e) {
      console.warn('Audio autoplay or initialization prevented', e);
    }
  }

  private startVinylTexture(now: number) {
    if (!this.ctx || !this.masterGain) return;
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0;
    for (let i = 0; i < length; i++) {
      // Soft brownian room warmth + occasional tiny vinyl dust pop
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.02 * white) / 1.02;
      let sample = lastOut * 0.25;
      if (Math.random() < 0.00035) {
        sample += (Math.random() * 2 - 1) * 0.25;
      }
      data[i] = sample;
    }

    this.vinylSource = this.ctx.createBufferSource();
    this.vinylSource.buffer = buffer;
    this.vinylSource.loop = true;

    const vinylFilter = this.ctx.createBiquadFilter();
    vinylFilter.type = 'bandpass';
    vinylFilter.frequency.setValueAtTime(1600, now);
    vinylFilter.Q.setValueAtTime(0.7, now);

    this.vinylGain = this.ctx.createGain();
    this.vinylGain.gain.setValueAtTime(0.018, now);

    this.vinylSource.connect(vinylFilter);
    vinylFilter.connect(this.vinylGain);
    this.vinylGain.connect(this.masterGain);
    this.vinylSource.start(now);
  }

  private playRhodesChord(frequencies: number[], startTime: number) {
    if (!this.ctx || !this.masterFilter || !this.delayNode) return;

    frequencies.forEach((freq, idx) => {
      const t = startTime + idx * 0.028; // gentle strummed feel
      const oscMain = this.ctx!.createOscillator();
      const oscWarm = this.ctx!.createOscillator();
      const noteGain = this.ctx!.createGain();

      oscMain.type = 'sine';
      oscWarm.type = 'triangle';
      // Subtle lofi tape detune
      const detune = (Math.random() - 0.5) * 4;
      oscMain.frequency.setValueAtTime(freq, t);
      oscMain.detune.setValueAtTime(detune, t);

      oscWarm.frequency.setValueAtTime(freq * 2, t);
      oscWarm.detune.setValueAtTime(-detune, t);

      const warmMix = this.ctx!.createGain();
      warmMix.gain.setValueAtTime(0.14, t);

      noteGain.gain.setValueAtTime(0.0001, t);
      noteGain.gain.linearRampToValueAtTime(0.075, t + 0.09);
      noteGain.gain.exponentialRampToValueAtTime(0.025, t + 1.4);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, t + 3.6);

      oscMain.connect(noteGain);
      oscWarm.connect(warmMix);
      warmMix.connect(noteGain);

      noteGain.connect(this.masterFilter!);
      noteGain.connect(this.delayNode!);

      oscMain.start(t);
      oscWarm.start(t);
      oscMain.stop(t + 3.7);
      oscWarm.stop(t + 3.7);
    });
  }

  private playMelodyPluck(freq: number, startTime: number) {
    if (!this.ctx || !this.masterFilter || !this.delayNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    osc.detune.setValueAtTime((Math.random() - 0.5) * 6, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(0.045, startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.4);

    osc.connect(gain);
    gain.connect(this.masterFilter);
    gain.connect(this.delayNode);

    osc.start(startTime);
    osc.stop(startTime + 1.5);
  }

  private playSoftKick(startTime: number, level: number) {
    if (!this.ctx || !this.masterFilter) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(92, startTime);
    osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.14);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(level, startTime + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.24);

    osc.connect(gain);
    gain.connect(this.masterFilter);

    osc.start(startTime);
    osc.stop(startTime + 0.26);
  }

  private playSoftBrush(startTime: number) {
    if (!this.ctx || !this.masterFilter) return;

    const bufferSize = Math.floor(this.ctx.sampleRate * 0.07);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1900, startTime);
    filter.Q.setValueAtTime(1.2, startTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.025, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.07);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterFilter);

    noise.start(startTime);
  }

  private cleanupNodes() {
    if (this.schedulerId !== null) {
      window.clearInterval(this.schedulerId);
      this.schedulerId = null;
    }
    if (this.vinylSource) {
      try {
        this.vinylSource.stop();
        this.vinylSource.disconnect();
      } catch {
        // ignore
      }
      this.vinylSource = null;
    }
    if (this.delayNode) {
      try {
        this.delayNode.disconnect();
      } catch {
        // ignore
      }
      this.delayNode = null;
    }
    if (this.masterFilter) {
      try {
        this.masterFilter.disconnect();
      } catch {
        // ignore
      }
      this.masterFilter = null;
    }
    if (this.masterGain) {
      try {
        this.masterGain.disconnect();
      } catch {
        // ignore
      }
      this.masterGain = null;
    }
  }

  public stop() {
    if (!this.ctx || !this.isPlaying) return;
    this.isPlaying = false;
    if (this.schedulerId !== null) {
      window.clearInterval(this.schedulerId);
      this.schedulerId = null;
    }
    try {
      const now = this.ctx.currentTime;
      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.0001), now);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
      }
      this.stopTimeoutId = window.setTimeout(() => {
        this.cleanupNodes();
        this.stopTimeoutId = null;
      }, 950);
    } catch {
      this.cleanupNodes();
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
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);

      const chimeGain = this.ctx.createGain();
      chimeGain.gain.setValueAtTime(0.001, now);
      chimeGain.gain.linearRampToValueAtTime(0.055, now + 0.06);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

      frequencies.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.025);
        osc.connect(chimeGain);
        osc.start(now + idx * 0.025);
        osc.stop(now + 2.5);
      });

      chimeGain.connect(filter);
      filter.connect(this.ctx.destination);
    } catch {
      // safe fallback
    }
  }
}

export const audioEngine = new AmbientAudioEngine();
