'use client';

import { useEffect, useRef } from 'react';

/**
 * Lightweight canvas particles simulating floating rice/wheat grains.
 */
export default function HeroParticles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nav = navigator as Navigator & { hardwareConcurrency?: number };
    const lowEnd =
      nav.hardwareConcurrency !== undefined && (nav.hardwareConcurrency ?? 4) <= 2;
    if (reduced || lowEnd) return;

    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const ro = new ResizeObserver(() => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      resize();
    });
    ro.observe(canvas);

    const count = Math.min(
      60,
      Math.floor((canvas.width * canvas.height) / (25000 * dpr * dpr)),
    );
    const grains = Array.from({ length: count }, () => spawn(canvas, dpr));

    const tick = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      for (const g of grains) {
        g.x += g.vx;
        g.y += g.vy;
        g.a += g.va;

        if (g.y > h + 6) {
          g.y = -6;
          g.x = Math.random() * w;
        }
        if (g.x < -6) g.x = w + 6;
        if (g.x > w + 6) g.x = -6;

        ctx.save();
        ctx.translate(g.x, g.y);
        ctx.rotate(g.a);
        ctx.fillStyle = `hsla(${g.hue}, 65%, 55%, ${g.alpha})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, g.r * 2, g.r * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

function spawn(canvas: HTMLCanvasElement, dpr: number) {
  return {
    x: Math.random() * (canvas.width / dpr),
    y: Math.random() * (canvas.height / dpr),
    vx: (Math.random() - 0.5) * 0.15,
    vy: 0.15 + Math.random() * 0.35,
    r: 1.5 + Math.random() * 2.5,
    a: Math.random() * Math.PI * 2,
    va: (Math.random() - 0.5) * 0.02,
    alpha: 0.25 + Math.random() * 0.35,
    hue: 40 + Math.random() * 30,
  };
}
