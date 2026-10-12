// src/lib/voice.ts

export type VoiceLang = 'en' | 'sw';

export interface VoiceOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: VoiceLang;
}

class VoiceEngine {
  private enabled = false;
  private currentLang: VoiceLang = 'en';
  private lastSpokenKey: string | null = null;
  private audioCtx: AudioContext | null = null;

  isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  setEnabled(v: boolean) {
    this.enabled = v;
    if (!v && this.isSupported()) {
      window.speechSynthesis.cancel();
    }
    if (v) this.unlock();
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  setLang(lang: VoiceLang) {
    this.currentLang = lang;
  }

  getLang(): VoiceLang {
    return this.currentLang;
  }

  /** Warm up speech synthesis on user gesture (mobile browsers need this) */
  unlock() {
    if (!this.isSupported()) return;
    const u = new SpeechSynthesisUtterance('');
    u.volume = 0;
    window.speechSynthesis.speak(u);
  }

  /**
   * Pick the best voice for the requested language from the available voices.
   * Fallback chain: exact locale → primary language → default voice.
   */
  private pickVoice(lang: VoiceLang): SpeechSynthesisVoice | null {
    if (!this.isSupported()) return null;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;

    if (lang === 'sw') {
      // Prefer Swahili voices; fall back to any African-adjacent or English voice
      const sw =
        voices.find((v) => v.lang.toLowerCase().startsWith('sw')) ||
        voices.find((v) => /swahili|kiswahili/i.test(v.name));
      if (sw) return sw;
      // Fallback to English voice (still understandable)
      return (
        voices.find((v) => v.lang.toLowerCase().startsWith('en-US')) ||
        voices.find((v) => v.lang.toLowerCase().startsWith('en-GB')) ||
        voices[0]
      );
    }

    // English
    return (
      voices.find((v) => v.lang.toLowerCase().startsWith('en-US')) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('en-GB')) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('en')) ||
      voices[0]
    );
  }

  speak(text: string, options: VoiceOptions = {}) {
    if (!this.enabled || !this.isSupported()) return;
    window.speechSynthesis.cancel();

    const lang = options.lang ?? this.currentLang;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = options.rate ?? 0.95;
    u.pitch = options.pitch ?? 1;
    u.volume = options.volume ?? 1;

    const voice = this.pickVoice(lang);
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang;
    } else {
      u.lang = lang === 'sw' ? 'sw-KE' : 'en-US';
    }

    window.speechSynthesis.speak(u);
  }

  /** Speak a step only once per key (avoid repeating) */
  speakOnce(key: string, text: string, options?: VoiceOptions) {
    if (this.lastSpokenKey === key) return;
    this.lastSpokenKey = key;
    this.speak(text, options);
  }

  resetSpokenKey() {
    this.lastSpokenKey = null;
  }

  stop() {
    if (this.isSupported()) window.speechSynthesis.cancel();
  }

  // ============ SOUND EFFECTS ============

  private ensureAudio(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      if (!Ctx) return null;
      this.audioCtx = new Ctx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /** Pleasant arrival chime — 3 ascending tones */
  playArrivalSound() {
    const ctx = this.ensureAudio();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const start = ctx.currentTime + i * 0.18;
      const dur = 0.45;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.25, start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + dur);
    });
  }

  /** Soft turn notification — single short beep */
  playTurnSound() {
    const ctx = this.ensureAudio();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }
}

export const voice = new VoiceEngine();