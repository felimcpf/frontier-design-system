// scripts/sync-figma.js
// Fetches colour palettes from the Frontier Products Team Figma file and
// writes them back into the product token JSON files.
// Run: npm run sync-figma   (requires .env with FIGMA_TOKEN + FIGMA_FILE_KEY)

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const FIGMA_TOKEN = process.env.FIGMA_TOKEN
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY

if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
  console.error('❌  Missing FIGMA_TOKEN or FIGMA_FILE_KEY — create a .env file (see FIGMA_SETUP.md)')
  process.exit(1)
}

const COLOURS_PAGE_NODE = '2:4574'  // ↳ Colours page node ID

// Maps the frame names in Figma → which token file to write
const PRODUCT_MAP = {
  'docCentral Colours':   'doc-central',
  'navCentral Colours':   'nav-central',
  'draftCentral Colours': 'draft-central',
  'agentCentral Colours': 'agent-central',
}

async function fetchFigma(path) {
  const res = await fetch(`https://api.figma.com/v1${path}`, {
    headers: { 'X-Figma-Token': FIGMA_TOKEN },
  })
  if (!res.ok) throw new Error(`Figma API error ${res.status}: ${await res.text()}`)
  return res.json()
}

function toHex(r, g, b) {
  return '#' + [r, g, b].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('').toUpperCase()
}

/** Walk a Figma node tree and extract named rectangle fills as colour swatches */
function extractSwatches(node, swatches = []) {
  if ((node.type === 'RECTANGLE' || node.type === 'FRAME') && node.fills?.length) {
    const fill = node.fills.find(f => f.type === 'SOLID' && f.visible !== false)
    if (fill) {
      swatches.push({ name: node.name, hex: toHex(fill.color.r, fill.color.g, fill.color.b) })
    }
  }
  if (node.children) {
    for (const child of node.children) extractSwatches(child, swatches)
  }
  return swatches
}

/** Map swatch names (50–950) → shade index */
const SHADE_NAMES = ['950', '900', '800', '700', '600', '500', '400', '300', '200', '100', '50']

function buildPalette(swatches) {
  // The palette is rendered dark→light in Figma, matching SHADE_NAMES order
  const colorSwatches = swatches.filter(s => SHADE_NAMES.includes(s.name))
  // Deduplicate by taking the first occurrence of each shade in order
  const seen = new Set()
  const ordered = []
  for (const s of colorSwatches) {
    if (!seen.has(s.name)) { seen.add(s.name); ordered.push(s) }
  }
  const palette = {}
  ordered.forEach((s, i) => { palette[SHADE_NAMES[i]] = s.hex })
  return palette
}

async function run() {
  console.log('🎨  Fetching colour data from Figma…')
  const file = await fetchFigma(`/files/${FIGMA_FILE_KEY}/nodes?ids=${COLOURS_PAGE_NODE}`)
  const pageNode = file.nodes[COLOURS_PAGE_NODE]?.document
  if (!pageNode) throw new Error('Could not find Colours page node')

  const tokensDir = path.join(ROOT, 'tokens')

  for (const [frameName, productName] of Object.entries(PRODUCT_MAP)) {
    const frame = pageNode.children?.find(n => n.name === frameName)
    if (!frame) { console.warn(`  ⚠️  Frame "${frameName}" not found — skipping`); continue }

    const swatches = extractSwatches(frame)
    const primaryPalette = buildPalette(swatches)

    const tokenFile = path.join(tokensDir, `${productName}.json`)
    const existing = JSON.parse(fs.readFileSync(tokenFile, 'utf8'))
    existing.color.primary = primaryPalette
    fs.writeFileSync(tokenFile, JSON.stringify(existing, null, 2) + '\n')
    console.log(`  ✓ Updated ${productName}.json (primary: ${Object.values(primaryPalette)[5] ?? '?'})`)
  }

  console.log('\n🔄  Regenerating theme CSS…')
  execSync('node scripts/generate-themes.js', { cwd: ROOT, stdio: 'inherit' })
  console.log('\n✅  Figma sync complete!')
}

run().catch(err => { console.error('❌ ', err.message); process.exit(1) })
