'use client'
import { useEffect, useRef } from 'react'

export default function RainCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cv = ref.current!;
    const ctx = cv.getContext('2d')!;
    const chars = 'アイウエオカキクケコ01<>/{}$#'.split('');

    let cols = 0, drops: number[] = [], t = 0, raf = 0;
    let RC = { f: '', c: '', h: '' };

    const rc = () => {
      const c = getComputedStyle(document.documentElement)
      RC = {
        f: c.getPropertyValue('--rain-fade').trim(),
        c: c.getPropertyValue('--rain-ch').trim(),
        h: c.getPropertyValue('--rain-hi').trim(),
      }
    }

    const onTheme = () => { rc(); ctx.clearRect(0, 0, cv.width, cv.height) }
    const size = () => {
      cv.width = cv.offsetWidth;
      cv.height = cv.offsetHeight;
      cols = Math.floor(cv.width / 18);
      drops = [];
      for (let i = 0; i < cols; i++) drops[i] = Math.random() * -50;
    }
    
    const frame = () => {
      t++;
      if (t % 3 === 0) {
        ctx.fillStyle = RC.f;
        ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.font = '13px JetBrains Mono, monospace';
        for (let i = 0; i < cols; i++) {
          ctx.fillStyle = Math.random() < 0.03 ? RC.h : RC.c;
          ctx.fillText(chars[(Math.random() * chars.length) | 0], i * 18, drops[i] * 18);
          if (drops[i] * 18 > cv.height && Math.random() > 0.975) drops[i] = 0;
          drops[i]++;
        }
      }
      raf = requestAnimationFrame(frame);
    }

    rc();
    size();
    addEventListener('apw-theme', onTheme);
    addEventListener('resize', size);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('apw-theme', onTheme);
      removeEventListener('resize', size);
    }
  }, []);

  return <canvas id="rain" ref={ref} aria-hidden="true" />;
}
