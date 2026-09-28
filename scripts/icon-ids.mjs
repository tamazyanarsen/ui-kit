// Внутренние id иконок (clipPath, mask) — часть конвейера `optimize-icons.mjs`.
//
// Figma выгружает каждую иконку с жёстко прописанными id вида
// `calendar-16-clip0_70326_26`. id в HTML общие для всего документа: две
// одинаковые иконки на странице дают повторяющийся id, а ссылка `url(#…)`
// у второй указывает на обрезку первой. Правило конвейера:
//
// 1. clipPath, который обрезает по прямоугольнику не меньше viewBox, ничего не
//    обрезает (svg и так обрезан своим окном) — удаляется вместе со ссылкой.
//    Так уходит большая часть id: Figma кладёт такую обрезку по рамке почти
//    в каждую иконку.
// 2. Оставшиеся id (настоящие обрезки, маски) делаются уникальными на
//    экземпляр: `id={`${uid}-…`}`, где `uid` — `useId()` компонента.
//
// Внутри SVGO id живут в виде `__uid__-…` (JSX-выражения в XML недопустимы),
// в JSX они переводятся функциями `uidToPlaceholder` / `placeholderToUid`.

const PLACEHOLDER = "__uid__-"
const EPS = 0.01

/** JSX-форма id в разметочную, понятную SVGO. */
export function uidToPlaceholder(s) {
  return s
    .replace(/id=\{`\$\{uid\}-([^`]+)`\}/g, `id="${PLACEHOLDER}$1"`)
    .replace(/=\{`url\(#\$\{uid\}-([^`)]+)\)`\}/g, `="url(#${PLACEHOLDER}$1)"`)
}

/** Обратно в JSX; литеральные id по пути тоже переводятся на `uid`. */
export function placeholderToUid(s) {
  const literal = [...s.matchAll(/\sid="(?!__uid__-)([^"]+)"/g)].map((m) => m[1])
  let out = s
  for (const id of literal) {
    const local = id.replace(/[^A-Za-z0-9_-]/g, "")
    out = out.replaceAll(`id="${id}"`, `id="${PLACEHOLDER}${local}"`)
    out = out.replaceAll(`"url(#${id})"`, `"url(#${PLACEHOLDER}${local})"`)
  }
  return out
    .replace(/id="__uid__-([^"]+)"/g, "id={`${uid}-$1`}")
    .replace(/="url\(#__uid__-([^")]+)\)"/g, "={`url(#${uid}-$1)`}")
}

/** Вставляет `const uid = useId()` в компонент, если разметка его требует. */
export function ensureUidHook(source) {
  const hasHook = /const uid = useId\(\)/.test(source)
  // Хук больше не нужен: `dropNoopClips` снял последнюю обрезку, и ни одной
  // ссылки на `uid` не осталось. Иначе `noUnusedLocals` роняет сборку типов.
  if (!source.includes("${uid}")) return hasHook ? dropUidHook(source) : source
  if (hasHook) return source
  // Файлы иконок бывают и в CRLF: перевод строки берётся из самого файла.
  const nl = source.includes("\r\n") ? "\r\n" : "\n"
  const withImport = source.includes('from "react"')
    ? source
    : `import { useId } from "react"${nl}${source}`
  return withImport.replace(
    /(export function \w+\(\{[^)]*\}: IconProps\) \{\r?\n)/,
    `$1  // id внутри svg общие для документа: две одинаковые иконки на${nl}` +
      `  // странице иначе ссылались бы на одну маску или обрезку.${nl}` +
      `  const uid = useId().replace(/:/g, "")${nl}`
  )
}

function dropUidHook(source) {
  // Построчно, а не регуляркой по переводам строк: файлы бывают в CRLF.
  const drop = [
    /^ {2}\/\/ id внутри svg общие для документа/,
    /^ {2}\/\/ странице иначе ссылались бы/,
    /^ {2}const uid = useId\(\)/,
    /^import \{ useId \} from "react"/,
  ]
  const nl = source.includes("\r\n") ? "\r\n" : "\n"
  return source
    .split(nl)
    .filter((line) => !drop.some((pattern) => pattern.test(line)))
    .join(nl)
}

