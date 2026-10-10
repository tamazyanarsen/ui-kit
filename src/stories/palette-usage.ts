/**
 * Кто из семантических токенов на какой цвет палитры смотрит — в каждой теме.
 *
 * Для новой темы то же самое лежит готовым в `palette.ts` (поле `usedBy`), а
 * для старой нужно учесть переопределения `[data-product="odl-elk"]` поверх
 * `:root`. Считается прямо из исходников стилей (`?raw`), поэтому витрина не
 * отстаёт от темы и ничего не надо перегенерировать руками.
 */
const SOURCES = import.meta.glob("/src/styles/*.css", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>

const DECL = /--([a-z0-9-]+)\s*:\s*var\(--([a-z0-9-]+)\)\s*;/g
const PALETTE_DECL = /--([a-z0-9-]+)\s*:\s*#[0-9a-f]{3,8}\s*;/gi

function stripComments(css: string) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "")
}

/** Тела блоков верхнего уровня с селектором `selector`. */
function blocks(css: string, selector: string) {
  const out: string[] = []
  let depth = 0
  let start = -1
  let head = ""
  let headStart = 0
  for (let i = 0; i < css.length; i++) {
    const ch = css[i]
    if (ch === "{") {
      if (depth === 0) {
        head = css.slice(headStart, i).trim()
        start = i + 1
      }
      depth++
    } else if (ch === "}") {
      depth--
      if (depth === 0) {
        if (head === selector) out.push(css.slice(start, i))
        headStart = i + 1
      }
    }
  }
  return out
}

function declarations(body: string) {
  const map = new Map<string, string>()
  for (const [, token, ref] of body.matchAll(DECL)) map.set(token, ref)
  return map
}

const files = Object.entries(SOURCES).map(([path, css]) => ({
  name: path.split("/").at(-1) ?? path,
  css: stripComments(css),
}))

const paletteNames = new Set<string>()
for (const file of files.filter((f) => f.name === "palette.css")) {
  for (const body of blocks(file.css, ":root")) {
    for (const [, name] of body.matchAll(PALETTE_DECL)) paletteNames.add(name)
  }
}

const rootMap = new Map<string, string>()
for (const file of files.filter((f) => f.name.startsWith("tokens-"))) {
  for (const body of blocks(file.css, ":root")) {
    for (const [token, ref] of declarations(body)) rootMap.set(token, ref)
  }
}

const odlMap = new Map(rootMap)
for (const file of files.filter((f) => f.name === "theme-odl-elk.css")) {
  for (const body of blocks(file.css, '[data-product="odl-elk"]')) {
    for (const [token, ref] of declarations(body)) odlMap.set(token, ref)
  }
}

/** Токен → цвет палитры: цепочки `--a: var(--b)` проходятся до конца. */
function resolve(map: Map<string, string>, token: string) {
  let ref = map.get(token)
  for (let hop = 0; ref && !paletteNames.has(ref) && hop < 10; hop++) {
    ref = map.get(ref)
  }
  return ref && paletteNames.has(ref) ? ref : null
}

function invert(map: Map<string, string>) {
  const users = new Map<string, string[]>()
  for (const token of map.keys()) {
    const color = resolve(map, token)
    if (!color) continue
    users.set(color, [...(users.get(color) ?? []), token])
  }
  return users
}

/** Цвет палитры → семантические токены, которые его рисуют в старой теме. */
export const ODL_USAGE = invert(odlMap)
