import { domains } from '@/data/domains'

export default function Domains() {
    return (
        <section className="block" id="domains">
            <div className="wrap">
                <p className="kicker">{'// focus areas'}</p>
                <h2 className="disp">Four domains.<br />One standard.</h2>
                <p className="sub">Every repo is treated as professional work — designed, documented, reviewed. Pick your battlefield.</p>
                <div className="domains">
                    {domains.map(d => (
                        <article key={d.title} className="dom" style={{ '--c': d.c, '--cl': d.cl } as React.CSSProperties}>
                            <span className="tag">{d.tag}</span>
                            <h3>{d.title}</h3>
                            <p>{d.text}</p>
                            <ul>{d.items.map(i => <li key={i}>{i}</li>)}</ul>
                            <span className="glyph">{d.glyph}</span>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
