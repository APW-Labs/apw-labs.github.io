'use client'
import { Fragment, useEffect, useRef, useState } from 'react'
import { commands, hintCommands } from '@/data/commands'

type Line = { id: number; text: string; color?: string };

const intro: React.ReactNode[] = [
    <><span className="g">[ok]</span> boot sequence complete</>,
    <span className="d">APW Labs shell v2.6 — type <span className="l">help</span> or tap a command below.</span>,
];

export default function Terminal() {
    const [lines, setLines] = useState<Line[]>([]);
    const [introCount, setIntroCount] = useState(0);
    const [showIntro, setShowIntro] = useState(true);
    const outRef = useRef<HTMLDivElement>(null);
    const inpRef = useRef<HTMLInputElement>(null);
    const idRef = useRef(0);

    useEffect(() => {
        const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (RM) { setIntroCount(intro.length); return }
        let i = 0;
        let t: number;
        const type = () => {
            if (i < intro.length) {
                i++;
                setIntroCount(i);
                t = window.setTimeout(type, 600);
            }
        }
        type();
        return () => clearTimeout(t);
    }, [])

    useEffect(() => {
        const o = outRef.current
        if (o) o.scrollTop = o.scrollHeight
    }, [lines, introCount]);

    const say = (text: string, color?: string) =>
        setLines(l => [...l, { id: idRef.current++, text, color }]);

    const run = (raw: string) => {
        const v = raw.trim().toLowerCase();
        if (!v) return;
        say('$ ' + v, 'var(--hi)');
        if (v === 'clear') { setLines([]); setShowIntro(false); return }
        if (commands[v] !== undefined) {
            if (v === 'repo') setTimeout(() => window.open('https://github.com/APW-Labs', '_blank'), 400);
            say(commands[v], v === 'sudo' ? 'var(--or-t)' : undefined);
        } else {
            say('command not found: ' + v + ' — type help for the list.', 'var(--dim)');
        }
    }

    return (
        <div className="term" id="term" onClick={() => inpRef.current?.focus()}>
            <div className="bar">
                <i style={{ background: 'var(--or)' }}></i>
                <i style={{ background: 'var(--lime)' }}></i>
                <i style={{ background: 'var(--cy)' }}></i>
                <span style={{ marginLeft: 8, color: 'var(--dim)' }}>contributor@apw-labs: ~</span>
            </div>
            <div className="out" id="out" aria-live="polite" ref={outRef}>
                {showIntro &&
                    intro.slice(0, introCount).map((n, i) => (
                        <Fragment key={i}>
                            {i > 0 && <br />}
                            {n}
                        </Fragment>
                    ))}
                {lines.map(l => (
                    <div key={l.id} style={{ whiteSpace: 'pre-wrap', color: l.color }}>{l.text}</div>
                ))}
            </div>
            <label>
                <span style={{ color: 'var(--hi)' }}>$</span>
                <input
                    id="cmd"
                    ref={inpRef}
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    aria-label="Terminal command"
                    placeholder="type help"
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            run(e.currentTarget.value)
                            e.currentTarget.value = ''
                        }
                    }}
                />
            </label>
            <div className="hint" id="hints">
                {hintCommands.map(c => (
                    <b key={c} onClick={e => { e.stopPropagation(); run(c); inpRef.current?.focus() }}>{c}</b>
                ))}
            </div>
        </div>
    );
}