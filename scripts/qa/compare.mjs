import fs from 'node:fs'; import path from 'node:path'; import { PNG } from 'pngjs'; import pixelmatch from 'pixelmatch'
const [a, b] = process.argv.slice(2)
const out = []
for (const f of fs.readdirSync(path.join(a, 'shots'))) {
  const pb = path.join(b, 'shots', f)
  if (!fs.existsSync(pb)) { out.push({ f, diff: 'missing' }); continue }
  const A = PNG.sync.read(fs.readFileSync(path.join(a, 'shots', f))), B = PNG.sync.read(fs.readFileSync(pb))
  if (A.width !== B.width || A.height !== B.height) { out.push({ f, diff: `size ${A.width}x${A.height} vs ${B.width}x${B.height}` }); continue }
  const n = pixelmatch(A.data, B.data, null, A.width, A.height, { threshold: 0.1 })
  if (n > 0) out.push({ f, diff: n })
}
console.log(JSON.stringify(out, null, 1)); console.error('different:', out.length)
