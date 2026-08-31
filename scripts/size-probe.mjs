#!/usr/bin/env node
// Бюджеты размера: собирает пробники поверх РЕАЛЬНО упакованного пакета и
// сверяет с лимитами из scripts/size-budgets.json.
//
// Почему через `npm pack`, а не alias на папку: alias подставляет путь
// напрямую и обходит `exports` в package.json — именно так первая версия
// пробника «не увидела» subpath-импорты и выдала ложный результат. Здесь
// пакет ставится тарболом, то есть ровно так, как его получит микрофронт.
//
// Сборка идёт через JS API Vite из этого репозитория: плагины берутся
// отсюда, а `root` указывает во временную папку, поэтому `@core/ui-kit`
// резолвится из её `node_modules` по своим `exports`.
//
// Запуск:
//   node scripts/size-probe.mjs             проверить бюджеты
//   node scripts/size-probe.mjs --update    переписать лимиты по факту (+20%)
import { execFileSync } from "node:child_process"
import { gzipSync } from "node:zlib"
import { mkdtempSync, writeFileSync, readFileSync, rmSync, cpSync } from "node:fs"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { build } from "vite"
import react from "@vitejs/plugin-react"

const BUDGETS_FILE = "scripts/size-budgets.json"

// Сценарии — ровно то, чем меряется реальная плата микрофронта.
const SCENARIOS = [
  {
    name: "одна иконка",
    code: `import { Lock } from "@core/ui-kit/icons/lock"\nexport default () => <Lock />`,
  },
  {
    name: "кнопка",
    code: `import { Button } from "@core/ui-kit/button"\nexport default () => <Button>ок</Button>`,
  },
  {
    name: "кнопка + иконка",
    code: `import { Button } from "@core/ui-kit/button"\nimport { Lock } from "@core/ui-kit/icons/lock"\nexport default () => <Button icon={<Lock />}>ок</Button>`,
  },
  {
    name: "корневой импорт кнопки",
    code: `import { Button } from "@core/ui-kit"\nexport default () => <Button>ок</Button>`,
  },
]

const fmt = (n) => `${(n / 1024).toFixed(1)} КБ`
const update = process.argv.includes("--update")

console.log("Пакую библиотеку…")
const packed = execFileSync(
  "npm",
  ["pack", "--pack-destination", tmpdir(), "--silent"],
  { encoding: "utf8", shell: true }
)
  .trim()
  .split("\n")
  .pop()
  .trim()
const tarball = join(tmpdir(), packed)

const dir = mkdtempSync(join(tmpdir(), "ui-kit-size-probe-"))
cpSync(tarball, join(dir, "pkg.tgz"))
writeFileSync(
  join(dir, "package.json"),
  JSON.stringify(
    {
      name: "size-probe",
      private: true,
      type: "module",
      dependencies: { "@core/ui-kit": "file:./pkg.tgz" },
    },
    null,
    2
  )
)

console.log("Ставлю пакет…")
execFileSync(
  "npm",
  ["install", "--no-audit", "--no-fund", "--ignore-scripts", "--legacy-peer-deps"],
  { cwd: dir, stdio: "ignore", shell: true }
)

const results = []
for (const scenario of SCENARIOS) {
  writeFileSync(join(dir, "entry.jsx"), scenario.code)
  const output = await build({
    root: dir,
    logLevel: "error",
    plugins: [react()],
    build: {
      outDir: "out",
      emptyOutDir: true,
      write: false,
      lib: { entry: "entry.jsx", formats: ["es"], fileName: "probe" },
      // react/@base-ui даёт хост — в вес микрофронта они не входят.
      rollupOptions: { external: [/^react/, /^@base-ui/] },
    },
  })
  const chunk = output[0].output.find((o) => o.type === "chunk")
  const bytes = Buffer.from(chunk.code)
  results.push({
    name: scenario.name,
    raw: bytes.length,
    gzip: gzipSync(bytes, { level: 9 }).length,
  })
}

rmSync(dir, { recursive: true, force: true })
rmSync(tarball, { force: true })

const budgets = JSON.parse(readFileSync(BUDGETS_FILE, "utf8"))
let failed = false

console.log()
for (const r of results) {
  const limit = budgets[r.name]
  const over = limit !== undefined && r.gzip > limit
  if (over) failed = true
  console.log(
    `${over ? "ПРЕВЫШЕН" : "ok      "} ${r.name.padEnd(24)}` +
      `${fmt(r.raw).padStart(10)} raw  ${fmt(r.gzip).padStart(10)} gzip  ` +
      `(${limit === undefined ? "нет лимита" : `лимит ${fmt(limit)}`})`
  )
}

if (update) {
  // Запас 20%, округление до килобайта — чтобы бюджет не падал от шума.
  const next = Object.fromEntries(
    results.map((r) => [r.name, Math.ceil((r.gzip * 1.2) / 1024) * 1024])
  )
  writeFileSync(BUDGETS_FILE, `${JSON.stringify(next, null, 2)}\n`)
  console.log(`\nЛимиты обновлены (+20% запаса) → ${BUDGETS_FILE}`)
} else if (failed) {
  console.error("\nБюджет превышен — размер вырос относительно зафиксированного.")
  process.exit(1)
}
