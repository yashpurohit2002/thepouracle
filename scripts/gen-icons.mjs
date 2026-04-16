// Generates icon-192.png and icon-512.png using browser-compatible SVG → PNG via sharp (if available)
// or writes a minimal valid PNG directly.
// Run: node scripts/gen-icons.mjs

import { writeFileSync } from 'fs'
import { createCanvas } from 'canvas'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function makeIcon(size) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')
  const pad = Math.round(size * 0.06)
  const r = Math.round(size * 0.12)

  // Background
  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(0, 0, size, size)

  // Neon border
  ctx.strokeStyle = '#39ff14'
  ctx.lineWidth = Math.max(3, Math.round(size * 0.025))
  ctx.shadowColor = '#39ff14'
  ctx.shadowBlur = Math.round(size * 0.04)
  ctx.beginPath()
  ctx.roundRect(pad, pad, size - pad * 2, size - pad * 2, r)
  ctx.stroke()

  // Big "P"
  ctx.shadowBlur = Math.round(size * 0.06)
  ctx.fillStyle = '#39ff14'
  ctx.font = `bold ${Math.round(size * 0.52)}px "Courier New", monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('P', size / 2, size * 0.46)

  // Small tagline
  ctx.shadowBlur = 0
  ctx.fillStyle = '#ff2d78'
  ctx.font = `${Math.round(size * 0.065)}px "Courier New", monospace`
  ctx.fillText('POURACLE', size / 2, size * 0.76)

  return canvas.toBuffer('image/png')
}

try {
  const { createCanvas: _ } = await import('canvas')
  const out192 = path.join(__dirname, '../public/icon-192.png')
  const out512 = path.join(__dirname, '../public/icon-512.png')
  writeFileSync(out192, makeIcon(192))
  writeFileSync(out512, makeIcon(512))
  console.log('Icons generated: icon-192.png, icon-512.png')
} catch (e) {
  console.warn('canvas package not available — install it with: npm install canvas')
  console.warn('Alternatively, drop your own 192×192 and 512×512 PNGs into public/')
}
