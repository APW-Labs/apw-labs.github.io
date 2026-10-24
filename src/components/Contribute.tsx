import { steps } from '@/data/misc'

export default function Contribute() {
    return (
        <section className="block" id="contribute" style={{ borderTop: '1px solid var(--line)' }}>
            <div className="wrap">
                <p className="kicker">{'// contributing'}</p>
                <h2 className="disp">From idea<br />to merged.</h2>
                <p className="sub">Four steps, one review loop. Reviews are about the code, never the person.</p>
                <div className="steps">
                    {steps.map(([h, p]) => (
                        <div key={h} className="step"><h3>{h}</h3><p>{p}</p></div>
                    ))}
                </div>
                <p className="callout"><b>Not sure where to start?</b> Open an issue and ask. A half-formed idea is fine.</p>
            </div>
        </section>
    )
}
