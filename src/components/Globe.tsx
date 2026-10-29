
'use client'

import { useEffect, useRef } from 'react'
import { geoOrthographic, geoPath, geoGraticule10 } from 'd3-geo'
import type { FeatureCollection, Geometry } from 'geojson'

import world from '@/data/world.json'
import { globeConfig, globeLegend, globeText } from '@/data/globe'

type CountryProperties = {
  name: string
}

const worldData = world as unknown as FeatureCollection<
  Geometry,
  CountryProperties
>

const highlighted = new Set(globeConfig.highlighted)

export default function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // The assertions make the DOM element and drawing context
    // non-null throughout the nested drawing functions.
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    if (!ctx) return

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    // Initial view centered on India.
    let lon = 82.5
    let lat = 23.5

    let size = 0
    let raf = 0
    let last = 0
    let visible = true
    let dragging = false
    let px = 0
    let py = 0

    function readColors() {
      const styles = getComputedStyle(canvas)

      const get = (name: string, fallback: string) =>
        styles.getPropertyValue(name).trim() || fallback

      return {
        sea: get('--globe-sea', '#10111a'),
        land: get('--globe-land', '#2a2e3b'),
        edge: get('--globe-edge', '#424653'),
        hi: get('--globe-hi', '#a78bfa'),
        hiEdge: get('--globe-hi-edge', '#ddd0ff'),
        grid: get('--globe-grid', '#292c38'),
      }
    }

    let colors = readColors()

    function draw() {
      if (!size) return

      const center = size / 2
      const radius = center - 3

      ctx.clearRect(0, 0, size, size)

      const projection = geoOrthographic()
        .rotate([-lon, -lat])
        .translate([center, center])
        .scale(radius)
        .clipAngle(90)
        .precision(0.2)

      const path = geoPath(projection, ctx)

      // Ocean background.
      ctx.beginPath()
      ctx.arc(center, center, radius, 0, Math.PI * 2)
      ctx.fillStyle = colors.sea
      ctx.fill()

      ctx.save()

      // Clip every feature to the circular globe.
      ctx.beginPath()
      ctx.arc(center, center, radius, 0, Math.PI * 2)
      ctx.clip()

      if (globeConfig.graticule) {
        ctx.beginPath()
        path(geoGraticule10())
        ctx.strokeStyle = colors.grid
        ctx.lineWidth = 0.7
        ctx.stroke()
      }

      // Draw non-highlighted countries before highlighted countries.
      for (const pass of [false, true]) {
        ctx.fillStyle = pass ? colors.hi : colors.land
        ctx.strokeStyle = pass ? colors.hiEdge : colors.edge
        ctx.lineWidth = pass ? 1.3 : 0.6
        ctx.lineJoin = 'round'

        for (const country of worldData.features) {
          if (country.properties?.name == null) continue

          const isHighlighted = highlighted.has(
            country.properties.name
          )

          if (isHighlighted !== pass) continue

          ctx.beginPath()
          path(country)
          ctx.fill()
          ctx.stroke()
        }
      }

      ctx.restore()

      // Outer globe border.
      ctx.beginPath()
      ctx.arc(center, center, radius, 0, Math.PI * 2)
      ctx.strokeStyle = colors.edge
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      size = canvas.clientWidth
      if (!size) return

      canvas.width = Math.round(size * dpr)
      canvas.height = Math.round(size * dpr)

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw()
    }

    function tick(time: number) {
      const dt = last
        ? Math.min((time - last) / 1000, 0.1)
        : 0

      last = time

      if (visible && !dragging) {
        lon += globeConfig.speed * dt

        if (lon > 180) lon -= 360
        if (lon < -180) lon += 360

        draw()
      }

      raf = requestAnimationFrame(tick)
    }

    function onPointerDown(e: PointerEvent) {
      dragging = true
      px = e.clientX
      py = e.clientY
      canvas.setPointerCapture(e.pointerId)
    }

    function onPointerMove(e: PointerEvent) {
      if (!dragging) return

      lon -= (e.clientX - px) * 0.4

      lat = Math.max(
        -80,
        Math.min(80, lat + (e.clientY - py) * 0.4)
      )

      px = e.clientX
      py = e.clientY

      draw()
    }

    function onPointerUp() {
      dragging = false
    }

    function onThemeChange() {
      colors = readColors()
      draw()
    }

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })

    intersectionObserver.observe(canvas)

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerUp)

    window.addEventListener('apw-theme', onThemeChange)

    resize()

    if (globeConfig.autoRotate && !reducedMotion) {
      raf = requestAnimationFrame(tick)
    }

    return () => {
      cancelAnimationFrame(raf)
      intersectionObserver.disconnect()
      resizeObserver.disconnect()

      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)

      window.removeEventListener('apw-theme', onThemeChange)
    }
  }, [])

  return (
    <section
      className="block"
      id="globe"
      style={{ borderTop: '1px solid var(--line)' }}
    >
      <div className="wrap">
        <p className="kicker">{globeText.kicker}</p>

        <h2 className="disp">
          {globeText.title[0]}
          <br />
          {globeText.title[1]}
        </h2>

        <p className="sub">{globeText.sub}</p>

        <div className="globe-wrap">
          <canvas
            ref={canvasRef}
            className="globe"
            role="img"
            aria-label={`World globe with ${globeConfig.highlighted.join(', ')} highlighted`}
          />

          <ul className="globe-legend">
            {globeLegend.map((item) => (
              <li key={item.label}>
                <i
                  className={
                    item.color === 'highlight' ? 'hi' : 'land'
                  }
                />
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
