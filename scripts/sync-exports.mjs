#!/usr/bin/env node
// Синхронизирует карту `exports` в package.json со списком компонентов.
//
// Компоненты перечисляются ЯВНО, а не шаблоном `./*`:
// - шаблон делает публичным всё, что попадает под него, — новая папка в
//   src/components/ui автоматически становится частью публичного API, и
//   никто этого не замечает;
// - по шаблону TypeScript не может перечислить доступные subpath'ы, поэтому
//   автоимпорт в IDE их не предлагает;
// - опечатка в импорте по шаблону даёт «файл не найден» вместо внятного
//   ERR_PACKAGE_PATH_NOT_EXPORTED.
//
// Иконки остаются шаблоном `./icons/*`: их 505, явный список раздул бы
// package.json на две тысячи строк, а имена берутся из одного источника.
//
// Тот же список задаёт и блок реэкспортов в src/index.ts. Раньше бочонок
// вёлся руками и разошёлся: `bank-card`, `divider`, `dropdown`,
// `filter-table`, `header`, `mail-feed` и `title` были доступны подпутём
// (`@core/ui-kit/dropdown`), но не из корня (`import { Dropdown } from
// "@core/ui-kit"`). Столкновений имён у них нет — это был чистый дрейф,
// поэтому источник правды теперь один.
//
// Запуск:
//   node scripts/sync-exports.mjs           переписать exports и src/index.ts
//   node scripts/sync-exports.mjs --check   упасть, если список устарел (CI)
import { readdirSync, existsSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const COMPONENTS_DIR = "src/components/ui"
const PACKAGE_JSON = "package.json"
const ENTRY = "src/index.ts"
const BEGIN = "// <<< components"
const END = "// >>> components"
const check = process.argv.includes("--check")

const components = readdirSync(COMPONENTS_DIR)
  .filter((dir) => existsSync(join(COMPONENTS_DIR, dir, "index.ts")))
  .sort()

const exportsMap = {
  ".": { types: "./dist/index.d.ts", import: "./dist/index.js" },
  "./style.css": "./dist/index.css",
  "./package.json": "./package.json",
  // Шаблон должен идти до компонентов: у Node выигрывает более длинный
  // префикс до «*», так что `./icons/lock` не перехватывается общим правилом.
  "./icons/*": {
    types: "./dist/icons/*.d.ts",
    import: "./dist/icons/*.js",
  },
}

for (const name of components) {
  exportsMap[`./${name}`] = {
    types: `./dist/components/ui/${name}/index.d.ts`,
    import: `./dist/components/ui/${name}/index.js`,
  }
}

// Блок реэкспортов в src/index.ts между маркерами.
const entrySource = readFileSync(ENTRY, "utf8")
const eol = entrySource.includes("\r\n") ? "\r\n" : "\n"
const lines = entrySource.split(eol)
const from = lines.findIndex((l) => l.startsWith(BEGIN))
const to = lines.findIndex((l) => l.startsWith(END))
if (from === -1 || to === -1 || to < from) {
  console.error(`В ${ENTRY} не нашлись маркеры "${BEGIN}" и "${END}".`)
  process.exit(1)
}
const entryBlock = [
  `${BEGIN}: список ниже держит scripts/sync-exports.mjs, руками не правьте`,
  ...components.map((name) => `export * from "./components/ui/${name}"`),
  END,
]
const nextEntry = [...lines.slice(0, from), ...entryBlock, ...lines.slice(to + 1)].join(eol)

const pkg = JSON.parse(readFileSync(PACKAGE_JSON, "utf8"))
const exportsStale = JSON.stringify(pkg.exports) !== JSON.stringify(exportsMap)
const entryStale = nextEntry !== entrySource

if (!exportsStale && !entryStale) {
  console.log(
    `актуально: ${components.length} компонентов в exports и в ${ENTRY} + иконки шаблоном`
  )
  process.exit(0)
}

if (check) {
  if (exportsStale) {
    const currentKeys = new Set(Object.keys(pkg.exports ?? {}))
    const nextKeys = new Set(Object.keys(exportsMap))
    const missing = [...nextKeys].filter((k) => !currentKeys.has(k))
    const extra = [...currentKeys].filter((k) => !nextKeys.has(k))
    console.error("exports в package.json устарели.")
    if (missing.length) console.error("  не хватает:", missing.join(", "))
    if (extra.length) console.error("  лишние:", extra.join(", "))
  }
  if (entryStale) {
    const listed = new Set(
      lines
        .slice(from + 1, to)
        .map((l) => l.match(/components\/ui\/([\w-]+)/)?.[1])
        .filter(Boolean)
    )
    const missing = components.filter((c) => !listed.has(c))
    const extra = [...listed].filter((c) => !components.includes(c))
    console.error(`Блок реэкспортов в ${ENTRY} устарел.`)
    if (missing.length) console.error("  не хватает:", missing.join(", "))
    if (extra.length) console.error("  лишние:", extra.join(", "))
  }
  console.error("Запустите: node scripts/sync-exports.mjs")
  process.exit(1)
}

if (exportsStale) {
  pkg.exports = exportsMap
  writeFileSync(PACKAGE_JSON, `${JSON.stringify(pkg, null, 2)}\n`)
}
if (entryStale) {
  writeFileSync(ENTRY, nextEntry)
}
console.log(
  `обновлено: ${components.length} компонентов в exports и в ${ENTRY} + иконки шаблоном`
)
