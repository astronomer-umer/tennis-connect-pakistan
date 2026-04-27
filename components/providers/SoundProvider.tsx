"use client";

import { useEffect, useRef, useCallback, useState, createContext, useContext } from "react";

type SoundType = "swipe" | "match" | "tap" | "success" | "error" | "pop";

interface SoundContextValue {
  playSound: (type: SoundType) => void;
  isMuted: boolean;
  toggleMute: () => void;
  isMusicPlaying: boolean;
  toggleMusic: () => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

export function useSoundContext() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSoundContext must be used within SoundProvider");
  return ctx;
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const musicOscillators = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  const playSound = useCallback((type: SoundType) => {
    if (isMuted) return;
    
    const ctx = initAudioContext();
    const now = ctx.currentTime;

    switch (type) {
      case "swipe": {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      }
      case "match": {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(freq, now + i * 0.1);
          osc.type = "sine";
          gain.gain.setValueAtTime(0, now + i * 0.1);
          gain.gain.linearRampToValueAtTime(0.4, now + i * 0.1 + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.4);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 0.4);
        });
        break;
      }
      case "tap": {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }
      case "success": {
        const notes = [523.25, 659.25];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0.3, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.2);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.2);
        });
        break;
      }
      case "error": {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(200, now);
        osc.type = "sawtooth";
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }
      case "pop": {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }
    }
  }, [isMuted, initAudioContext]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const playMusicLoop = useCallback(() => {
    const ctx = initAudioContext();
    const now = ctx.currentTime;
    
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.12, now);
    gainNode.connect(ctx.destination);
    gainNodeRef.current = gainNode;

    const bassNotes = [65.41, 82.41, 98.00, 110.00];
    const melodyNotes = [
      { note: 261.63, time: 0 },
      { note: 293.66, time: 0.25 },
      { note: 329.63, time: 0.5 },
      { note: 349.23, time: 0.75 },
      { note: 392.00, time: 1.0 },
      { note: 349.23, time: 1.5 },
      { note: 329.63, time: 1.75 },
      { note: 293.66, time: 2.0 },
      { note: 261.63, time: 2.5 },
    ];

    const loop = () => {
      const loopNow = ctx.currentTime;
      
      [0, 0.5, 1, 1.5].forEach((beat) => {
        const bassIdx = Math.floor(Math.random() * bassNotes.length);
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(bassNotes[bassIdx], loopNow + beat);
        
        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0, loopNow + beat);
        noteGain.gain.linearRampToValueAtTime(0.5, loopNow + beat + 0.03);
        noteGain.gain.exponentialRampToValueAtTime(0.01, loopNow + beat + 0.4);
        
        osc.connect(noteGain);
        noteGain.connect(gainNode);
        osc.start(loopNow + beat);
        osc.stop(loopNow + beat + 0.4);
        musicOscillators.current.push(osc);
      });

      melodyNotes.forEach(({ note, time }) => {
        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(note, loopNow + time);
        
        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0, loopNow + time);
        noteGain.gain.linearRampToValueAtTime(0.25, loopNow + time + 0.03);
        noteGain.gain.exponentialRampToValueAtTime(0.01, loopNow + time + 0.4);
        
        osc.connect(noteGain);
        noteGain.connect(gainNode);
        osc.start(loopNow + time);
        osc.stop(loopNow + time + 0.4);
        musicOscillators.current.push(osc);
      });

      [261.63, 329.63, 392.00].forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, loopNow);
        
        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0, loopNow);
        noteGain.gain.linearRampToValueAtTime(0.1, loopNow + 0.2);
        noteGain.gain.setValueAtTime(0.1, loopNow + 2.5);
        noteGain.gain.exponentialRampToValueAtTime(0.01, loopNow + 3);
        
        osc.connect(noteGain);
        noteGain.connect(gainNode);
        osc.start(loopNow);
        osc.stop(loopNow + 3);
        musicOscillators.current.push(osc);
      });
    };

    loop();
    intervalRef.current = setInterval(loop, 3000);
  }, [initAudioContext]);

  const toggleMusic = useCallback(() => {
    if (!isMusicPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      playMusicLoop();
      setIsMusicPlaying(true);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      musicOscillators.current.forEach((osc) => {
        try { osc.stop(); } catch {}
      });
      musicOscillators.current = [];
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }
      setIsMusicPlaying(false);
    }
  }, [isMusicPlaying, playMusicLoop]);

  useEffect(() => {
    const handleInteraction = () => {
      initAudioContext();
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };
    document.addEventListener("click", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);
    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [initAudioContext]);

  return (
    <SoundContext.Provider value={{ playSound, isMuted, toggleMute, isMusicPlaying, toggleMusic }}>
      {children}
    </SoundContext.Provider>
  );
}