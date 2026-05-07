/**
 * One-shot favicon generator.
 * Reads public/favicon.svg, renders at multiple sizes via Puppeteer,
 * writes PNGs into public/.
 *
 * Usage:  node scripts/generate-favicons.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import puppeteer from 'puppeteer'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const PUBLIC = join(ROOT, 'public')

const SIZES = [
  { name: 'favicon-16x16.png',     size: 16 },
  { name: 'favicon-32x32.png',     size: 32 },
  { name: 'favicon-192x192.png',   size: 192 },
  { name: 'favicon-512x512.png',   size: 512 },
  { name: 'apple-touch-icon.png',  size: 180 },
  { name: 'favicon.png',           size: 32 },
]

const svg = readFileSync(join(PUBLIC, 'favicon.svg'), 'utf8')

const browser = await puppeteer.launch({ headless: 'new' })
const page = await browser.newPage()

for (const { name, size } of SIZES) {
  const html = `<!doctype html><html><head><style>
    * { margin: 0; padding: 0; }
    html, body { background: transparent; }
    .wrap { width: ${size}px; height: ${size}px; }
    .wrap svg { display: block; width: 100%; height: 100%; }
  </style></head><body><div class="wrap">${svg}</div></body></html>`

  await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 })
  await page.setContent(html, { waitUntil: 'domcontentloaded' })
  await new Promise(r => setTimeout(r, 80)) // tiny paint settle
  const png = await page.screenshot({
    type: 'png',
    omitBackground: true,
    clip: { x: 0, y: 0, width: size, height: size },
  })
  writeFileSync(join(PUBLIC, name), png)
  console.log(`✓ ${name}  (${size}x${size}, ${png.length} bytes)`)
}

await browser.close()
console.log('\nAll favicons generated.')
