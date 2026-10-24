import { stack } from '@/data/stack'

export default function Stack() {
    return (
        <section className="block" id="stack" style={{ borderTop: '1px solid var(--line)' }}>
            <div className="wrap">
                <p className="kicker">{'// tech stack'}</p>
                <h2 className="disp">Tools of<br />the trade.</h2>
                <p className="sub">The languages, frameworks and tooling behind our repos.</p>
                <div className="stack">
                    {stack.map(s => (
                        <div key={s.title} className="stk" style={{ '--c': s.c } as React.CSSProperties}>
                            <h3>{s.title}</h3>
                            <div className="chips">{s.chips.map(c => <span key={c}>{c}</span>)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
