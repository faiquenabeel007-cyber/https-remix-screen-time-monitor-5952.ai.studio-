// Web Audio API Synthesizer for Screen Time Limits & Alarms

class AlarmAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private activeOscillators: OscillatorNode[] = [];
  private activeGains: GainNode[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Play an alarm tone based on user settings
   */
  public playAlarm(soundType: 'gentle_chime' | 'pulse_alarm' | 'digital_beep' = 'pulse_alarm', volume = 0.8) {
    this.stopAlarm(); // Stop any existing sound
    this.initContext();
    if (!this.ctx) return;

    this.isPlaying = true;

    if (soundType === 'gentle_chime') {
      this.playGentleChimePattern(volume);
    } else if (soundType === 'digital_beep') {
      this.playDigitalBeepPattern(volume);
    } else {
      this.playPulseAlarmPattern(volume);
    }
  }

  private playPulseAlarmPattern(volume: number) {
    if (!this.ctx || !this.isPlaying) return;

    const playBeep = () => {
      if (!this.ctx || !this.isPlaying) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.15); // D6

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(volume * 0.35, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);

      this.activeOscillators.push(osc);
      this.activeGains.push(gain);

      // Repeat pulse every 0.6 seconds if still playing
      if (this.isPlaying) {
        setTimeout(playBeep, 600);
      }
    };

    playBeep();
  }

  private playDigitalBeepPattern(volume: number) {
    if (!this.ctx || !this.isPlaying) return;

    let count = 0;
    const playDoubleBeep = () => {
      if (!this.ctx || !this.isPlaying) return;

      const now = this.ctx.currentTime;
      
      // Beep 1
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(1046.50, now); // C6
      gain1.gain.setValueAtTime(volume * 0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.1);

      // Beep 2
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(1046.50, now + 0.12); // C6
      gain2.gain.setValueAtTime(volume * 0.2, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.22);

      count++;
      if (this.isPlaying) {
        setTimeout(playDoubleBeep, 1000);
      }
    };

    playDoubleBeep();
  }

  private playGentleChimePattern(volume: number) {
    if (!this.ctx || !this.isPlaying) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const playChimeSequence = () => {
      if (!this.ctx || !this.isPlaying) return;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime + idx * 0.18;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(volume * 0.25, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.85);
      });

      if (this.isPlaying) {
        setTimeout(playChimeSequence, 2400);
      }
    };

    playChimeSequence();
  }

  public stopAlarm() {
    this.isPlaying = false;
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore
      }
    });
    this.activeOscillators = [];
    this.activeGains.forEach((g) => {
      try {
        g.disconnect();
      } catch {
        // ignore
      }
    });
    this.activeGains = [];
  }
}

export const alarmAudio = new AlarmAudioEngine();
