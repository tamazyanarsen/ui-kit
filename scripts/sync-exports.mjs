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
// Запуск:
//   node scripts/sync-exports.mjs           переписать exports
//   node scripts/sync-exports.mjs --check   упасть, если список устарел (CI)
import { readdirSync, existsSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const COMPONENTS_DIR = "src/components/ui"
const PACKAGE_JSON = "package.json"
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

const pkg = JSON.parse(readFileSync(PACKAGE_JSON, "utf8"))
const current = JSON.stringify(pkg.exports)
const next = JSON.stringify(exportsMap)

if (current === next) {
  console.log(`exports актуальны: ${components.length} компонентов + иконки шаблоном`)
  process.exit(0)
}

if (check) {
  const currentKeys = new Set(Object.keys(pkg.exports ?? {}))
  const nextKeys = new Set(Object.keys(exportsMap))
  const missing = [...nextKeys].filter((k) => !currentKeys.has(k))
  const extra = [...currentKeys].filter((k) => !nextKeys.has(k))
  console.error("exports в package.json устарели.")
  if (missing.length) console.error("  не хватает:", missing.join(", "))
  if (extra.length) console.error("  лишние:", extra.join(", "))
  console.error("Запустите: node scripts/sync-exports.mjs")
  process.exit(1)
}

pkg.exports = exportsMap
writeFileSync(PACKAGE_JSON, `${JSON.stringify(pkg, null, 2)}\n`)
console.log(`exports обновлены: ${components.length} компонентов + иконки шаблоном`)
