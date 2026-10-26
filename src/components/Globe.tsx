'use client'
import { useEffect, useRef } from 'react'
import world from '@/data/world.json'
import { globeConfig, globeLegend, globeText } from '@/data/globe'

type Ring = number[][]
type Geometry = { type: 'Polygon'; coordinates: Ring[] } | { type: 'MultiPolygon'; coordinates: Ring[][] }
type Country = { name: string; rings: Ring[]; on: boolean }

const RAD = Math.PI / 180
const highlighted = new Set(globeConfig.highlighted)

const countries: Country[] = (world.features as { properties: { name: string }; geometry: Geometry }[]).map(f => {
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates
    return { name: f.properties.name, rings: polys.flatMap(p => p), on: highlighted.has(f.properties.name) }
})

export default function Globe() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current!
        const ctx = canvas.getContext('2d')!
        const RM = matchMedia('(prefers-reduced-motion: reduce)').matches

        let lon = globeConfig.start.lon
        let lat = globeConfig.start.lat
        let size = 0
        let raf = 0
        let last = 0
        let visible = true
        let dragging = false
        let px = 0, py = 0
        let colors = readColors()

        function readColors() {
            const s = getComputedStyle(canvas)
            const v = (n: string) => s.getPropertyValue(n).trim()
            return { sea: v('--globe-sea'), land: v('--globe-land'), edge: v('--globe-edge'), hi: v('--globe-hi'), hiEdge: v('--globe-hi-edge'), grid: v('--globe-grid') }
        }

        function resize() {
            const dpr = Math.min(devicePixelRatio || 1, 2)
            size = canvas.clientWidth
            canvas.width = canvas.height = Math.round(size * dpr)
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            draw()
        }

        // Orthographic projection. Points on the far side are pushed onto the
        // horizon circle so filled shapes still close up cleanly.
        function project(lo: number, la: number, R: number, c: number) {
            const l = (lo - lon) * RAD, p = la * RAD, p0 = lat * RAD
            const cp = Math.cos(p)
            let x = cp * Math.sin(l)
            let y = Math.cos(p0) * Math.sin(p) - Math.sin(p0) * cp * Math.cos(l)
            const front = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * cp * Math.cos(l) >= 0
            if (!front) { const m = Math.hypot(x, y) || 1; x /= m; y /= m }
            return [c + x * R, c - y * R, front] as const
        }

        function tracePath(ring: Ring, R: number, c: number) {
            ctx.beginPath()
            ring.forEach(([lo, la], i) => {
                const [x, y] = project(lo, la, R, c)
                if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y)
            })
            ctx.closePath()
        }

        function drawGraticule(R: number, c: number) {
            ctx.strokeStyle = colors.grid
            ctx.lineWidth = 1
            const line = (pts: [number, number][]) => {
                let pen = false
                ctx.beginPath()
                for (const [lo, la] of pts) {
                    const [x, y, front] = project(lo, la, R, c)
                    if (front) { if (pen) ctx.lineTo(x, y); else ctx.moveTo(x, y); pen = true } else pen = false
                }
                ctx.stroke()
            }
            for (let lo = -180; lo < 180; lo += 30) {
                const pts: [number, number][] = []
                for (let la = -90; la <= 90; la += 5) pts.push([lo, la])
                line(pts)
            }
            for (let la = -60; la <= 60; la += 30) {
                const pts: [number, number][] = []
                for (let lo = -180; lo <= 180; lo += 5) pts.push([lo, la])
                line(pts)
            }
        }

        function draw() {
            if (!size) return
            const c = size / 2
            const R = c - 3
            ctx.clearRect(0, 0, size, size)

            ctx.beginPath()
            ctx.arc(c, c, R, 0, Math.PI * 2)
            ctx.fillStyle = colors.sea
            ctx.fill()

            ctx.save()
            ctx.beginPath()
            ctx.arc(c, c, R, 0, Math.PI * 2)
            ctx.clip()

            if (globeConfig.graticule) drawGraticule(R, c)

            ctx.lineJoin = 'round'
            // Plain countries first, highlighted ones on top.
            for (const pass of [false, true]) {
                ctx.fillStyle = pass ? colors.hi : colors.land
                ctx.strokeStyle = pass ? colors.hiEdge : colors.edge
                ctx.lineWidth = pass ? 1.5 : 0.7
                for (const k of countries) {
                    if (k.on !== pass) continue
                    for (const ring of k.rings) { tracePath(ring, R, c); ctx.fill(); ctx.stroke() }
                }
            }
            ctx.restore()

            ctx.beginPath()
            ctx.arc(c, c, R, 0, Math.PI * 2)
            ctx.strokeStyle = colors.edge
            ctx.lineWidth = 2
            ctx.stroke()
        }

        function tick(t: number) {
            const dt = last ? Math.min((t - last) / 1000, 0.1) : 0
            last = t
            if (visible && !dragging) {
                lon += globeConfig.speed * dt
                if (lon > 180) lon -= 360
                draw()
            }
            raf = requestAnimationFrame(tick)
        }

        const down = (e: PointerEvent) => { dragging = true; px = e.clientX; py = e.clientY; canvas.setPointerCapture(e.pointerId) }
        const move = (e: PointerEvent) => {
            if (!dragging) return
            lon -= (e.clientX - px) * 0.4
            lat = Math.max(-80, Math.min(80, lat + (e.clientY - py) * 0.4))
            px = e.clientX; py = e.clientY
            draw()
        }
        const up = () => { dragging = false }
        const theme = () => { colors = readColors(); draw() }

        const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0 })
        io.observe(canvas)
        const ro = new ResizeObserver(resize)
        ro.observe(canvas)

        canvas.addEventListener('pointerdown', down)
        canvas.addEventListener('pointermove', move)
        canvas.addEventListener('pointerup', up)
        canvas.addEventListener('pointercancel', up)
        addEventListener('apw-theme', theme)

        resize()
        if (globeConfig.autoRotate && !RM) raf = requestAnimationFrame(tick)

        return () => {
            cancelAnimationFrame(raf)
            io.disconnect()
            ro.disconnect()
            canvas.removeEventListener('pointerdown', down)
            canvas.removeEventListener('pointermove', move)
            canvas.removeEventListener('pointerup', up)
            canvas.removeEventListener('pointercancel', up)
            removeEventListener('apw-theme', theme)
        }
    }, [])

    return (
        <section className="block" id="globe" style={{ borderTop: '1px solid var(--line)' }}>
            <div className="wrap">
                <p className="kicker">{globeText.kicker}</p>
                <h2 className="disp">{globeText.title[0]}<br />{globeText.title[1]}</h2>
                <p className="sub">{globeText.sub}</p>
                <div className="globe-wrap">
                    <canvas ref={canvasRef} className="globe" role="img" aria-label={`World globe with ${globeConfig.highlighted.join(', ')} highlighted`} />
                    <ul className="globe-legend">
                        {globeLegend.map(l => (
                            <li key={l.label}><i className={l.color === 'highlight' ? 'hi' : 'land'}></i>{l.label}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}
