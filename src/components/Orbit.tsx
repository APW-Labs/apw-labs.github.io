'use client'
import { useEffect, useRef } from 'react'
import { orbitChips } from '@/data/misc'

const rings = [{ r: 0.16, s: 0.7, n: 3 }, { r: 0.29, s: -0.45, n: 4 }, { r: 0.43, s: 0.3, n: 5 }];

export default function Orbit() {
    const orbRef = useRef<HTMLDivElement>(null);
    const chipRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
        const orb = orbRef.current!;
        let raf = 0;

        const place = (t: number) => {
            let i = 0;
            const b = orb.offsetWidth || 360;
            rings.forEach(g => {
                for (let k = 0; k < g.n; k++) {
                    const a = (k / g.n) * Math.PI * 2 + (RM ? 0 : (t / 1000) * g.s);
                    const r = g.r * b;
                    const el = chipRefs.current[i++];
                    if (el) el.style.transform = `translate(calc(-50% + ${(Math.cos(a) * r).toFixed(1)}px), calc(-50% + ${(Math.sin(a) * r).toFixed(1)}px))`;
                }
            })
        }

        const onResize = () => place(0);
        place(0);

        if (!RM) {
            const tick = (t: number) => { place(t); raf = requestAnimationFrame(tick) }
            raf = requestAnimationFrame(tick);
        }
        addEventListener('resize', onResize);
        return () => { cancelAnimationFrame(raf); removeEventListener('resize', onResize) }
    }, []);

    return (
        <div id="orbit" ref={orbRef} aria-hidden="true">
            <div className="ring" style={{ width: '32%', height: '32%' }}></div>
            <div className="ring" style={{ width: '58%', height: '58%' }}></div>
            <div className="ring" style={{ width: '86%', height: '86%' }}></div>
            <div className="core">APW</div>
            {orbitChips.map((t, i) => (
                <div key={t} className="chip" ref={el => { chipRefs.current[i] = el }} style={{ borderColor: 'var(--cy-t)', color: 'var(--cy-t)' }}>{t}</div>
            ))}
        </div>
    );
}
