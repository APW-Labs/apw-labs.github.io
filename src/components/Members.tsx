import { crew } from '@/data/members'

export default function Members() {
    return (
        <section className="block" id="members" style={{ borderTop: '1px solid var(--line)' }}>
            <div className="wrap">
                <p className="kicker">{'// the crew'}</p>
                <h2 className="disp">Meet the lab.</h2>
                <p className="sub">The people shipping code under the APW flag. Every voice counts the same.</p>
                <div className="member-grid" id="crew">
                    {crew.map(m => (
                        <a key={m.login} className="m" href={`https://github.com/${m.login}`} target="_blank" rel="noopener">
                            <span className="av">{m.name.charAt(0)}</span>
                            <span><b>{m.name}</b><small>{m.role} · @{m.login}</small></span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}
