import RainCanvas from './RainCanvas'
import Terminal from './Terminal'

export default function Hero() {
  return (
    <div className="hero" id="top">
      <RainCanvas />
      <div className="wrap">
        <span className="eyebrow"><i></i>open-source engineering collective</span>
        <h1 className="disp">
          Open<br />
          <span className="ghost">Source.</span><br />
          <span className="fx glitch" data-t={'No\u00a0Limits.'}>No&nbsp;Limits.</span>
        </h1>
        <p className="lead">
          APW Labs grew out of the <b>AndroidPortWorld</b> porting community. Today we build production-grade software
          across <b>Android systems</b>, <b>web &amp; cloud</b>, <b>desktop tools</b> and <b>edge AI</b> — real repos, not tutorials.
        </p>
        <div className="cta">
          <a className="btn" href="https://github.com/APW-Labs" target="_blank" rel="noopener">Join on GitHub</a>
          <a className="btn alt" href="#domains">What we build</a>
        </div>
        <Terminal />
      </div>
    </div>
  )
}
