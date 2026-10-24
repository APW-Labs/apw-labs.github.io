import Orbit from './Orbit'
import { rules } from '@/data/misc'

export default function Principles() {
    return (
        <section className="block" id="principles" style={{ borderTop: '1px solid var(--line)' }}>
            <div className="wrap">
                <p className="kicker">{'// how we work'}</p>
                <h2 className="disp">The stack orbits<br />open code.</h2>
                <div className="orbit-wrap">
                    <Orbit />
                    <div className="rules">
                        {rules.map(([b, s]) => (
                            <div key={b} className="rule"><b>{b}</b><span>{s}</span></div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
