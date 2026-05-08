/*
PlayArena.fun — Background FX
- Keep CPU cost low: CSS gradients + few animated dots
- Use as atmosphere, not distraction
*/

import { useEffect, useMemo, useRef } from "react";

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

type Dot = { x: number; y: number; r: number; vx: number; vy: number; hue: number; a: number };

export default function BackgroundFX() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const dots = useMemo<Dot[]>(() => {
    const arr: Dot[] = [];
    for (let i = 0; i < 46; i++) {
      arr.push({
        x: rand(0, 1),
        y: rand(0, 1),
        r: rand(0.6, 2.2),
        vx: rand(-0.015, 0.015),
        vy: rand(-0.01, 0.01),
        hue: Math.random() < 0.55 ? 150 : 195,
        a: rand(0.10, 0.32),
      });
    }
    return arr;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      // dots
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < -0.1) d.x = 1.1;
        if (d.x > 1.1) d.x = -0.1;
        if (d.y < -0.1) d.y = 1.1;
        if (d.y > 1.1) d.y = -0.1;

        const x = d.x * w;
        const y = d.y * h;

        const g = ctx.createRadialGradient(x, y, 0, x, y, d.r * 22);
        g.addColorStop(0, `hsla(${d.hue}, 95%, 60%, ${d.a})`);
        g.addColorStop(1, `hsla(${d.hue}, 95%, 60%, 0)`);

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, d.r * 22, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(raf);
    };
  }, [dots]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_15%_10%,rgba(34,197,94,0.18),transparent_55%),radial-gradient(900px_520px_at_82%_20%,rgba(56,189,248,0.18),transparent_55%),radial-gradient(900px_600px_at_55%_85%,rgba(167,139,250,0.10),transparent_62%)]" />
      <div className="absolute inset-0 pa-grid opacity-60" />
      <canvas ref={canvasRef} className="absolute inset-0 opacity-75" />
    </div>
  );
}
