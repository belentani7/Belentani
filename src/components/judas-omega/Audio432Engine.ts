export interface AudioTelemetry {
  overall: number;
  bass: number;
  mid: number;
  high: number;
  bins: Uint8Array<ArrayBuffer>;
}

export class Audio432Engine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private freqData: Uint8Array<ArrayBuffer> | null = null;
  private droneMaster: GainNode | null = null;
  private droneOscs: OscillatorNode[] = [];
  private beatTimer: number | null = null;
  private mediaEl: HTMLAudioElement | null = null;
  private mediaSrc: MediaElementAudioSourceNode | null = null;
  private currentObjectUrl: string | null = null;

  public droneActive = false;
  public beatActive = false;
  public currentFreq = 432;
  public customTrackName: string | null = null;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.82;
      this.freqData = new Uint8Array(new ArrayBuffer(this.analyser.frequencyBinCount));
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleDrone(): boolean {
    if (this.droneActive) {
      this.stopDrone();
      return false;
    }
    return this.startDroneWithFade(0.55);
  }

  public startDroneWithFade(fadeSec = 0.55): boolean {
    const ctx = this.ensureContext();
    if (!ctx || !this.analyser) return false;
    if (this.droneActive) return true;

    const freqs = [108, 216, 432, 540];
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.048, ctx.currentTime + Math.max(0.25, fadeSec));

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 620;
    filter.Q.value = 1.2;

    master.connect(filter);
    filter.connect(this.analyser);

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = f;
      gain.gain.value = idx === 2 ? 0.42 : 0.16;
      osc.connect(gain).connect(master);
      osc.start();
      this.droneOscs.push(osc);
    });

    this.droneMaster = master;
    this.droneActive = true;
    this.currentFreq = 432;
    return true;
  }

  public stopAll() {
    this.stopDrone();
    if (this.beatTimer !== null) {
      window.clearInterval(this.beatTimer);
      this.beatTimer = null;
    }
    this.beatActive = false;
  }

  private stopDrone() {
    this.droneOscs.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Ignore already-stopped oscillators
      }
    });
    this.droneOscs = [];
    if (this.droneMaster) {
      try {
        this.droneMaster.disconnect();
      } catch {
        // Ignore
      }
      this.droneMaster = null;
    }
    this.droneActive = false;
  }

  public triggerTone(freq: number, durationSec = 1.6, peakGain = 0.11) {
    const ctx = this.ensureContext();
    if (!ctx || !this.analyser) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(peakGain, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    osc.connect(gain).connect(this.analyser);
    osc.start(now);
    osc.stop(now + durationSec + 0.05);
    this.currentFreq = freq;
  }

  public toggleBeat76Bpm(): boolean {
    this.ensureContext();
    if (this.beatTimer !== null) {
      window.clearInterval(this.beatTimer);
      this.beatTimer = null;
      this.beatActive = false;
      return false;
    }

    // 76 BPM eighth-note grid (~394.7 ms) in F# minor
    const bassNotes = [92.5, 92.5, 110.0, 123.47, 82.41, 82.41, 110.0, 92.5];
    const stepMs = (60 / 76 / 2) * 1000;
    let step = 0;

    this.triggerTone(55, 0.34);
    this.beatTimer = window.setInterval(() => {
      const f = bassNotes[step % bassNotes.length];
      this.triggerTone(step % 4 === 0 ? 55 : f, 0.34);
      step += 1;
    }, stepMs);

    this.beatActive = true;
    return true;
  }

  public loadLocalAudioFile(file: File): string | null {
    const ctx = this.ensureContext();
    if (!ctx || !this.analyser) return null;

    if (this.currentObjectUrl) {
      URL.revokeObjectURL(this.currentObjectUrl);
      this.currentObjectUrl = null;
    }

    const url = URL.createObjectURL(file);
    this.currentObjectUrl = url;
    this.customTrackName = file.name;

    if (!this.mediaEl) {
      this.mediaEl = new Audio();
      this.mediaEl.crossOrigin = 'anonymous';
      this.mediaEl.loop = true;
      this.mediaSrc = ctx.createMediaElementSource(this.mediaEl);
      this.mediaSrc.connect(this.analyser);
    }

    this.mediaEl.src = url;
    void this.mediaEl.play();
    return file.name;
  }

  public readTelemetry(out: AudioTelemetry): AudioTelemetry {
    if (!this.analyser || !this.freqData) {
      out.overall = 0;
      out.bass = 0;
      out.mid = 0;
      out.high = 0;
      return out;
    }

    this.analyser.getByteFrequencyData(this.freqData);
    const n = this.freqData.length;
    let bassSum = 0;
    let midSum = 0;
    let highSum = 0;
    let total = 0;

    for (let i = 0; i < n; i++) {
      const v = this.freqData[i] / 255;
      total += v;
      if (i < 8) bassSum += v;
      else if (i < 24) midSum += v;
      else highSum += v;
    }

    out.overall = n > 0 ? total / n : 0;
    out.bass = bassSum / 8;
    out.mid = midSum / 16;
    out.high = Math.max(1, n - 24) > 0 ? highSum / Math.max(1, n - 24) : 0;
    out.bins = this.freqData;
    return out;
  }

  public dispose() {
    this.stopDrone();
    if (this.beatTimer !== null) {
      window.clearInterval(this.beatTimer);
      this.beatTimer = null;
    }
    this.beatActive = false;
    if (this.mediaEl) {
      this.mediaEl.pause();
      this.mediaEl.src = '';
    }
    if (this.currentObjectUrl) {
      URL.revokeObjectURL(this.currentObjectUrl);
      this.currentObjectUrl = null;
    }
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
    }
  }
}
