import { tickerItems } from '@/data/misc'

export default function Ticker() {
  const items = [...tickerItems, ...tickerItems];
  return (
    <div className="ticker" aria-hidden="true">
      <div id="mq">
        {items.map((x, i) => <span key={i}>{`// ${x}`}</span>)}
      </div>
    </div>
  );
}
