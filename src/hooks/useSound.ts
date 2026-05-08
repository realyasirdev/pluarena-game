import { useCallback } from "react";

export function useSound() {
  const beep = useCallback((kind: "tap" | "success" | "fail" = "tap") => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);

      const now = ctx.currentTime;
      const freq = kind === "tap" ? 420 : kind === "success" ? 640 : 180;
      o.frequency.setValueAtTime(freq, now);
      o.type = kind === "fail" ? "sawtooth" : "triangle";

      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.16, now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

      o.start(now);
      o.stop(now + 0.16);
      o.onended = () => ctx.close();
    } catch {
      // ignore (autoplay restrictions)
    }
  }, []);

  return { beep };
}