function translateOf(value) {
  if (!value) return [0, 0]
  const m = value.match(/^\s*translate\(\s*(-?[\d.]+)(?:[\s,]+(-?[\d.]+))?\s*\)\s*$/)
  return m ? [Number(m[1]), Number(m[2] ?? 0)] : null
}

function rectOf(clip) {
  const kids = clip.children.filter((c) => c.type === "element")
  if (kids.length !== 1) return null
  const [k] = kids
  const t = translateOf(k.attributes.transform)
  if (!t) return null
  if (k.name === "rect") {
    const x = Number(k.attributes.x ?? 0) + t[0]
    const y = Number(k.attributes.y ?? 0) + t[1]
    return [x, y, Number(k.attributes.width), Number(k.attributes.height)]
  }
  if (k.name !== "path") return null
  const m = (k.attributes.d ?? "").match(
    /^M(-?[\d.]+)[ ,](-?[\d.]+)h(-?[\d.]+)v(-?[\d.]+)(?:H(-?[\d.]+)|h(-?[\d.]+))z$/
  )
  if (!m) return null
  const [x, y, w, h] = m.slice(1, 5).map(Number)
  if (m[5] !== undefined ? Math.abs(Number(m[5]) - x) > EPS : Math.abs(Number(m[6]) + w) > EPS) return null
  return [x + t[0], y + t[1], w, h]
}

/**
 * Плагин SVGO: удаляет clipPath, чей прямоугольник в системе ссылающегося
 * элемента покрывает весь viewBox, и ссылки на него. Учитываются только
 * `translate` предков — при любой другой трансформации обрезка остаётся.
 */
export function dropNoopClips(viewBox) {
  const [vx, vy, vw, vh] = viewBox
  return {
    name: "dropNoopClips",
    fn: () => {
      const clips = new Map() // id -> { node, parent }
      const users = new Map() // id -> [{ node, offset | null }]
      const stack = []
      return {
        element: {
          enter(node, parent) {
            const own = translateOf(node.attributes.transform)
            const prev = stack.at(-1) ?? [0, 0]
            const offset = prev && own ? [prev[0] + own[0], prev[1] + own[1]] : null
            stack.push(offset)
            if (node.name === "clipPath" && node.attributes.id) {
              clips.set(node.attributes.id, { node, parent })
            }
            const ref = node.attributes["clip-path"]?.match(/^url\(#(.+)\)$/)?.[1]
            if (ref) users.set(ref, [...(users.get(ref) ?? []), { node, offset }])
          },
          exit() {
            stack.pop()
          },
        },
        root: {
          exit() {
            // Ссылка на обрезку, которой в иконке нет (так пришёл brush-2):
            // сейчас она ничего не делает, но зацепит чужой узел с тем же id.
            for (const [id, refs] of users) {
              if (clips.has(id)) continue
              for (const { node } of refs) delete node.attributes["clip-path"]
            }
            for (const [id, { node, parent }] of clips) {
              const rect = rectOf(node)
              const refs = users.get(id) ?? []
              const noop =
                rect &&
                refs.length > 0 &&
                refs.every(({ offset }) => {
                  if (!offset) return false
                  const x = rect[0] + offset[0]
                  const y = rect[1] + offset[1]
                  return (
                    x <= vx + EPS &&
                    y <= vy + EPS &&
                    x + rect[2] >= vx + vw - EPS &&
                    y + rect[3] >= vy + vh - EPS
                  )
                })
              if (!noop) continue
              parent.children = parent.children.filter((c) => c !== node)
              // Опустевший <defs> уберёт removeEmptyContainers на следующем
              // проходе (multipass).
              for (const { node: user } of refs) delete user.attributes["clip-path"]
            }
          },
        },
      }
    },
  }
}
