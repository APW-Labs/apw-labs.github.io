'use client'
import { Fragment, useCallback, useEffect, useRef, useState } from "react";

const d = (t: string) => <span className="d">{t}</span>;
const lines: React.ReactNode[] = [
    <>{d('[')}BIOS{d(']')} APW Labs firmware v2.6</>,
    <>{d('[')}BOOT{d(']')} mounting /dev/community... <span className="w">OK</span></>,
    <>{d('[')}BOOT{d(']')} loading modules: android, cloud, desktop, edge-ai... <span className="w">OK</span></>,
    <>{d('[')}BOOT{d(']')} checking restrictions... <span className="o">NONE FOUND</span></>,
    <>{d('[')}BOOT{d(']')} checking deadlines... <span className="o">NONE FOUND</span></>,
    <>{d('[')}BOOT{d(']')} starting apw-labs.service... <span className="w">OK</span></>,
    '',
    <span className="w">&gt; welcome, contributor_</span>,
];

export default function BootSplash() {
    const [count, setCount] = useState(0);
    const [done, setDone] = useState(false);
    const [gone, setGone] = useState(false);
    const doneRef = useRef(false);

    const finish = useCallback(() => {
        if (doneRef.current) return;

        doneRef.current = true;
        setDone(true);
        setTimeout(() => setGone(true), 600);
    }, []);

    useEffect(() => {
        const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
        let i = 0;
        let t: number;

        const step = () => {
            if (doneRef.current) return
            if (i < lines.length) {
                i++
                setCount(i)
                t = window.setTimeout(step, RM ? 0 : 230)
            } else t = window.setTimeout(finish, RM ? 100 : 700)
        };

        step();
        return () => clearTimeout(t);
    }, [finish]);

    if (gone) return null;

    return (
        <div id="boot" className={done ? 'done' : ''} role="status" aria-label="Loading APW Labs" onClick={finish}>
            <pre id="bootlog">
                {lines.slice(0, count).map((l, i) => (
                    <Fragment key={i}>
                        {l}
                        {'\n'}
                    </Fragment>
                ))}
            </pre>
            <span className="skip">[ click anywhere to skip ]</span>
        </div>
    );
}