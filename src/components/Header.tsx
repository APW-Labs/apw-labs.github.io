'use client';
import { useEffect, useState } from "react"
import AppIcon from "./AppIcon";

export default function Header() {
    const [light, setLight] = useState(false);

    useEffect(() => {
        const r = document.documentElement;
        const mq = matchMedia('(prefers-color-scheme: light)');
        setLight(r.getAttribute('data-theme') === 'light');

        const onSystem = (e: MediaQueryListEvent) => {
            let saved: string | null = null;
            try { saved = localStorage.getItem('apw-theme') } catch { }
            if (!saved) apply(e.matches ? 'light' : 'dark', false);
        }
        mq.addEventListener('change', onSystem);
        return () => mq.removeEventListener('change', onSystem);
    }, []);

    function apply(t: 'light' | 'dark', save: boolean) {
        const r = document.documentElement;
        r.setAttribute('data-theme', t);
        setLight(t === 'light');
        const m = document.querySelector<HTMLMetaElement>('meta[name=theme-color]');
        if (m) m.content = t === 'light' ? '#f4f4f0' : '#0a0a0f';
        if (save) { try { localStorage.setItem('apw-theme', t) } catch { } }
        window.dispatchEvent(new Event('apw-theme'));
    }

    const toggle = () => apply(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light', true);

    return (
        <header>
            <div className="wrap">
                <a className="logo" href="#top" aria-label="APW Labs">
                    <AppIcon />
                    APW&nbsp;Labs
                </a>
                <nav className="nav" aria-label="Sections">
                    <a href="#domains">Build</a>
                    <a href="#stack">Stack</a>
                    <a href="#principles">Culture</a>
                    <a href="#contribute">Contribute</a>
                    <a href="#members">Crew</a>
                </nav>
                <span className="status"><i></i>open for contributors</span>
                <button id="theme" type="button" aria-pressed={light} aria-label="Light theme" title="Toggle light / dark theme" onClick={toggle}>
                    <svg className="sun" viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                    </svg>
                    <svg className="moon" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />
                    </svg>
                </button>
            </div>
        </header>
    );
}